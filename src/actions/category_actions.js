export const changeCategory = (category) => {
  return {
    type: 'CHANGE_CATEGORY',
    payload: category
  }
}
export const loadCategories = (categories) => {
  return {
    type: 'LOAD_CATEGORIES',
    payload: categories
  }
}
