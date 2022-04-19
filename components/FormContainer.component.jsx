import { css } from "@emotion/css"

const FormContainer = ({ children }) => {
    return (
        <div className={formStyle}>{children}</div>
    )
}

const formStyle = css`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  input {
    padding: 12px;
    border-radius: 7px;
    font-size: 22px;
    border-color: rgba(0, 0, 0, .05);
    margin-bottom: 5px;
    min-width: 400px;
    &:focus {
      border-color: rgba(0, 0, 0, .1);
      outline: none;
    }
  }
`

export default FormContainer