import '../styles/globals.css'
import { css } from '@emotion/css'
import Link from 'next/link'
import { WebBundlr } from "@bundlr-network/client"
import { providers, utils } from "ethers"
import { useState, useEffect } from 'react'
import { BundlrContext } from '../context'
import { getRecord, webClient } from '../utils'

function MyApp({ Component, pageProps }) {
  const [bundlrInstance, setBundlrInstance] = useState(null)
  const [profile, setProfile] = useState({})
  const [balance, setBalance] = useState(null)
  const [ceramicLoaded, setCeramicLoaded] = useState(false)
  const [did, setDid] = useState(null)
  const [selfId, setSelfId] = useState(null)

  useEffect(() => {
    if (bundlrInstance) {
      fetchBalance()
    }
    readProfile()
  }, [bundlrInstance])

  async function fetchBalance() {
    const data = await bundlrInstance.getLoadedBalance() // 109864 
    console.log('data: ', utils.formatEther(data.toString()))
    setBalance(utils.formatEther(data.toString()))
  }

  async function readProfile() {
    if (!window.ethereum) return
    const provider = new providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    if (!accounts.length) return
    try {
      const { record } = await getRecord()
      console.log('record: ', record)
      if (record) {
        setProfile(record)
      } else {
        // setShowGreeting(true)
      }
    } catch (error) {
      console.log('error: ', error)
      // setShowGreeting(true)
    }
    // setCeramicLoaded(true)
  }

  async function connectCeramic() {
    const cdata = await webClient()
    const { id, selfId, error } = cdata
    if (error) {
      console.log('error: ', error)
      return
    }
    setDid(id)
    setSelfId(selfId)
    const data = await selfId.get('basicProfile', id)
    if (data) {
      setProfile(data)
    } else {
      setShowGreeting(true)
    }
    setCeramicLoaded(true)
  }

  async function connect() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  
    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready()
  
    const bundlr = new WebBundlr("https://node1.bundlr.network", "matic", provider)
    await bundlr.ready()  
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
            <p>Profile & Account</p>
          </a>
        </Link>
      </nav>
      <div className={container}>
        <BundlrContext.Provider value={{
          bundlrInstance,
          connect,
          profile,
          balance,
          setProfile,
          connectCeramic,
          ceramicLoaded,
          selfId
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
