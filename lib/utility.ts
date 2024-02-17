export const getTitleOrUntitled = (title: string | null) => {
  if (title) {
    return title
  }
  return 'Untitled'
}
