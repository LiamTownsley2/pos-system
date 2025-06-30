import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@renderer/components/ui/carousel'
import CarouselCard from './CarouselCard'
import React from 'react'
import { Category } from 'src/types/categories'
import { Product } from 'src/types/product'

export default function CategoryCarousel({
  products,
  categories,
  filteredCategory,
  setFilteredCategory
}: {
  products: Product[]
  categories: Category[]
  filteredCategory: Category | null
  setFilteredCategory: React.Dispatch<React.SetStateAction<Category | null>>
}): React.JSX.Element {
  return (
    <div className="mx-8">
      <Carousel
        className="select-none"
        opts={{
          dragFree: true
        }}
      >
        <CarouselContent>
          {[{ id: '-1', name: 'All', image: '', colour: '#000000' }, ...categories].map(
            (category, i) => {
              return (
                <CarouselItem
                  key={i}
                  className="basis-1/3"
                  onClick={() => {
                    setFilteredCategory(category)
                  }}
                >
                  <CarouselCard
                    category={category}
                    products={products}
                    selected={filteredCategory?.id == category.id || null}
                  />
                </CarouselItem>
              )
            }
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
