/* eslint-disable @next/next/no-img-element */
'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
} from '@/components/ui/dialog'
import {
  type CarouselApi,
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { SearchResultImage } from '@/lib/types'
import { useAppState } from '@/hooks/state'

interface SearchResultsImageSectionProps {
  images: SearchResultImage[]
  query?: string
}

export const SearchResultsImageSection: React.FC<
  SearchResultsImageSectionProps
> = ({ images, query }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { setState } = useAppState() as any

  // Update the current and count state when the carousel api is available
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Scroll to the selected index
  useEffect(() => {
    if (api) {
      api.scrollTo(selectedIndex, true)
    }
  }, [api, selectedIndex])

  if (!images || images.length === 0) {
    return <div className="text-muted-foreground">No images found</div>
  }

  // If enabled the include_images_description is true, the images will be an array of { url: string, description: string }
  // Otherwise, the images will be an array of strings
  let convertedImages: { url: string; description: string }[] = []
  if (typeof images[0] === 'string') {
    convertedImages = (images as string[]).map(image => ({
      url: image,
      description: ''
    }))
  } else {
    convertedImages = images as { url: string; description: string }[]
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <div className="flex flex-wrap gap-2">
      {convertedImages.slice(0, 4).map((image, index) => (
        <Dialog key={index}>
          {/* <DialogTrigger asChild> */}
          <div
            className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.5rem)] aspect-video cursor-pointer relative"
          // onClick={() => setSelectedIndex(index)}
          >
            <Card className="flex-1 h-full">
              <CardContent className="p-2 h-full w-full">
                {image ? (
                  <img
                    src={image.url}
                    // onClick={}
                    onClick={() => setState("url", image.url)}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={e =>
                      (e.currentTarget.src = '/images/placeholder-image.png')
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-muted animate-pulse" />
                )}
              </CardContent>
            </Card>
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center text-white/80 text-sm">
                <PlusCircle size={24} />
              </div>
            )}
          </div>
        </Dialog>
      ))}
    </div>
  )
}
