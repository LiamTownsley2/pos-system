export type Product = {
  id: string
  name: string
  unit: string
  price_per_unit: number
  quantity: number
  category: string
}

export type TranscriptProduct = Omit<Product, 'quantity' | 'category'> & {
  amount: number
}
