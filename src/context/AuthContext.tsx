
import { api } from '@lib/api'
import { setupApiInterceptors } from '@lib/api-interceptors'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@lib/storage/storageAuthToken'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
  UserDTO,
} from '@lib/storage/storageUser'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications'

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  signOut: () => Promise<void>
  refreshToken: () => Promise<string | null>
  isLoadingUserStorageData: boolean
  loadTransfers: boolean
  setLoadTransfers: (v: boolean) => void
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
)

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const toast = useToast()

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const [loadTransfers, setLoadTransfers] = useState<boolean>(false)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData)
      await storageAuthTokenSave({ token })
    } catch (error) {
      toast.show('Erro ao recuperar dados de usuário...', { type: 'danger' })
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password })
      if (response.data) {
        const { content } = response.data
        
        if (content && content.user && content.user.access_token) {
          const { user } = content
          const token = user.access_token
          
          await storageUserAndTokenSave(user, token)
          userAndTokenUpdate(user, token)
          
          toast.show('Login realizado com sucesso!', { type: 'success' })
        } else {
          throw new Error('Dados de resposta inválidos')
        }
      }
    } catch (error: any) {
      
      const errorMessage = error.response?.data?.message || 
                          'Erro ao autenticar, verifique seus dados e tente novamente!'
      
      toast.show(errorMessage, { type: 'danger' })
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()

      delete api.defaults.headers.common['Authorization']
      
      toast.show('Usuário desconectado com sucesso!', { type: 'success' })
    } catch (error) {
      toast.show('Erro ao fazer logout', { type: 'danger' })
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function refreshToken(): Promise<string | null> {
    try {
      const { token } = await storageAuthTokenGet()
      
      if (!token) {
        return null
      }

      const response = await api.post('/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data && response.data.status === 'success') {
        const newToken = response.data.access_token || response.data.content?.access_token
        
        if (newToken) {
          
          await storageAuthTokenSave({ token: newToken })
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

          if (user && user.id) {
            const updatedUser = { ...user, access_token: newToken }
            setUser(updatedUser)
            await storageUserSave(updatedUser)
          }
          
          return newToken
        }
      }
      
      return null
    } catch (error: any) {
      return null
    }
  }

  useEffect(() => {
    loadUserData()

    setupApiInterceptors(refreshToken, signOut)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        updateUserProfile,
        signOut,
        refreshToken,
        isLoadingUserStorageData,
        loadTransfers,
        setLoadTransfers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
