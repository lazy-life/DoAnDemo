import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import ErrorPopup from "./ErrorPopUp"

const CommentReject = ({ getDataFromChild, commentContent }) => {
    const [commentValue, setCommentValue] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [showErrorPopup, setShowErrorPopup] = useState(false)

    useEffect(() => {
        if (commentContent) {
            setCommentValue(commentContent)
        } else {
            setCommentValue(null)
        }
    }, [commentContent])

    const handleClose = () => {
        getDataFromChild('0', null)
    }
    const handleSendData = () => {
        if (commentValue) {
            getDataFromChild('1', commentValue)
        } else {
            setErrorMsg('Vui lòng nhập lý do từ chối!')
            setShowErrorPopup(true)
        }
    }

    const handleCloseErr = (data) => {
        if (data === 'cancel') {
            setShowErrorPopup(false)
        }
    }

    return (
        <>
            <div id="comment-react-wrapper">
                <div className="popUpComment">
                    <div className="topPopup">
                        <p>Lý do từ chối</p>
                        <div onClick={() => handleClose()}>
                            <Icon icon="flowbite:close-solid" />
                        </div>
                    </div>
                    <div className="contentPopup">
                        <textarea value={commentValue} onChange={(e) => {
                            const value = e.target.value;
                            setCommentValue(value);
                        }} placeholder="Nhập lý do ở đây..." required />
                    </div>
                    <div className="bottomPopup">
                        <div className="botBtn">
                            <button onClick={() => handleClose()} className="cancel">Huỷ</button>
                            <button onClick={() => handleSendData()} className="accept">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            {showErrorPopup && <ErrorPopup handleClose={handleCloseErr} errorMsg={errorMsg} />}
        </>
    )
}


export default CommentReject