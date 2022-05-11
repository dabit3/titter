import { css } from "@emotion/css"

const ProfileImage = ({ imgsrc }) => {
    return (
        <img src={imgsrc} className={profileImageStyle} />
    )
}

const profileImageStyle = css`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 28px;
  margin-top: 26px;
  margin-right: 12px;
`


export default ProfileImage