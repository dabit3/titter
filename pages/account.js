import { useContext, useState } from 'react'
import BigNumber from 'bignumber.js'
import { css } from '@emotion/css'
import { BundlrContext } from '../context'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function Account() {
  const [price, setPrice] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [name, setName] = useState('')
  const [viewForm, setViewForm] = useState(false)

  const context = useContext(BundlrContext)
  const { connect, fetchBalance, bundlrInstance, balance, profile, setProfile, ceramicLoaded, connectCeramic, selfId } = context

  async function fundWallet() {
    if (!price) return
    const priceParced = parseInput(price)
    let response = await bundlrInstance.fund(priceParced)
    console.log('Wallet funded: ', response)
    fetchBalance()
  }

  function parseInput (input) {
    const conv = new BigNumber(input).multipliedBy(bundlrInstance.currencyConfig.base[1])
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
    setViewForm(false)
  }

  async function setImage(e) {
    const added = await client.add(e.target.files[0])
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    setProfileImage(url)
  }
  
  console.log('profile : ', profile)

  const profileExists = Object.keys(profile).length

  return (
    <div className={horizontalPaddingStyle}>
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
        ceramicLoaded && !viewForm && (
          <button className={button} onClick={() => setViewForm(true)}>Update Profile</button>
        )
      }
      {
        ceramicLoaded && viewForm && (
          <div className={formStyle}>
            <input placeholder="Name" onChange={e => setName(e.target.value)} />
            <input placeholder="Bio" onChange={e => setBio(e.target.value)} />
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
            <h2 >{profile.name} - {profile.bio}</h2>
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
          </>
        )
      }
      {
        bundlrInstance && (
          <div>
            <h3>Balance: {balance && Math.round(balance * 100000) / 100000}</h3>
            <p>Transfer tokens from Matic to Bundlr:</p>
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

const horizontalPaddingStyle = css`
  padding: 15px 40px;
`

const formStyle = css`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  input {
    padding: 12px;
    border-radius: 7px;
    font-size: 22px;
    border-color: rgba(0, 0, 0, .05);
    margin-bottom: 5px;
    min-width: 400px;
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
  font-size: 22px;
  border-radius: 7px;
  border-color: rgba(0, 0, 0, .05);
  &:focus {
    border-color: rgba(0, 0, 0, .1);
    outline: none;
  }
`

const button = css`
  color: white;
  background-image: linear-gradient(120deg, #ff266a 0%, #c926ff 50%, #3d04cd 100%);
  padding: 13px 35px;
  min-width: 230px;
  border-radius: 7px;
  border: none;
  outline: none;
  box-shadow: 0 6px 20px rgba(255, 38, 106, .15);
  cursor: pointer;
  transition: all .3s;
  margin-top: 10px;
  &:hover {
    box-shadow: 0 6px 20px rgba(255, 38, 106, .3);
  }
`