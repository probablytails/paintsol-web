import CollectionCard from '@/components/CollectionCard'
import { Collection } from '@/lib/types'

type Props = {
  collections: Collection[]
  endReached?: boolean
}

export default function CollectionCards({ collections, endReached }: Props) {

  const collectionCards = collections.map((collection) => {
    return (
      <div
        key={`collection-card-${collection.id}`}>
        <CollectionCard collection={collection} />
      </div>
    )
  })

  return (
    <div className='row'>
      <div className='col-md-1 col-lg-2'></div>
      <div className='col-md-10 col-lg-8'>
        <div className='row'>
          {collectionCards}
        </div>
        {
          endReached && (
            <div>
              End of results
            </div>
          )
        }
      </div>
      <div className='col-md-1 col-lg-2'></div>
    </div>
  )
}
