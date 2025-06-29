import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@renderer/components/ui/carousel'
import CarouselCard from './CarouselCard'
import React, { useEffect } from 'react'
import { Category } from 'src/types/categories'

export default function CategoryCarousel(): React.JSX.Element {
  const [categories, setCategories] = React.useState<Category[]>([])
  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      const _categories = await window.db.getAllCategories()
      setCategories(_categories)
    }
    fetchCategories()
  }, [])
  return (
    <div className="mx-8">
      <Carousel
        className="select-none"
        opts={{
          dragFree: true
        }}
      >
        <CarouselContent>
          {[{ id: -1, name: 'All', image: '', colour: '#000000' }, ...categories].map(
            (category, i) => {
              return (
                <CarouselItem key={i} className="basis-1/3">
                  <CarouselCard category={category} />
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
