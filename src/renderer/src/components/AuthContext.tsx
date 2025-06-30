import { createContext, useContext } from 'react'
import { StaffUser } from 'src/types/staff_users'

export const AuthContext = createContext<{
  user: Omit<StaffUser, 'password_hash' | 'twofa_backup_codes' | 'twofa_secret'> | null
  login: (username: string, password: string) => Promise<{ success: boolean }>
  logout: () => void
  isLoading: boolean
  // is2faVerified: boolean
  // verify2fa: (code: string) => Promise<boolean>
}>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isLoading: true
  // is2faVerified: false,
  // verify2fa: async () => false,
})

export const useAuth = (): React.ContextType<typeof AuthContext> => useContext(AuthContext)
