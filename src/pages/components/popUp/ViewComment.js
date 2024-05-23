import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

const ViewComment = ({ getDataFromChild, commentContent }) => {
    const [commentValue, setCommentValue] = useState(null)

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


    return (
        <>
            <div id="comment-react-wrapper">
                <div className="popUpComment">
                    <div className="topPopup">
                        <p>Lý do từ chối</p>
                        {/* <div onClick={() => handleClose()}>
                            <Icon icon="flowbite:close-solid" />
                        </div> */}
                    </div>
                    <div className="contentPopup">
                        <textarea value={commentValue} readOnly />
                    </div>
                    <div className="bottomPopup">
                        <div className="botBtn">
                            <button onClick={() => handleClose()} className="accept">Xong</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ViewComment