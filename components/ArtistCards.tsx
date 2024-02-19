import { Artist } from '@/lib/types'
import styles from '@/styles/components/ArtistCards.module.css'
import ArtistCard from './ArtistCard'

type Props = {
  artists: Artist[]
  endReached?: boolean
}

export default function ArtistCards({ artists, endReached }: Props) {

  const artistCards = artists.map((artist) => {
    return (
      <div
        key={`artist-card-${artist.id}`}>
        <ArtistCard artist={artist} />
      </div>
    )
  })

  return (
    <div className='row'>
      <div className='col-md-1 col-lg-2'></div>
      <div className='col-md-10 col-lg-8'>
        <div className='row'>
          {artistCards}
        </div>
        {
          endReached && (
            <div className={styles['end-reached']}>
              End of list
            </div>
          )
        }
      </div>
      <div className='col-md-1 col-lg-2'></div>
    </div>
  )
}
