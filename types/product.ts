export interface Product {
  id: number
  title: string
  url: string
  thumbnailUrl: string
  isLiked: boolean
  description?: string
  price?: number
  category?: string
}

export interface ProductFormData {
  title: string
  description: string
  price: number
  category: string
  url: string
  thumbnailUrl: string
}