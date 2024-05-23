import React, { useEffect, createContext, useRef, useState, Suspense } from "react"
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react"
import ListAppendix from "./ListAppendix"
import AppendixPattern from "./AppendixPattern"
import ScormPlayer from "./ScormPlayer"
import ViewDocument from "./popUp/ViewDocument"
import ListAppendix3 from "./ListAppendix3"
// import ReviewAppendix4 from "./ReviewAppendix4";
// import ReviewAppendix3 from "./ReviewAppendix3";
import HistoryAppendix from "./HistoryAppendix";
import ApproveDoc from "./ApproveDoc";
import { url } from "../../Config/config";
import ApproveScorm from "./popUp/ApproveScorm";
import { loadEffect } from "./Ultility";


const ReviewAppendix4 = React.lazy(() => {
    return import('./ReviewAppendix4').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})

const ReviewAppendix3 = React.lazy(() => {
    return import('./ReviewAppendix3').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})

export const indexAppendix = createContext()
const ReviewAppendix = ({ userLoginData }) => {
    const [selectTitle, setSelectTitle] = useState(4)
    const [showPopUp, setShowPopUp] = useState(false)
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [showPopUpScorm, setShowPopUpScorm] = useState(false)
    const [isUpload, setIsUpload] = useState('')
    const hidePopUp = useRef('')
    const hidePopUpScorm = useRef('')


    const handleSelectedTitle = (index) => {
        setSelectTitle(index)
    }

    const handleViewAppendix4 = (id, data, subjectIdData, appendix) => {
        setShowPopUp(data)
        setIsUpload(id)
    }
    const handleViewAppendix3 = (id, data) => {
        setShowViewDoc(data)
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
    const titleAppendix4 = ['Tên môn học', 'Tên khối', 'Tên giáo viên', 'Tên bài học', 'Ngày nộp', '']
    const titleAppendix3 = ['Tên môn học', 'Tên khối', 'Tên giáo viên', 'Tên tài liệu', 'Ngày nộp', '']

    const urlWeb = 'https://storage.googleapis.com/scormstaticsite/Quiz/res/index.html?'
    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowViewDoc(false)
        }
    }

    const urldoc = 'https://storage.googleapis.com/lessonplan/dfe?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=elp-capstone%40elp-capstone.iam.gserviceaccount.com%2F20240315%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240315T055643Z&X-Goog-Expires=10800&X-Goog-SignedHeaders=host&X-Goog-Signature=a3d16846c008b00494cf4c08af88fd21fdd3674ff0896beaf69eef7970c7d42fc37157d7e750746954955f0a91d1ee32845f472a774fcdd6c433ba4ae61abef4ed9e81e5e72ddda5a8adc0971a19bec1ede0848873752e20e5e25eaa0d524b0214383df7c1df3732a229ed65f1c1f82b6490622444ea2be5a329e8aeafc9ba63e44835509bb106db3c8dde795f864dc1cc58b39c420d798b0a1460c1715926b18cdb9462d139be207d7267e43108872c57291191a058b1ed2b2d3a78b3eed3422a1cf68deca00e97d86e6576cfd2f7dd58d1eb37cfdfd25391a6b68df5982e8b3e55a09757334fb8f5d031f94063b451abc192b5dab7fc77844f95f3db7db175'

    return (
        <div>
            <div id="reviewAppendix-wrapper">
                <div id="appendixBorder">
                    <div className="titleAppendix">
                        <div className="leftTitleAppendix">
                            <div className={selectTitle === 4 ? "selectTitle" : "titleName"}
                                onClick={() => handleSelectedTitle(4)}>
                                <Icon icon="heroicons-outline:document-text" width={'22px'} height={'22px'} />
                                <p>Kế hoạch bài dạy</p>
                            </div>
                            <div className={selectTitle === 3 ? "selectTitle" : "titleName"}
                                onClick={() => handleSelectedTitle(3)}>
                                <Icon icon="heroicons-outline:document-text" width={'22px'} height={'22px'} />
                                <p>Kế hoạch giáo dục của giáo viên</p>
                            </div>
                        </div>
                    </div>

                    <indexAppendix.Provider value={selectTitle}>
                        <div className="appendix-4">
                            {selectTitle === 4 &&
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            <div
                                                className="loader"
                                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                                            />
                                        </div>
                                    }
                                >
                                    <ReviewAppendix4 title={titleAppendix4} userLoginData={userLoginData} getDataFromChild={handleViewAppendix4} />
                                </Suspense>
                            }
                            {selectTitle === 3 &&
                                <Suspense
                                    fallback={
                                        <div className="loading">
                                            <div
                                                className="loader"
                                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                                            />
                                        </div>
                                    }
                                >
                                    <ReviewAppendix3 title={titleAppendix3} userLoginData={userLoginData} getDataFromChild={handleViewAppendix3} />
                                </Suspense>
                            }
                        </div>
                    </indexAppendix.Provider>
                </div>
            </div>

            {showPopUpScorm && <ScormPlayer getDataFromChild={handlePlayScorm} urlWeb={urlWeb} ref={hidePopUpScorm} />}
            {showViewDoc && <ApproveDoc getDataFromChild={handleViewDoc} urlDoc={urldoc} />}
        </div>
    )
}

export default ReviewAppendix