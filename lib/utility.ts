export const getImageTitle = (title: string | null) => {
  if (title) {
    return title
  }
  return 'Untitled'
}
