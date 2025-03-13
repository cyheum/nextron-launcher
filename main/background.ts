import { exec, execSync } from 'child_process'
import path from 'path'
import { app, ipcMain, dialog } from 'electron'
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
    const newPath = (targetPath = path.normalize(targetPath).toLowerCase())

    // Windows: 실행 중인 프로세스의 실행 경로 확인
    const output = execSync(`wmic process get ExecutablePath`).toString()
    return output.toLowerCase().includes(newPath)
  } catch (error) {
    console.error('프로세스 확인 중 오류 발생:', error)
    return false
  }
}

function runFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `start "" ${filePath}`
    console.log(`실행 명령어: ${command}`)
    exec(command, (error) => {
      if (error) {
        reject(`❌ 실행 실패: ${filePath}, 오류: ${error.message}`)
      } else {
        resolve(`✅ 실행 완료: ${filePath}`)
      }
    })
  })
}

// ✅ 특정 경로의 파일 실행 (Windows 기준: .exe, macOS/Linux: 실행 가능한 파일)
ipcMain.handle('run-file', async (_, filePath: string) => {
  if (isProcessRunningByPath(filePath)) {
    dialog.showMessageBox({
      type: 'warning',
      title: '프로그램 실행 중',
      message: '이미 실행 중입니다.',
      buttons: ['확인'],
    })
    return '이미 실행 중입니다.'
  }

  try {
    // 첫 번째 파일 실행
    const result1 = await runFile(filePath)

    return `${result1}`
  } catch (error) {
    return error
  }

  // return new Promise((resolve, reject) => {

  //   exec(
  //     `start "" ${filePath} & start "" ${filePath2}`,
  //     (error, stdout, stderr) => {
  //       if (error) {
  //         reject(error.message)
  //       } else {
  //         resolve(stdout || stderr)
  //       }
  //     }
  //   )
  // })
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
