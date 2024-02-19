export const getTitleOrUntitled = (title: string | null) => {
  if (title) {
    return title
  }
  return 'Untitled'
}

export const getNameOrAnonymous = (name: string | null) => {
  if (name) {
    return name
  }
  return 'Anonymous'
}
