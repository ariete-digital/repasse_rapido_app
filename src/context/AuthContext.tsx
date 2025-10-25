
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
      console.log("SignIn email", email);
      console.log("SignIn password", password);
      const response = await api.post('/login', { email, password })
      console.log("SignIn response", response);
      console.log("SignIn response.data", response.data);
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
      console.error('Login error:', error.response?.data || error.message)
      
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
      
      // Call logout API endpoint if user has a token
      const { token } = await storageAuthTokenGet()
      if (token) {
        try {
          await api.post('/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error)
        }
      }
      
      // Clear local storage
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization']
      
      toast.show('Usuário desconectado com sucesso!', { type: 'success' })
    } catch (error) {
      console.error('Logout error:', error)
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
        console.log('No token available for refresh')
        return null
      }

      console.log('Attempting to refresh token...')
      
      const response = await api.post('/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data && response.data.status === 'success') {
        const newToken = response.data.access_token || response.data.content?.access_token
        
        if (newToken) {
          // Atualizar token no storage e no header
          await storageAuthTokenSave({ token: newToken })
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          
          // Atualizar token no objeto do usuário se existir
          if (user && user.id) {
            const updatedUser = { ...user, access_token: newToken }
            setUser(updatedUser)
            await storageUserSave(updatedUser)
          }
          
          console.log('Token refreshed successfully')
          return newToken
        }
      }
      
      console.log('Failed to refresh token - invalid response')
      return null
    } catch (error: any) {
      console.error('Refresh token error:', error.response?.data || error.message)
      return null
    }
  }

  useEffect(() => {
    loadUserData()
    
    // Setup API interceptors with refresh token and signOut functions
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
