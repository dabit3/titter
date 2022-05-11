import { css } from "@emotion/css"
const Input = ({ handleChange, placeholder, type }) => {

    return (
        <input type={type} onChange={handleChange} placeholder={placeholder} className={inputStyle
        } />
    )
}

const inputStyle = css`
  padding: 12px;
  font-size: 22px;
  border-radius: 7px;
  border-color: rgba(0, 0, 0, .05);
  &:focus {
    border-color: rgba(0, 0, 0, .1);
    outline: none;
  }
`

export default Input