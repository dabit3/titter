import { buildQuery, arweave, createPostInfo, getRandomEmoji } from '../utils'
import { useState, useEffect, useContext } from 'react'
import { css } from '@emotion/css'
import formatDistance from 'date-fns/formatDistance'
import { BundlrContext } from '../context'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

const topics = {
  nfts: 'nfts',
  defi: 'defi',
  engineering: 'engineering',
  daos: 'daos',
  web3: 'web3',
  infrastructure: 'infrastructure',
}

function App() {
  const [postInfos, setPostInfos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [postInput, setPostInput] = useState('')
  const [topicToSave, setTopicToSave] = useState('')
  const [topicToFilter, setTopicToFilter] = useState('')
  const context = useContext(BundlrContext)
  const { balance, connectCeramic, bundlrInstance, profile } = context

  useEffect(() => {
    getPostInfo()
    setIsLoading(true)
  }, [])

  async function createPost() {
    console.log({ profile })

    if (!postInput) return
    const tags = [
      { name: "App-Name", value: "Web3ChatterTest1" },
      { name: "Content-Type", value: "text/plain" },
    ]

    if (topicToSave) {
      tags.push({
        name: "Topic",
        value: topicToSave
      })
    }

    console.log('tags: ', tags)

    const post = {
      post: postInput,
      createdAt: new Date(),
      createdBy: bundlrInstance.address,
      username: profile && profile.name ? profile.name : null,
      profileImage: profile && profile.profileImage ? profile.profileImage : null
    }
  
    let tx = await bundlrInstance.createTransaction(JSON.stringify(post), { tags })

    try {
      await tx.sign();
      const data = await tx.upload();

      if (
        (topicToFilter && topicToSave == topicToFilter) ||
        !topicToFilter
      ) {
        const posts = [{
          emoji: getRandomEmoji(),
          request: {
            data: {
              post: postInput,
              createdAt: post.createdAt,
              createdBy: bundlrInstance.address,
              username: profile && profile.name ? profile.name : null,
              profileImage: profile && profile.profileImage ? profile.profileImage : null
            }
          }
        }, ...postInfos]
        setPostInfos(posts)
      }
      setPostInput('')
      console.log('data: ', data)
    } catch (err) {
      console.error(err);
    }
  }

  async function getPostInfo(topicFilter = null) {
    const query = buildQuery(topicFilter);
    const results = await arweave.api.post('/graphql', query)
      .catch(err => {
        console.error('GraphQL query failed');
         throw new Error(err);
      });
    const edges = results.data.data.transactions.edges;
    console.log("edges: ", edges);
    const posts = await Promise.all(
      edges.map(async edge => await createPostInfo(edge.node))
    )
    const sorted = posts.sort((a, b) => new Date(b.request.data.createdAt) - new Date(a.request.data.createdAt))
    setIsLoading(false)
    setPostInfos(sorted)
    console.log('posts: ', sorted)
  }

  function onChange(e) {
    setPostInput(e.target.value)
  }

  function checkTopicFilterStyle(topic) {
    if (topic === topicToFilter) {
      return css`
        background-color: rgba(0, 0, 0, .1) !important;
        color: #666  !important;
      `
    }
  }

  function setFilter(topic) {
    if (topicToFilter === topic) {
      setTopicToFilter('')
      getPostInfo()
    } else {
      setTopicToFilter(topic)
      getPostInfo(topic)
    }
  }

  function checkTopicStyle(topic) {
    if (topic === topicToSave) {
      return css`
        background-color: rgba(0, 0, 0, .1) !important;
        color: #666  !important;
      `
    }
  }

  function setTopic(topic) {
    if (topicToSave === topic) {
      setTopicToSave('')
    } else {
      setTopicToSave(topic)
    }
  }

  const balanceZero = balance === "0.0"
  
  return (
    <div className="App">
      {
        !bundlrInstance ? (
          <div>
             <button className={button} onClick={connectCeramic}>Connect wallet to start chatting!</button>
          </div>
        ) : balanceZero ? (
          <div>
            <h4>
              Balance empty. Please fund wallet
              <Link href="/account">
                <a> here.</a>
              </Link>
            </h4>
          </div>
        ) : (
          <div className={postInputContainerStyle}>
            <input
              onChange={onChange}
              placeholder="New post"
              value={postInput}
              className={postInputStyle}
            />
            <div className={filtersListStyle}>
            {
              Object.keys(topics).map((topic, i) => (
                <div key={i} onClick={() => setTopic(topic)}>
                  <p className={checkTopicStyle(topic)}>{topic}</p>
                </div>
              ))
            }
            </div>
            <button className={button} onClick={createPost}>Send</button>
          </div>
        )
      }
      {
        isLoading && <h1>Loading chat...</h1>
      }
      {
        !isLoading && (
          <>
            <div className={filtersContainerStyle}>
              <h3>Filter by topic</h3>
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
            <div className={postListContainer}>
            {
              postInfos.map((post, i) => (
                post.request.data.post && (
                  <div className={postWrapper} key={i} >
                    <img
                      src={post.request.data.profileImage}
                      className={profileImageStyle}
                    />
                    <div className={postContainer}>
                      <ReactMarkdown>{post.request.data.post}</ReactMarkdown>
                      <p>{post.request.data.username ? post.request.data.username : post.request.data.createdBy}</p>
                      <p>{formatDistance(new Date(), new Date(post.request.data.createdAt)) + ' ago'}</p>
                    </div>
                  </div>
                )
              ))
            }
            </div>
          </>
          )
        }
    </div>
  );
}

const postWrapper = css`
  border-bottom: 1px solid rgba(0, 0, 0, .2);
  display: flex;
  align-items: flex-start;
  h1 {
    font-size: 40px;
    margin: 20px 30px 0px 0px;
  }
`

const postContainer = css`
  p:first-child {
    font-size: 20px;
    margin-bottom: 0px;
  }
  p:nth-child(2) {
    color: rgba(0, 0, 0, .5);
    font-size: 14px;
  }
`

const postInputContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 300px;
`

const postInputStyle = css`
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
  &:hover {
    background-color: rgba(0, 118, 255, 0.9);
    box-shadow: 0 6px 20px rgb(0 118 255 / 23%);
  }
`

const postListContainer = css`
  margin-top: 10px;
  border-top: 1px solid black;
`

const filtersContainerStyle = css`
  margin-top: 50px;
  h3 {
    margin-bottom: 5px;
  }
`

const profileImageStyle = css`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 28px;
  margin-top: 26px;
  margin-right: 12px;
`

const filtersListStyle = css`
  display: flex;
  p {
    background-color: black;
    color: white;
    margin-right: 6px;
    padding: 8px 24px;
    border-radius: 20px;
    cursor: pointer;
  }
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