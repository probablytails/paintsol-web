import { ImageType, ImageVersion } from '@/services/image'

export type Artist = {
  deca_username: string | null
  foundation_username: string | null
  has_profile_picture: boolean
  id: number
  images?: Image[]
  instagram_username: string | null
  name: string
  slug: string | null
  superrare_username: string | null
  twitter_username: string | null
}

export type CollectionImage = {
  collection_id: number
  image_id: number
  image_position: number
  image_type: ImageVersion
  preview_position: number | null
  image: Image
}

type CollectionImageTypes = 'general' | 'telegram-stickers' | 'discord-stickers'

export type CollectionQueryType = 'general' | 'telegram-stickers' | 'discord-stickers' | 'stickers' | 'all'

export type CollectionQuerySort = 'alphabetical' | 'reverse-alphabetical' | 'newest' | 'oldest'

export type Collection = {
  id: number
  preview_images: CollectionImage[]
  slug: string | null
  stickers_url: string | null
  title: string | null
  type: CollectionImageTypes
}

export type Image = {
  artists: Artist[]
  id: number
  has_animation: boolean
  has_border: boolean
  has_no_border: boolean
  preview_image_type?: ImageVersion
  slug: string | null
  title: string | null
  tags: Tag[]
  type: ImageType
  nextData?: Image | null
  prevData?: Image | null
  created_at: Date
  updated_at: Date
}

export type Tag = {
  id: number
  title: string
}

export type UserInfo = {
  nickname?: string
  picture?: string
} | null

export type FilterTypes = 'by-tag' | 'by-artist'

export type ViewTypes = 'large' | 'small' | 'tiny'

export type BooleanString = 'true' | 'false'
