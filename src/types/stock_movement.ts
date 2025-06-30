export type StockMovement = {
  id: string
  product_id: string
  type: 'in' | 'out'
  quantity: number
  created_at: string
}
