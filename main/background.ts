import { exec } from 'child_process'
import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

// ✅ 특정 경로의 파일 실행 (Windows 기준: .exe, macOS/Linux: 실행 가능한 파일)
ipcMain.handle('run-file', async (_, filePath: string) => {
  return new Promise((resolve, reject) => {
    exec(`"${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message)
      } else {
        resolve(stdout || stderr)
      }
    })
  })
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
