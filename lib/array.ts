export function moveItem(array: any[], id: number, toPosition: 'up' | 'down') {
  // Find the index of the item with the given id
  const index = array.findIndex(item => item.id === id)

  // If the item with the given id is not found, return the original array
  if (index === -1) {
    return array
  }

  // If toPosition is 'up' and the item is not already at the first position
  if (toPosition === 'up' && index > 0) {
    // Swap the item with the previous item
    [array[index], array[index - 1]] = [array[index - 1], array[index]]
  }
  // If toPosition is 'down' and the item is not already at the last position
  else if (toPosition === 'down' && index < array.length - 1) {
    // Swap the item with the next item
    [array[index], array[index + 1]] = [array[index + 1], array[index]]
  }

  return array
}
