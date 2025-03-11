import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [message, setMessage] = React.useState('No message found')
  const [status, setStatus] = useState('')

  useEffect(() => {
    window.ipc.on('message', (message: string) => {
      setMessage(message)
    })
  }, [])

  const runFile = async () => {
    try {
      // 실행할 파일 경로 (예제: Windows의 메모장 실행)
      const filePath = 'C:\\Users\\metazone\\Desktop\\electron.txt'

      if (window.electronAPI) {
        console.log('electronAPI is exist')
        await window.electronAPI.runFile(filePath)
        setStatus('파일 실행됨!')
      } else {
        console.log('electronAPI not found')
        setStatus('Electron API를 찾을 수 없음.')
      }
    } catch (error) {
      console.log('error')
      setStatus(`오류 발생: ${error}`)
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (basic-lang-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -<Link href='/next'>Go to next page</Link>
        </p>
        <Image
          src='/images/logo.png'
          alt='Logo image'
          width={256}
          height={256}
        />
      </div>
      <div>
        <button
          onClick={() => {
            window.ipc.send('message', 'Hello')
          }}
        >
          Test IPC
        </button>
        <p>{message}</p>
      </div>
      <div>
        <button onClick={runFile}>Test Run File</button>
        <p>{status}</p>
      </div>
    </React.Fragment>
  )
}
