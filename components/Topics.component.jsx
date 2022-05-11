import { useState, useRef } from 'react'

import { css } from '@emotion/css'


const topics = {
  gm: 'gm',
  degen: 'degen',
  nfts: 'nfts',
  defi: 'defi',
  daos: 'daos',
  web3: 'web3',
  solidity: 'solidity',
  events: 'events'
}

const Topics = ({ getPostInfo }) => {
  const [topicToSave, setTopicToSave] = useState('')
  const [topicToFilter, setTopicToFilter] = useState('')
  const topicFilterRef = useRef(null)
  topicFilterRef.current = topicToFilter

  function setFilter(topic) {
    if (topicToFilter === topic) {
      setTopicToFilter('')
      getPostInfo()
    } else {
      setTopicToFilter(topic)
      getPostInfo(topic)
    }
  }

  function setTopic(topic) {
    if (topicToSave === topic) {
      setTopicToSave('')
    } else {
      setTopicToSave(topic)
    }
  }

  function checkTopicStyle(topic) {
    if (topic === topicToSave) {
      return css`
            background-color: #b84cff !important;
          `
    }
  }

  function checkTopicFilterStyle(topic) {
    if (topic === topicToFilter) {
      return css`
            background-color: #ff5d9d !important;
          `
    }
  }
  return (
    <div className={filtersContainerStyle}>
      <div className={filterheaderStyle}>
        <h3>Filter by topic</h3>
        <img onClick={() => getPostInfo()} className={refreshImageStyle} src="/refresh.svg" />
      </div>
      <div className={filtersListStyle}>
        {
          Object.keys(topics).map((topic, i) => (
            <div key={i}>
              <p className={checkTopicFilterStyle(topic)} onClick={() => setFilter(topic)}>{topic}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}


const horizontalPaddingStyle = css`
  padding: 4px 30px;
`

const filtersContainerStyle = css`
  ${horizontalPaddingStyle},
  margin-top: 50px;
  h3 {
    margin-bottom: 5px;
  }
  `

const filterheaderStyle = css`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
  h3 {
    margin: 0px;
  }
  img {
    margin-left: 15px;
    cursor: pointer;
  }
`

const refreshImageStyle = css`
  width: 30px;
`

const filtersListStyle = css`
  display: flex;
  p {
    background-color: #1d1a27;
    border: 1px solid #302c3f;
    color: white;
    margin-right: 6px;
    padding: 8px 24px;
    border-radius: 27px;
    cursor: pointer;
    font-weight: bold;
  }
`

export default Topics