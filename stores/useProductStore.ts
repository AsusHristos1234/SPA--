import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: number
  title: string
  url: string
  thumbnailUrl: string
  isLiked: boolean
  description?: string
  price?: number
  category?: string
}

interface ProductStore {
  products: Product[]
  searchQuery: string
  filters: {
    category: string
    priceRange: [number, number]
    showLiked: boolean
  }
  initializeProducts: (products: Product[]) => void
  toggleLike: (id: number) => void
  deleteProduct: (id: number) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: number, updates: Partial<Product>) => void
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<ProductStore['filters']>) => void
  getFilteredProducts: () => Product[]
  getPaginatedProducts: (page: number, limit: number) => Product[]
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      searchQuery: '',
      filters: {
        category: 'all',
        priceRange: [0, 1000],
        showLiked: false
      },
      
      initializeProducts: (products) => set({ 
        products: products.map(p => ({ 
          ...p, 
          isLiked: false,
          price: p.price || Math.floor(Math.random() * 1000) + 10,
          category: p.category || ['electronics', 'clothing', 'books', 'home'][Math.floor(Math.random() * 4)],
          description: p.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
        }))
      }),
      
      toggleLike: (id) => set((state) => ({
        products: state.products.map(product =>
          product.id === id ? { ...product, isLiked: !product.isLiked } : product
        )
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(product => product.id !== id)
      })),
      
      addProduct: (productData) => set((state) => ({
        products: [
          {
            ...productData,
            id: Math.max(0, ...state.products.map(p => p.id)) + 1,
            isLiked: false
          },
          ...state.products
        ]
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(product =>
          product.id === id ? { ...product, ...updates } : product
        )
      })),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      getFilteredProducts: () => {
        const { products, searchQuery, filters } = get()
        return products.filter(product => {
          const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
          const matchesCategory = filters.category === 'all' || product.category === filters.category
          const matchesPrice = product.price 
            ? product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
            : true
          const matchesLiked = !filters.showLiked || product.isLiked
          return matchesSearch && matchesCategory && matchesPrice && matchesLiked
        })
      },
      
      getPaginatedProducts: (page, limit) => {
        const filtered = get().getFilteredProducts()
        const start = (page - 1) * limit
        return filtered.slice(start, start + limit)
      }
    }),
    {
      name: 'product-storage'
    }
  )
)