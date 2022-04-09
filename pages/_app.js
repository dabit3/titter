import '../styles/globals.css'
import { css } from '@emotion/css'
import Link from 'next/link'
import { WebBundlr } from "@bundlr-network/client"
import { providers } from "ethers"
import { useState } from 'react'
import { BundlrContext } from '../context'

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState(null)

  async function connect() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready()
  
    const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider)
    await bundlr.ready()
    const balance = await bundlr.getLoadedBalance()
    console.log('balance: ', balance)
  
    setBundlrInstance(bundlr)
  }
  return (
    <div>
      <nav className={navStyle}>
        <Link href="/">
          <a className={linkStyle}>
            <p>Home</p>
          </a>
        </Link>
        <Link href="/account">
          <a className={linkStyle}>
            <p>View Account</p>
          </a>
        </Link>
      </nav>
      <div className={container}>
        <BundlrContext.Provider value={{
          bundlrInstance,
          connect
        }}>
          <Component {...pageProps} />
        </BundlrContext.Provider>
      </div>
    </div>
  )
}

const container = css`
  padding: 20px 100px;
`

const navStyle = css`
  display: flex;
  padding: 20px 30px;
`

const linkStyle = css`
  margin-left: 30px;
`

export default MyApp
