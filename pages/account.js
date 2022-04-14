import styles from '../styles/Home.module.css'
import { useContext, useState, useEffect, useRef } from 'react'
import { utils } from 'ethers'
import BigNumber from "bignumber.js"
import { css } from '@emotion/css'
import { BundlrContext } from '../context'
import { getRecord, webClient } from '../utils'

export default function Account() {
  const [balance, setBalance] = useState(null)
  const [price, setPrice] = useState(null)
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState({})
  const [localDid, setDid] = useState(null)
  const [selfId, setSelfId] = useState(null)
  const [ceramicLoaded, setCeramicLoaded] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const selfIdRef = useRef(null)
  const didRef = useRef(null)
  selfIdRef.current = selfId
  didRef.current = localDid

  const context = useContext(BundlrContext)
  const { connect, bundlrInstance } = context

  useEffect(() => {
    if (bundlrInstance) {
      fetchBalance()
    }
  }, [bundlrInstance])

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

  async function updateProfile() {
    if (!twitter && !bio && !name) {
      console.log('error... no profile information submitted')
      return
    }
    if (!selfId) {
      await connect()
    }
    const user = {...profile}
    if (twitter) user.twitter = twitter
    if (bio) user.bio = bio
    if (name) user.name = name
    await selfIdRef.current.set('basicProfile', user)
    setLocalProfileData()
    console.log('profile updated...')
  }

  async function readProfile() {
    try {
      const { record } = await getRecord()
      console.log('record: ', record)
      if (record) {
        setProfile(record)
      } else {
        setShowGreeting(true)
      }
    } catch (error) {
      setShowGreeting(true)
    }
    setCeramicLoaded(true)
  }

  async function setLocalProfileData() {
    try {
      const data = await selfIdRef.current.get('basicProfile', didRef.current.id)
      if (!data) return
      setProfile(data)
      setShowGreeting(false)
    } catch (error) {
      console.log('error', error)
    }
  }

  async function fetchBalance() {
    const data = await bundlrInstance.getLoadedBalance() // 109864 
    console.log('data: ', utils.formatEther(data.toString()))
    setBalance(utils.formatEther(data.toString()))
  }

  async function connectWallet() {
    await connect()
  }

  async function fundWallet() {
    const priceParced = parseInput(price)
    let response = await bundlrInstance.fund(priceParced);
    console.log('response: ', response)
  }

  function parseInput (input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1]);
    if (conv.isLessThan(1)) {
      console.log('error: value too small')
      return
    } else {
      return conv
    }
  }

  return (
    <div className={styles.container}>
      <h2>Account Information</h2>
      {
        !bundlrInstance && <button className={button} onClick={connectWallet}>Connect wallet to view balance.</button>
      }
      {
        !ceramicLoaded && (
          <>
          <button
            onClick={connectCeramic}
            className={button}
        >Authenticate</button>
        
        <button className={button} onClick={readProfile}>Read Profile</button>
        </>
        )
      }
      {
        bundlrInstance && (
          <div>
            <h3>Balance: {balance && Math.round(balance * 100000) / 100000}</h3>
            <p>Fund wallet:</p>
            <input
              onChange={e => setPrice(e.target.value)}
              placeholder="amount"
              className={inputStyle}
            />
            <br />
            <button className={button} onClick={fundWallet}>Send transaction</button>
          </div>
        )
      }
    </div>
  )
}

const inputStyle = css`
  padding: 12px;
  font-size: 16px;
  border-radius: 7px;
  border-color: rgba(0, 0, 0, .05);
  &:focus {
    border-color: rgba(0, 0, 0, .1);
    outline: none;
  }
`

const button = css`
  color: white;
  background-color: #0070f3;
  padding: 13px 35px;
  border-radius: 7px;
  border: none;
  font-size: 16px;
  outline: none;
  box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%);
  cursor: pointer;
  transition: all .3s;
  margin-top: 10px;
  &:hover {
    background-color: rgba(0, 118, 255, 0.9);
    box-shadow: 0 6px 20px rgb(0 118 255 / 23%);
  }
`