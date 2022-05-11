import { useContext, useState } from 'react'
import BigNumber from 'bignumber.js'
import { css } from '@emotion/css'
import { BundlrContext } from '../context'
import { create } from 'ipfs-http-client'

import Button from '../components/Button.component'
import Input from '../components/Input.component'
import ProfileImage from '../components/ProfileImage.component'
import FormContainer from '../components/FormContainer.component'
import AccountInfo from '../components/AccounrInfo.component'

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

  function parseInput(input) {
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
    const user = { ...profile }
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
          <Button
            handleClick={connectCeramic}
          >Authenticate to {!profileExists ? "read and update " : "update "}profile</Button>
        )
      }
      {
        ceramicLoaded && !viewForm && (
          <Button handleClick={() => setViewForm(true)}>Update Profile</Button>
        )
      }
      {
        ceramicLoaded && viewForm && (
          <FormContainer>
            <Input placeholder="Name" handleChange={e => setName(e.target.value)} />
            <Input placeholder="Bio" handleChange={e => setBio(e.target.value)} />
            <Input placeholder="Twitter username" handleChange={e => setTwitter(e.target.value)} />
            <div className={filePickerContainerStyle}>
              <label>Set profile image</label>
              <input
                type="file"
                onChange={setImage}
              />
            </div>
            {
              profileImage && (
                <ProfileImage imgsrc={profileImage} />
              )
            }
            <Button handleClick={updateProfile}>Update Profile</Button>
          </FormContainer>
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
                <img src={profile.profileImage} style={{ width: '200px' }} />
              )
            }
          </div>
        ) : null
      }
      <AccountInfo>
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
              <Input
                handleChange={e => setPrice(e.target.value)}
                placeholder="Fund 1111"
              />
              <br />
              <Button handleClick={fundWallet}>Transfer tokens</Button>
            </div>
          )
        }
      </AccountInfo>
    </div >
  )
}

const horizontalPaddingStyle = css`
  padding: 15px 40px;
`

const filePickerContainerStyle = css`
  margin-top: 10px;
`
