import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { hoverShadowClass } from '@renderer/lib/utils'
import { ShoppingCartIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { Category } from 'src/types/categories'
import { Product } from 'src/types/product'

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP'
})

export default function ProductCard({
  product,
  onClick
}: {
  product: Product
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
}): React.JSX.Element {
  const [category, setCategory] = React.useState<Category | undefined>(undefined)
  useEffect(() => {
    async function fetchCategory(): Promise<void> {
      const _category = await window.db.getCategoryById(product.category.toString())
      setCategory(_category)
    }
    fetchCategory()
  }, [product.category])
  return (
    <Card
      className={`transform duration-200 hover:scale-105 gap-2 select-none flex flex-col justify-between ${hoverShadowClass[category?.id || 0]}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">
          {formatter.format(product.price_per_unit)} / {product.unit}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category?.colour }} />
          <span className="text-xs">{category?.name.replace('and', '&')}</span>
        </div>

        <div className="text-xs flex">
          <ShoppingCartIcon height={15} />
          <span>{Math.floor(Math.random() * 1000)} in stock</span>
        </div>
      </CardFooter>
    </Card>
  )
}
