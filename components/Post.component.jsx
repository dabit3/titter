import { getRandomEmoji } from '../utils'
import formatDistance from 'date-fns/formatDistance'
import { css } from '@emotion/css'
import ReactMarkdown from 'react-markdown'

import ProfileImage from './ProfileImage.component'

const Post = ({ post }) => {
    return (
        <div className={postWrapper} >
            {
                post.request.data.profileImage ? (
                    <ProfileImage
                        imgsrc={post.request.data.profileImage}
                    />
                ) : (
                    <p className={emojiStyle}>{post.request.data.emoji ? post.request.data.emoji : getRandomEmoji()}</p>
                )
            }
            <div className={postContainer}>
                <p>{post.request.data.username ? post.request.data.username : post.request.data.createdBy}</p>
                <ReactMarkdown>{post.request.data.post}</ReactMarkdown>
                <div className={timeAndTopicContainerStyle}>
                    <p>{formatDistance(new Date(), new Date(post.request.data.createdAt)) + ' ago'}</p>
                    {
                        post.request.data.topic && <p>{post.request.data.topic}</p>
                    }
                </div>
            </div>
        </div>

    )
}


const horizontalPaddingStyle = css`
  padding: 4px 30px;
`

const postWrapper = css`
  border-bottom: 1px solid rgba(0, 0, 0, .2);
  display: flex;
  align-items: flex-start;
  border-top: 1px solid rgba(255, 255, 255, .1);
  ${horizontalPaddingStyle},
  h1 {
    font-size: 40px;
    margin: 20px 30px 0px 0px;
  }
`

const postContainer = css`
  margin-bottom: 10px;
  p:first-child {
    color: #9e54b9;
    font-size: 22px;
    margin-bottom: 0px;
  }
  p:nth-child(2) {
    font-size: 29px;
    margin: 17px 0px;
    font-size: 28px;
  }
`

const timeAndTopicContainerStyle = css`
  display: flex;
  p:first-child {
    margin: 0;
  }
  p:nth-child(2) {
    margin: 0;
    margin-left: 10px;
    font-size: 22px;
    color: #ff5d9d;
  }
`
const emojiStyle = css`
  font-size: 40px;
  margin-right: 26px;
`

export default Post