import { css } from "@emotion/css"

const Button = ({ handleClick, children }) => {
  return (
    <button onClick={handleClick} className={button}>{children}</button>
  )
}


const button = css`
  color: white;
  background-image: linear-gradient(120deg, #ff266a 0%, #c926ff 50%, #3d04cd 100%);
  padding: 13px 35px;
  border-radius: 7px;
  border: none;
  outline: none;
  box-shadow: 0 6px 20px rgba(255, 38, 106, .15);
  cursor: pointer;
  transition: all .3s;
  &:hover {
    box-shadow: 0 6px 20px rgba(255, 38, 106, .3);
  }
`

export default Button