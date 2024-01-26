export type Image = {
  artist: string | null
  id: number
  has_animation: boolean
  has_border: boolean
  has_no_border: boolean
  slug: string | null
  title: string | null
  tags: Tag[]
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
