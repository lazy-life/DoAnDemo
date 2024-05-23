import { useState, useEffect, useRef } from "react"
import SelectDropdown from "../SelectDropdown"


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
const DeleteSessionConfirm = ({ getDataFromChild, messageDelete, className }) => {
    const loopAgain = [
        {
            id: 1,
            name: 'Chỉ tiết này'
        },
        {
            id: 2,
            name: 'Từ hiện tại về sau'
        }
    ]

    const message = messageDelete
    const closeRef = useRef(null)

    const [repeat, setRepeat] = useState(loopAgain[0])

    useEffect(() => {
        setRepeat(loopAgain[0])
    }, [])


    const sendDataAcceptToParent = () => {
        getDataFromChild("delete", message.objectDelete, (parseInt(Object.values(repeat)[0]) - 1))
    }
    const sendDataCancalToParent = () => {
        getDataFromChild("cancel", '', '')
    }

    
    const handelSelectLoop = (data) => {
        setRepeat(data)
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

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleDropdownClick);
    //     return () => {
    //         document.removeEventListener('mousedown', handleDropdownClick);
    //     };
    // }, []);

    return (
        <div id="deleteConfirm-wrapper" className={className}>
            <div ref={closeRef} className="popUp">
                <div className="topPopUp">
                    <p>{message.title}</p>
                </div>
                <div className="middlePopUp" style={{width: '100%'}}>
                    <div style={{width: '100%'}}>
                        <p>{message.content}</p>
                        <div className="repeatDelete" style={{display: 'flex', alignItems: 'center', width: '100%', marginTop: '1rem'}}>
                            <p style={{margin: '0', width: '50%'}}>Nếu đồng ý vui lòng chọn tần suất xoá: </p>
                            <div className="select" style={{border: '1px solid #FF4F00', borderRadius: '20px', width: '40%'}}>
                                <SelectDropdown color={'black'} label={'Chọn tần suất'}
                                    getDataFromChild={handelSelectLoop} optionList={loopAgain}
                                    dataUpdate={repeat} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottomPopUp">
                    <button className="cancel" onClick={sendDataCancalToParent}>Huỷ</button>
                    <button className="accept" onClick={sendDataAcceptToParent}>Xoá</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSessionConfirm