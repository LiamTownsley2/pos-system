export type StaffUser = {
  id: string
  username: string
  forename: string
  surname: string
  password_hash: string
  password_last_changed?: number
  must_reset_password?: number
  twofa_enabled: number
  twofa_secret?: string | null
  twofa_backup_codes?: string | null
  created_at: number
}
