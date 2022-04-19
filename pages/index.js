import { buildQuery, arweave, createPostInfo, getRandomEmoji } from '../utils'
import { useState, useEffect, useContext, useRef } from 'react'
import { css } from '@emotion/css'
import { BundlrContext } from '../context'
import Link from 'next/link'

import Topics from '../components/Topics.component'
import Button from '../components/Button.component'
import PostListContainer from '../components/PostListContainer.component'
import PostInputComponent from '../components/PostInput.component'

function App() {
  const [postInfos, setPostInfos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [postInput, setPostInput] = useState('')
  const [topicToSave, setTopicToSave] = useState('')
  const [topicToFilter, setTopicToFilter] = useState('')
  const topicFilterRef = useRef(null)
  const context = useContext(BundlrContext)
  const { balance, connectCeramic, bundlrInstance, profile } = context
  topicFilterRef.current = topicToFilter

  useEffect(() => {
    getPostInfo()
    setIsLoading(true)
    poll()
  }, [])

  async function poll() {
    setInterval(() => {
      getPostInfo(topicFilterRef.current)
    }, 15000)
  }

  async function createPost() {
    if (!postInput) return
    const tags = [
      { name: "App-Name", value: "Titter" },
      { name: "Content-Type", value: "text/plain" },
    ]

    if (topicToSave) {
      tags.push({
        name: "Topic",
        value: topicToSave
      })
    }

    const post = {
      post: postInput,
      createdAt: new Date(),
      createdBy: bundlrInstance.address,
      username: profile && profile.name ? profile.name : null,
      profileImage: profile && profile.profileImage ? profile.profileImage : null,
      topic: topicToSave ? topicToSave : null,
      emoji: getRandomEmoji()
    }

    let tx = await bundlrInstance.createTransaction(JSON.stringify(post), { tags })

    try {
      await tx.sign()
      await tx.upload()

      if (
        (topicToFilter && topicToSave == topicToFilter) ||
        !topicToFilter
      ) {
        const posts = [{
          request: {
            data: {
              post: postInput,
              createdAt: post.createdAt,
              createdBy: bundlrInstance.address,
              username: profile && profile.name ? profile.name : null,
              profileImage: profile && profile.profileImage ? profile.profileImage : null,
              topic: topicToSave ? topicToSave : null,
              emoji: post.emoji
            }
          }
        }, ...postInfos]
        setPostInfos(posts)
      }
      setPostInput('')
    } catch (err) {
      console.error(err)
    }
  }

  async function getPostInfo(topicFilter = null) {
    const query = buildQuery(topicFilter)
    const results = await arweave.api.post('/graphql', query)
      .catch(err => {
        console.error('GraphQL query failed')
        throw new Error(err);
      });
    const edges = results.data.data.transactions.edges
    const posts = await Promise.all(
      edges.map(async edge => await createPostInfo(edge.node))
    )
    const sorted = posts.sort((a, b) => new Date(b.request.data.createdAt) - new Date(a.request.data.createdAt))
    setIsLoading(false)
    setPostInfos(sorted)
    console.log('posts: ', sorted)
  }

  const balanceZero = balance === "0.0"

  return (
    <div>
      {
        !bundlrInstance ? (
          <div className={horizontalPaddingStyle}>
            <Button handleClick={connectCeramic}>Connect wallet to start chating!</Button>
          </div>
        ) : balanceZero ? (
          <div className={horizontalPaddingStyle}>
            <h4>
              Balance empty. Please fund wallet
              <Link href="/account">
                <a className={fundWalletLinkStyle}> here.</a>
              </Link>
            </h4>
          </div>
        ) : <PostInputComponent handleClick={createPost} />
      }
      {
        isLoading && <h1 className={filtersContainerStyle}>Loading chat...</h1>
      }
      {
        !isLoading && (
          <>
            <Topics getPostInfo={getPostInfo} />
            <PostListContainer postInfos={postInfos} />
          </>
        )
      }
    </div>
  );
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

const fundWalletLinkStyle = css`
color: #b84cff;
`

const refreshImageStyle = css`
width: 30px;
`

export default App;


  // async function createPost() {
  //   const data = "hello world"

  //   const tags = [{name: "Content-Type", value: "text/plain"}];

  //   const transaction = bundlrInstance.createTransaction(data, { tags });
  //   console.log('transaction: ', transaction)

  //   await transaction.sign();
  //   const d = await transaction.upload();

  //   console.log('d:::', d)
  //   console.log('transaction id: ', transaction.id)
  // }
