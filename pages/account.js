import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useContext, useState, useEffect } from 'react'
import { BundlrContext } from '../context'
import { utils } from 'ethers'

export default function Account() {
  const [balance, setBalance] = useState(null)
  const context = useContext(BundlrContext)
  const { connect, bundlrInstance } = context

  useEffect(() => {
    if (bundlrInstance) {
      fetchBalance()
    }
  }, [])

  async function fetchBalance() {
    const data = await bundlrInstance.getLoadedBalance() // 109864 
    console.log('data: ', utils.formatEther(data.toString()))

  }

  return (
    <div className={styles.container}>
      <h2>Account Information</h2>
    </div>
  )
}
