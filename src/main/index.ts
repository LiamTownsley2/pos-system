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
