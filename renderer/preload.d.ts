import { IpcHandler } from '../main/preload'

declare global {
  interface Window {
    ipc: IpcHandler
    electronAPI: {
      runFile(path: any, path2?: any): any
    }
  }
}
