export const GET_PRODUCT = `
  query GetProduct($id: String!) {
    product (id: $id ){
      name
      inStock
      gallery
      description
      category
      attributes {
      id
      name
      type
      items {
        id
        displayValue
        value
      }
      }
      prices {
      currency {
        label
      }
      amount
      }
      brand
    }
  }
`
export const GET_HEADER_INFO = `
  query GetHeaderInfo {
    categories {
      name
    }
    currencies {
      label
      symbol
    }
  }
`
export const GET_PRODUCTS = `
  query GetCategory($category: String!) {
    category(input:{title: $category}) {
      name
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            id
            displayValue
            value
          }
        }
        prices {
          currency {
            label
          }
          amount
        }
        brand
      }
    }
  }
`
