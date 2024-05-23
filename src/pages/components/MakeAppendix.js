import { useEffect, createContext, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import AppendixPattern from "./AppendixPattern"
import ScormPlayer from "./ScormPlayer"
import ViewDocument from "./popUp/ViewDocument"
import ViewAppendix1 from "./ViewAppendix1";
import ViewAppendix2 from "./ViewAppendix2";

export const indexAppendix = createContext()
const MakeAppendix = ({ userLoginData }) => {
    const [selectTitle, setSelectTitle] = useState(4)
    const [showPopUp, setShowPopUp] = useState(false)
    const [showPopUpScorm, setShowPopUpScorm] = useState(false)
    const [isUpload, setIsUpload] = useState('')
    const hidePopUp = useRef('')
    const hidePopUpScorm = useRef('')
    const [userLoginvalue, setUserLoginValue] = useState(null)

    const handleSelectedTitle = (index) => {
        setSelectTitle(index)
    }

    const handleView = (id, data) => {
        setShowPopUp(data)
        setIsUpload(id)
    }
    const handleViewAppendix2 = (id, data) => {
        setShowPopUp(data)
        setIsUpload(id)
    }
    const handleViewScorm = (id, data) => {
        if (id === 'close') {
            setShowPopUp(data)
        } else {
            setShowPopUpScorm(data)
            setShowPopUp(!data)
        }
    }
    const handlePlayScorm = (id, data) => {
        if (id === 'close') {
            setShowPopUpScorm(data)
            setShowPopUp(!data)
        }
    }

    const handlePopupShow = (e) => {
        if (hidePopUp.current && !hidePopUp.current.contains(e.target)) {
            setShowPopUp(false)
        }
    };
    const handlePopupScormShow = (e) => {
        if (hidePopUpScorm.current && !hidePopUpScorm.current.contains(e.target)) {
            setShowPopUpScorm(false)
            setShowPopUp(true)
        }
    };

    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
        }
    }, [userLoginData])

    useEffect(() => {
        document.addEventListener('mousedown', handlePopupShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupShow);
        }
    }, [])
    useEffect(() => {
        document.addEventListener('mousedown', handlePopupScormShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupScormShow);
        }
    }, [])
    const titleAppendix4 = ['Tên tổ', 'Tên tài liệu', 'Ngày nộp', '']
    const titleAppendix3 = ['Tên môn học', 'Tên khối', 'Tên tài liệu', 'Ngày nộp', '']

    const urlWeb = 'https://storage.googleapis.com/scormstaticsite/Quiz/res/index.html?'
    return (
        <div>
            <div id="reviewAppendix-wrapper">
                <div id="appendixBorder">
                    <div className="titleAppendix">
                        <div className="leftTitleAppendix">
                            <div className={selectTitle === 4 ? "selectTitle" : "titleName"}
                                onClick={() => handleSelectedTitle(4)}>
                                <Icon icon="heroicons-outline:document-text" width={'22px'} height={'22px'} />
                                <p>Kế hoạch tổ chức hoạt động giáo dục</p>
                            </div>
                            <div className={selectTitle === 3 ? "selectTitle" : "titleName"}
                                onClick={() => handleSelectedTitle(3)}>
                                <Icon icon="heroicons-outline:document-text" width={'22px'} height={'22px'} />
                                <p>Kế hoạch dạy học môn học</p>
                            </div>
                            <div className={selectTitle === 1 ? "selectTitle" : "titleName"}
                                onClick={() => handleSelectedTitle(1)}>
                                <Icon icon="bi:eye" width={'22px'} height={'22px'} />
                                <p>Tài liệu mẫu</p>
                            </div>
                        </div>
                    </div>

                    <indexAppendix.Provider value={selectTitle}>
                        <div className="appendix-4">
                            {selectTitle === 4 && <ViewAppendix2 title={titleAppendix4} getDataFromChild={handleViewAppendix2} userLoginData={userLoginData} />}
                            {selectTitle === 3 && <ViewAppendix1 title={titleAppendix3} getDataFromChild={handleView} userLoginData={userLoginData}/>}
                            {selectTitle === 1 && <AppendixPattern userLoginData={userLoginData}/>}
                        </div>
                    </indexAppendix.Provider>
                </div>
            </div>

            {showPopUp &&
                <div style={{ position: 'fixed', zIndex: 12, margin: 0, left: 0 }}>
                    <ViewDocument isUpload={isUpload} getDataFromChild={handleViewScorm} ref={hidePopUp} />
                </div>
            }
            {showPopUpScorm && <ScormPlayer getDataFromChild={handlePlayScorm} urlWeb={urlWeb} ref={hidePopUpScorm} />}
        </div>
    )
}

export default MakeAppendix