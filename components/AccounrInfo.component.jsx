import { css } from "@emotion/css"

const AccounrInfo = ({ children }) => {
    return (
        <div className={accountInfoStyle}>
            <h2>Account Information</h2>
            {children}
        </div>
    )
}

const accountInfoStyle = css`
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, .1);
`

export default AccounrInfo