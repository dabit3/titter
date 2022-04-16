import styles from '../styles/Home.module.css'
import { useContext, useState, useEffect, useRef } from 'react'
import { utils, providers } from 'ethers'
import BigNumber from "bignumber.js"
import { css } from '@emotion/css'
import { BundlrContext } from '../context'
import { getRecord, webClient } from '../utils'
import { create } from 'ipfs-http-client';

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function Account() {
  const [price, setPrice] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [name, setName] = useState('')

  const context = useContext(BundlrContext)
  const { connect, fetchBalance, bundlrInstance, balance, profile, setProfile, ceramicLoaded, connectCeramic, selfId } = context

  async function connectWallet() {
    await connect()
  }

  async function fundWallet() {
    if (!price) return
    const priceParced = parseInput(price)
    let response = await bundlrInstance.fund(priceParced);
    console.log('Wallet funded: ', response)
    fetchBalance()
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

  async function updateProfile() {
    if (!twitter && !bio && !name && !profileImage) {
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
    if (profileImage) user.profileImage = profileImage
    await selfId.set('basicProfile', user)
    setProfile(user)
    console.log('profile updated...')
  }

  async function setImage(e) {
    const added = await client.add(e.target.files[0])
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    setProfileImage(url)
  }
  
  console.log('profile : ', profile)

  const profileExists = Object.keys(profile).length

  return (
    <div className={styles.container}>
      <h2>Profile Information</h2>
      {
        !ceramicLoaded && (
          <button
            onClick={connectCeramic}
            className={button}
          >Authenticate to { !profileExists ? "read and update " : "update "}profile</button>
        )
      }
      {
        ceramicLoaded && (
          <div className={formStyle}>
            <input className="pt-4 rounded bg-gray-100 px-3 py-2" placeholder="Name" onChange={e => setName(e.target.value)} />
            <input className="pt-4 rounded bg-gray-100 px-3 py-2 my-2" placeholder="Bio" onChange={e => setBio(e.target.value)} />
            <input className="pt-4 rounded bg-gray-100 px-3 py-2" placeholder="Twitter username" onChange={e => setTwitter(e.target.value)} />
            <div className={filePickerContainerStyle}>
              <label>Set profile image</label>
              <input
                type="file"
                onChange={setImage}
              />
            </div>
            {
              profileImage && (
                <img className={profileImageStyle} src={profileImage} />
              )
            }
            <button className={button} onClick={updateProfile}>Update Profile</button>
          </div>
        )
      }
      {
        profileExists ? (
          <div>
            <h2 >{profile.name}</h2>
            <p >{profile.bio}</p>
            {
              profile.twitter && (
                <p >Follow me on Twitter - @{profile.twitter}</p>
              )
            }
            {
              profile.profileImage && (
                <img src={profile.profileImage} style={{width: '200px'}} />
              )
            }
          </div>
        ) : null
      }
      <div className={accountInfoStyle}>
      <h2>Account Information</h2>
      {
        !bundlrInstance && (
          <>
            <h3>Wallet not yet connected...</h3>
            {/* <button className={button} onClick={connectWallet}>Connect wallet to view balance.</button> */}
          </>
        )
      }
      {
        bundlrInstance && (
          <div>
            <h3>Balance: {balance && Math.round(balance * 100000) / 100000}</h3>
            <input
              onChange={e => setPrice(e.target.value)}
              placeholder="Fund wallet"
              className={inputStyle}
            />
            <br />
            <button className={button} onClick={fundWallet}>Transfer tokens</button>
          </div>
        )
      }
      </div>
    </div>
  )
}

const formStyle = css`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  input {
    padding: 12px;
    font-size: 16px;
    border-radius: 7px;
    border-color: rgba(0, 0, 0, .05);
    margin-bottom: 5px;
    &:focus {
      border-color: rgba(0, 0, 0, .1);
      outline: none;
    }
  }
`

const filePickerContainerStyle = css`
  margin-top: 10px;
`

const profileImageStyle = css`
  width: 140px;
  margin-top: 10px;
`

const accountInfoStyle = css`
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, .1);
`

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