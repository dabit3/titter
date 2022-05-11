import { useState } from "react"
import { css } from "@emotion/css"

import Button from "./Button.component"

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

const PostInputComponent = ({ handleClick }) => {
    const [postInput, setPostInput] = useState('')
    const [topicToSave, setTopicToSave] = useState('')

    function onChange(e) {
        setPostInput(e.target.value)
    }

    function checkTopicStyle(topic) {
        if (topic === topicToSave) {
            return css`
            background-color: #b84cff !important;
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

    return (

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
            <Button onClick={handleClick}>Send</Button>
        </div>
    )
}
const horizontalPaddingStyle = css`
  padding: 4px 30px;
`

const postInputContainerStyle = css`
  ${horizontalPaddingStyle},
  display: flex;
  flex-direction: column;
  width: 300px;
`

const postInputStyle = css`
  padding: 12px;
  font-size: 22px;
  min-width: 250px;
  border-radius: 7px;
  border-color: rgba(0, 0, 0, .05);
  &:focus {
    border-color: rgba(0, 0, 0, .1);
    outline: none;
  }
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

export default PostInputComponent