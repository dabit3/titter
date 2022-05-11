import { useState } from "react"

import { css } from "@emotion/css"
import Post from "./Post.component"

const PostListContainer = ({ postInfos }) => {
    return (
        <div className={postListContainer}>
            {
                postInfos.map((post, i) => (
                    post.request.data.post && (
                        <Post post={post} key={i} />
                    )
                ))
            }
        </div>
    )
}

const postListContainer = css`
  margin-top: 10px;
  border-top: 1px solid black;
`

export default PostListContainer