import { useState, useEffect, useRef } from "react"


/* 
getDataFromChild(data): a function to get data from this component
                        data is String

messageDelete: {
    idObject: 1,
    title: 'xoa truong',
    content: 'ban co muon ... thpt pha lai',
    path: 'api/department/delete/'
}

className: className
*/
const DeleteConfirm = ({ getDataFromChild, messageDelete, className }) => {
    const message = messageDelete
    const closeRef = useRef(null)

    const sendDataAcceptToParent = () => {
        getDataFromChild("delete")
    }
    const sendDataCancalToParent = () => {
        getDataFromChild("cancel")
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                getDataFromChild("cancel")
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleDropdownClick = (e) => {
        if (closeRef.current && !closeRef.current.contains(e.target)) {
            getDataFromChild("cancel")
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClick);
        };
    }, []);

    return (
        <div id="deleteConfirm-wrapper" className={className}>
            <div ref={closeRef} className="popUp">
                <div className="topPopUp">
                    <p>{message.title}</p>
                </div>
                <div className="middlePopUp">
                    <p>{message.content}</p>
                </div>
                <div className="bottomPopUp">
                    <button className="cancel" onClick={sendDataCancalToParent}>Huỷ</button>
                    <button className="accept" onClick={sendDataAcceptToParent}>Xoá</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteConfirm