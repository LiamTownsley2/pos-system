import { ElectronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'
import { Category } from '../types/category'
import { Product } from '../types/product'
import { StockMovement } from 'src/types/stock_movement'
import { UserAllotmentsLink } from 'src/types/user_allotments'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    db: {
      // Members
      createMember: (member: Omit<Member, 'id' | 'registered_at' | 'short_id'>) => Promise<Member>
      getMemberById: (id: string) => Promise<Member>
      getAllMembers: () => Promise<Member[]>
      updateMember: (
        id: string,
        updates: Partial<Omit<Member, 'id' | 'registered_at'>>
      ) => Promise<Member>
      deleteMember: (id: string) => Promise<boolean>

      // Categories
      createCategory: (category: Omit<Category, 'id'>) => Promise<Category>
      getCategoryById: (id: string) => Promise<Category>
      getCategoryByName: (name: string) => Promise<Category>
      getAllCategories: () => Promise<Category[]>
      updateCategory: (id: string, updates: Omit<Category, 'id'>) => Promise<Category>
      deleteCategory: (id: string) => Promise<boolean>

      // Products
      createProduct: (product: Omit<Product, 'id' | 'quantity'>) => Promise<Product>
      getProductById: (id: string) => Promise<Product>
      getProductByName: (name: string) => Promise<Product>
      getAllProducts: () => Promise<Product[]>
      getProductByCategory: (category: string) => Promise<Product[]>
      updateProduct: (id: string, updates: Omit<Product, 'id' | 'quantity'>) => Promise<Product>
      deleteProduct: (id: string) => Promise<boolean>

      // Stock Movement
      createStockMovement: (
        stock_movement: Omit<StockMovement, 'id' | 'created_at'>
      ) => Promise<StockMovement>
      getStockMovementById: (id: string) => Promise<StockMovement>
      getAllStockMovements: () => Promise<StockMovement[]>

      // Allotment Link
      createAllotmentLink: (
        alllotment_link: Omit<UserAllotmentsLink, 'created_at'>
      ) => Promise<UserAllotmentsLink>
      getAllotmentLinkByGardenId: (id: string) => Promise<UserAllotmentsLink>
      getAllotmentLinkByMemberId: (member_id: string) => Promise<UserAllotmentsLink>
      getAllAllotmentLinks: () => Promise<UserAllotmentsLink[]>
      updateAllotmentLink: (
        id: string,
        updates: Omit<UserAllotmentsLink, 'created_at'>
      ) => Promise<UserAllotmentsLink>
      deleteAllotmentLink: (id: string) => Promise<boolean>
    }
  }
}
