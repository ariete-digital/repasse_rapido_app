
import { api } from '@lib/api'
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
      const {
        data: { content },
      } = await api.post('/login', { email, password })
      if (content) {
        const { user } = content
        await storageUserAndTokenSave(user, user.access_token)
        userAndTokenUpdate(user, user.access_token)
      }
    } catch (error) {
      toast.show('Erro ao autenticar, verifique seus dados \n e tente novamente!', { type: 'danger' })
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
    } catch (error) {
      throw error
    } finally {
      toast.show('Usuário desconectado com sucesso!', { type: 'success' })
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

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        updateUserProfile,
        signOut,
        isLoadingUserStorageData,
        loadTransfers,
        setLoadTransfers,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
