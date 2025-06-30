import React from 'react'
import { Card } from './ui/card'
import { Category } from 'src/types/categories'
import { Product } from 'src/types/product'

export default function CarouselCard({
  category,
  products,
  selected
}: {
  category: Category
  products: Product[]
  selected: boolean | null
}): React.JSX.Element {
  const additional_styling = selected ? 'border-blue-300' : 'hover:bg-accent'
  return (
    <Card
      className={`text-center flex flex-row justify-center items-center gap-3 border ${additional_styling}`}
    >
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category?.colour }} />
      <div className="flex flex-row gap-3">
        <p>{category.name.replace(/([A-Z])/g, ' $1').trim()}</p>
        <p>
          {'('}
          <strong>
            {
              (category.id == '-1'
                ? products
                : products.filter((product) => product.category == category.id)
              ).length
            }
          </strong>{' '}
          items)
        </p>
      </div>
    </Card>
  )
}
