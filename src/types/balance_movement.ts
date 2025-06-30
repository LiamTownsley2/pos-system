export type BalanceMovement = {
  id: string
  member_id: string
  type: 'in' | 'out'
  amount: number
  created_at: string
}
