export type Artist = {
  deca_username: string | null
  foundation_username: string | null
  has_profile_picture: boolean
  id: number
  instagram_username: string | null
  name: string
  slug: string | null
  superrare_username: string | null
  twitter_username: string | null
}

export type Image = {
  artists: Artist[]
  id: number
  has_animation: boolean
  has_border: boolean
  has_no_border: boolean
  slug: string | null
  title: string | null
  tags: Tag[]
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

export type ViewTypes = 'large' | 'small'

export type BooleanString = 'true' | 'false'
