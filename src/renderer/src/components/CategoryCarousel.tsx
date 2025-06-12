import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@renderer/components/ui/carousel'
import { CategoryData } from '@renderer/lib/test-data'
import CarouselCard from './CarouselCard'

export default function CategoryCarousel(): React.JSX.Element {
  return (
    <div className="mx-8">
      <Carousel
        className="select-none"
        opts={{
          dragFree: true
        }}
      >
        <CarouselContent>
          {[{ id: -1, name: 'All', image: '', colour: '#000000' }, ...CategoryData].map(
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
