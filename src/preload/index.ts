import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Member } from '../types/member'
import { Category } from '../types/categories'
import { Product } from '../types/product'
import { StockMovement } from '../types/stock_movement'
import { UserAllotmentsLink } from '../types/user_allotments'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('db', {
      // Members
      createMember: (member: Omit<Member, 'id' | 'registered_at' | 'short_id'>) =>
        ipcRenderer.invoke('db:createMember', member),
      getMemberById: (id: string) => ipcRenderer.invoke('db:getMemberById', id),
      getAllMembers: () => ipcRenderer.invoke('db:getAllMembers'),
      updateMember: (id: string, updates: Partial<Omit<Member, 'id' | 'registered_at'>>) =>
        ipcRenderer.invoke('db:updateMember', id, updates),
      deleteMember: (id: string) => ipcRenderer.invoke('db:deleteMember', id),

      // Categories
      createCategory: (category: Omit<Category, 'id'>) =>
        ipcRenderer.invoke('db:createCategory', category),
      getCategoryById: (id: string) => ipcRenderer.invoke('db:getCategoryById', id),
      getCategoryByName: (name: string) => ipcRenderer.invoke('db:getCategoryByName', name),
      getAllCategories: () => ipcRenderer.invoke('db:getAllCategories'),
      updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) =>
        ipcRenderer.invoke('db:updateCategory', id, updates),
      deleteCategory: (id: string) => ipcRenderer.invoke('db:deleteCategory', id),

      // Products
      createProduct: (product: Omit<Product, 'id'>) =>
        ipcRenderer.invoke('db:createProduct', product),
      getProductById: (id: string) => ipcRenderer.invoke('db:getProductById', id),
      getProductByName: (name: string) => ipcRenderer.invoke('db:getProductByName', name),
      getAllProducts: () => ipcRenderer.invoke('db:getAllProducts'),
      getProductByCategory: (category: string) =>
        ipcRenderer.invoke('db:getProductByCategory', category),
      updateProduct: (id: string, updates: Product) =>
        ipcRenderer.invoke('db:updateProduct', id, updates),
      deleteProduct: (id: string) => ipcRenderer.invoke('db:deleteProduct', id),

      // Stock Movement
      createStockMovement: (stock_movement: Omit<StockMovement, 'id' | 'created_at'>) =>
        ipcRenderer.invoke('db:createStockMovement', stock_movement),
      getStockMovementById: (id: string) => ipcRenderer.invoke('db:getStockMovementById', id),
      getAllStockMovements: () => ipcRenderer.invoke('db:getAllStockMovement'),

      // Allotment Link
      createAllotmentLink: (alllotment_link: Omit<UserAllotmentsLink, 'created_at'>) =>
        ipcRenderer.invoke('db:createAllotmentLink', alllotment_link),
      getAllotmentLinkByGardenId: (id: string) =>
        ipcRenderer.invoke('db:getAllotmentLinkByGardenId', id),
      getAllotmentLinkByMemberId: (member_id: string) =>
        ipcRenderer.invoke('db:getAllotmentLinkByMemberId', member_id),
      getAllAllotmentLinks: () => ipcRenderer.invoke('db:getAllAllotmentLinks'),
      updateAllotmentLink: (id: string, updates: Omit<UserAllotmentsLink, 'created_at'>) =>
        ipcRenderer.invoke('db:updateAllotmentLink', id, updates),
      deleteAllotmentLink: (id: string) => ipcRenderer.invoke('db:deleteAllotmentLink', id)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
