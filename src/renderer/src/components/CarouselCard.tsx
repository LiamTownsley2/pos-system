import React from 'react'
import { Card } from './ui/card'
import { ProductData } from '@renderer/lib/test-data'
import { Category } from 'src/types/categories'

export default function CarouselCard({ category }: { category: Category }): React.JSX.Element {
  return (
    <Card className={`text-center flex flex-row justify-center items-center gap-3 hover:bg-accent`}>
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category?.colour }} />
      <div className="flex flex-row gap-3">
        <p>{category.name.replace(/([A-Z])/g, ' $1').trim()}</p>
        <p>
          {'('}
          <strong>
            {
              (category.id == -1
                ? ProductData
                : ProductData.filter((product) => product.category == category.id)
              ).length
            }
          </strong>{' '}
          items)
        </p>
      </div>
    </Card>
  )
}
