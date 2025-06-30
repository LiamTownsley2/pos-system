export type Receipt = {
  id: string
  member_id: string | null
  total: number
  prepaid_used: number
  cash_paid: number
  created_at: number
}

export type ReceiptItem = {
  id: string
  receipt_id: string
  product_id: string
  name: string
  quantity: number
  price_per_unit: number
  unit: string
}
