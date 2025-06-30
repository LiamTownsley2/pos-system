import { useEffect, useState } from 'react'
import { StaffUser } from 'src/types/staff_users'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }: React.PropsWithChildren): React.ReactElement => {
  const [user, setUser] = useState<Omit<
    StaffUser,
    'password_hash' | 'twofa_backup_codes' | 'twofa_secret'
  > | null>(null)
  // const [is2faVerified, setIs2faVerified] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.db.getCurrentUser().then((_user) => {
      setUser(_user)
      setIsLoading(false)
    })
  }, [])

  const login = async (username: string, password: string): Promise<{ success: boolean }> => {
    const result = await window.db.login(username, password)
    if (result.success) {
      const current = await window.db.getCurrentUser()
      setUser(current)

      // if (current?.twofa_enabled == 1) {
      //   setIs2faVerified(false)
      // } else {
      //   setIs2faVerified(true)
      // }
    }

    return result
  }

  const logout = (): void => {
    setUser(null)
  }

  // const verify2fa = async (code: string): Promise<boolean> => {
  //   try {
  //     // const valid = await window.db.verifyTwoFactor(code)
  //     const valid = true
  //     if (valid) {
  //       setIs2faVerified(true)
  //       return true
  //     } else {
  //       return false
  //     }
  //   } catch {
  //     return false
  //   }
  // }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading // is2faVerified, verify2fa, isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
