import { exec, execSync } from 'child_process'
import path from 'path'
import { app, ipcMain } from 'electron'
// import serve from 'electron-serve'
import { createWindow } from './helpers'

// const isProd = process.env.NODE_ENV === 'production'

// if (isProd) {
//   serve({ directory: 'app' })
// } else {
//   app.setPath('userData', `${app.getPath('userData')} (development)`)
// }
;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // if (isProd) {
  //   await mainWindow.loadURL('app://./home')
  // } else {
  //   const port = process.argv[2]
  //   await mainWindow.loadURL(`http://localhost:${port}/home`)
  //   // mainWindow.webContents.openDevTools()
  // }
  await mainWindow.loadURL(`https://unity-launcher.pages.dev/`)
})()

app.on('window-all-closed', () => {
  app.quit()
})

function isProcessRunningByPath(targetPath: string) {
  try {
    targetPath = path.normalize(targetPath).toLowerCase()

    // Windows: 실행 중인 프로세스의 실행 경로 확인
    const output = execSync(`wmic process get ExecutablePath`).toString()
    return output
      .toLowerCase()
      .split('\n')
      .some((line) => line.trim() === targetPath)
  } catch (error) {
    console.error('프로세스 확인 중 오류 발생:', error)
    return false
  }
}

// ✅ 특정 경로의 파일 실행 (Windows 기준: .exe, macOS/Linux: 실행 가능한 파일)
ipcMain.handle('run-file', async (_, filePath: string) => {
  return new Promise((resolve, reject) => {
    if (isProcessRunningByPath(filePath)) {
      resolve('이미 실행 중입니다.')
      return
    }

    exec(`start "" ${filePath}`, (error, stdout, stderr) => {
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
