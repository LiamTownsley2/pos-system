import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater, type AppUpdater } from 'electron-updater'

import icon from '../../resources/icon.png?asset'
import {
  createMember,
  deleteMember,
  getAllMembers,
  getMemberById,
  updateMember
} from './db/models/members'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory
} from './db/models/categories'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByCategory,
  getProductById,
  getProductByName,
  updateProduct
} from './db/models/products'
import {
  createStockMovement,
  getAllStockMovements,
  getStockMovementById
} from './db/models/stock_movement'
import {
  createAllotmentLink,
  deleteAllotmentLink,
  getAllAllotmentLinks,
  getAllotmentLinkByGardenId,
  getAllotmentLinkByMemberId,
  updateAllotmentLink
} from './db/models/user_allotments'
import {
  createBalanceMovement,
  getAllBalanceMovements,
  getBalanceMovementById
} from './db/models/balance_movement'
import {
  createReceipt,
  createReceiptItem,
  deleteReceipt,
  deleteReceiptItem,
  getAllReceipts,
  getReceiptById,
  getReceiptItemById,
  getReceiptItemsByReceiptId,
  updateReceipt,
  updateReceiptItem
} from './db/models/receipts'
import {
  createInbox,
  getAllInboxes,
  getInboxById,
  getInboxByRecipientId,
  hardDeleteInbox,
  softDeleteInbox,
  updateInbox
} from './db/models/inbox'
import {
  createStaffUser,
  deleteStaffUser,
  getStaffUserById,
  getStaffUserByUsername,
  listStaffUsers,
  updateStaffUser
} from './db/models/staff_users'
import { hash, verify } from 'argon2'
import { StaffUser } from '../types/staff_users'

let currentUser: Omit<StaffUser, 'password_hash' | 'twofa_backup_codes' | 'twofa_secret'> | null =
  null

function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  win.setAspectRatio(16 / 9)

  win.on('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  const url = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && url) {
    win.loadURL(url)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

function setupIPC(): void {
  ipcMain.on('update', () => autoUpdater.checkForUpdatesAndNotify())
  ipcMain.handle('get-app-version', () => app.getVersion())
  ipcMain.handle(
    'encrypt-password',
    async (_e, password) =>
      await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1
      })
  )
  ipcMain.handle('auth:login', async (_e, username, password) => {
    const user = getStaffUserByUsername(username)
    if (!user) return { success: false }

    const valid = await verify(user.password_hash, password)
    if (!valid) return { success: false }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, twofa_backup_codes, twofa_secret, ...userWithoutPassword } = user
    currentUser = userWithoutPassword
    return { success: true }
  })
  ipcMain.handle('auth:getCurrentUser', () => currentUser)

  // Members
  ipcMain.handle('db:createMember', (_e, member) => createMember(member))
  ipcMain.handle('db:getMemberById', (_e, id) => getMemberById(id))
  ipcMain.handle('db:getAllMembers', () => getAllMembers())
  ipcMain.handle('db:updateMember', (_e, id, updates) => updateMember(id, updates))
  ipcMain.handle('db:deleteMember', (_e, id) => deleteMember(id))

  // Categories
  ipcMain.handle('db:createCategory', (_e, category) => createCategory(category))
  ipcMain.handle('db:getCategoryById', (_e, id) => getCategoryById(id))
  ipcMain.handle('db:getCategoryByName', (_e, name) => getCategoryByName(name))
  ipcMain.handle('db:getAllCategories', () => getAllCategories())
  ipcMain.handle('db:updateCategory', (_e, id, updates) => updateCategory(id, updates))
  ipcMain.handle('db:deleteCategory', (_e, id) => deleteCategory(id))

  // Products
  ipcMain.handle('db:createProduct', (_e, product) => createProduct(product))
  ipcMain.handle('db:getProductById', (_e, id) => getProductById(id))
  ipcMain.handle('db:getProductByName', (_e, name) => getProductByName(name))
  ipcMain.handle('db:getAllProducts', () => getAllProducts())
  ipcMain.handle('db:getProductByCategory', (_e, category) => getProductByCategory(category))
  ipcMain.handle('db:updateProduct', (_e, id, updates) => updateProduct(id, updates))
  ipcMain.handle('db:deleteProduct', (_e, id) => deleteProduct(id))

  // Stock Movement
  ipcMain.handle('db:createStockMovement', (_e, stock_movement) =>
    createStockMovement(stock_movement)
  )
  ipcMain.handle('db:getStockMovementById', (_e, id) => getStockMovementById(id))
  ipcMain.handle('db:getAllStockMovement', () => getAllStockMovements())

  // Allotment Link
  ipcMain.handle('db:createAllotmentLink', (_e, allotment_link) =>
    createAllotmentLink(allotment_link)
  )
  ipcMain.handle('db:getAllotmentLinkByGardenId', (_e, id) => getAllotmentLinkByGardenId(id))
  ipcMain.handle('db:getAllotmentLinkByMemberId', (_e, member_id) =>
    getAllotmentLinkByMemberId(member_id)
  )
  ipcMain.handle('db:getAllAllotmentLinks', () => getAllAllotmentLinks())
  ipcMain.handle('db:updateAllotmentLink', (_e, id, updates) => updateAllotmentLink(id, updates))
  ipcMain.handle('db:deleteAllotmentLink', (_e, id) => deleteAllotmentLink(id))

  // Balance Movement
  ipcMain.handle('db:createBalanceMovement', (_e, balance_movement) =>
    createBalanceMovement(balance_movement)
  )
  ipcMain.handle('db:getBalanceMovementById', (_e, id) => getBalanceMovementById(id))
  ipcMain.handle('db:getAllBalanceMovements', () => getAllBalanceMovements())

  // Receipts
  ipcMain.handle('db:createReceipt', (_e, receipt) => createReceipt(receipt))
  ipcMain.handle('db:getReceiptById', (_e, id) => getReceiptById(id))
  ipcMain.handle('db:getAllReceipts', () => getAllReceipts())
  ipcMain.handle('db:updateReceipt', (_e, id, updates) => updateReceipt(id, updates))
  ipcMain.handle('db:deleteReceipt', (_e, id) => deleteReceipt(id))

  // Receipt Items
  ipcMain.handle('db:createReceiptItem', (_e, item) => createReceiptItem(item))
  ipcMain.handle('db:getReceiptItemById', (_e, id) => getReceiptItemById(id))
  ipcMain.handle('db:getReceiptItemsByReceiptId', (_e, receipt_id) =>
    getReceiptItemsByReceiptId(receipt_id)
  )
  ipcMain.handle('db:updateReceiptItem', (_e, id, updates) => updateReceiptItem(id, updates))
  ipcMain.handle('db:deleteReceiptItem', (_e, id) => deleteReceiptItem(id))

  // Inbox
  ipcMain.handle('db:createInbox', (_e, message) => createInbox(message))
  ipcMain.handle('db:getInboxById', (_e, id) => getInboxById(id))
  ipcMain.handle('db:getInboxByRecipientId', (_e, id) => getInboxByRecipientId(id))
  ipcMain.handle('db:getAllInboxes', () => getAllInboxes())
  ipcMain.handle('db:updateInbox', (_e, id, updates) => updateInbox(id, updates))
  ipcMain.handle('db:softDeleteInbox', (_e, id) => softDeleteInbox(id))
  ipcMain.handle('db:hardDeleteInbox', (_e, id) => hardDeleteInbox(id))

  // Staff Management
  ipcMain.handle('db:createStaffUser', (_e, user) => createStaffUser(user))
  ipcMain.handle('db:getStaffUserById', (_e, id) => getStaffUserById(id))
  ipcMain.handle('db:getStaffUserByUsername', (_e, username) => getStaffUserByUsername(username))
  ipcMain.handle('db:listStaffUsers', () => listStaffUsers())
  ipcMain.handle('db:updateStaffUser', (_e, id, updates) => updateStaffUser(id, updates))
  ipcMain.handle('db:deleteStaffUser', (_e, id) => deleteStaffUser(id))
}

function configureAutoUpdater(updater: AppUpdater): void {
  updater.autoDownload = true
  updater.autoInstallOnAppQuit = false

  updater.on('update-downloaded', () => updater.quitAndInstall())
  updater.on('error', (err) => {
    console.error('Auto-update error:', err)
  })

  updater.checkForUpdates()
  setInterval(() => updater.checkForUpdates(), 60_000)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupIPC()
  createMainWindow()
  configureAutoUpdater(autoUpdater)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
