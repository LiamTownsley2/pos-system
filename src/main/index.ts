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
