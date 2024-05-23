import { Icon } from "@iconify/react";
import { loadEffect } from "../Ultility";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CommentReject from "./CommentReject";
import MenuViewDocumentApprove from "./MenuViewDocumentApprove";
import { url } from "../../../Config/config";
import { handleDecrypt } from "../Ultilities/CommonFunction";

const ApproveScorm = (({ getDataFromChild, lessonPlan, loadingStatus, appendix }) => {
    const [selectedScorm, setSelectedScorm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const hidePopUp = useRef('')
    const [indexCheckBtn, setIndexCheckBtn] = useState()
    const [nameLessonSelect, setNameLessonSelect] = useState(null)
    const [commentReject, setCommentReject] = useState(false)
    const hidePopupRef = useRef(null)
    const [comment, setComment] = useState(null)
    const [commentContent, setCommentContent] = useState(null)
    const [viewCommentShow, setViewCommentShow] = useState(false)

    const [hideViewDocument, setHideViewDocument] = useState(true)

    const [nameScorm, setNameScorm] = useState([])

    useEffect(() => {
        if (loadingStatus === true) {
            if (lessonPlan.length > 0) {
                setNameScorm(lessonPlan)
                setIsLoading(false)
            }
        } else if (loadingStatus === false) {
            if (lessonPlan.length > 0) {
                setNameScorm(lessonPlan)
                setIsLoading(false)
            }
        } else {
            setNameScorm([])
            setIsLoading(false)
        }
    }, [lessonPlan, loadingStatus]);

    const handleDropdownClick = (e) => {
        if (hidePopupRef.current && !hidePopupRef.current.contains(e.target)) {
            if (hideViewDocument && !commentReject) {
                getDataFromChild("close")
            }
        }
    };

    useEffect(() => {
        if (hideViewDocument) {
            document.addEventListener('mousedown', handleDropdownClick);
            return () => {
                document.removeEventListener('mousedown', handleDropdownClick);
            };
        }
    }, [hideViewDocument, commentReject]);

    const revealRefs = {
        current: [],
    };

    const handleViewComment = (dataComment) => {
        setCommentContent(dataComment)
        setCommentReject(true)
    }


    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    const handleShowScorm = (data) => {
        setNameLessonSelect(data)
        getDataFromChild(data, true)
    }

    const handleClosePopUp = () => {
        if (!commentReject) {
            setNameScorm([])
            getDataFromChild('close', false)
        }
    }

    const handleMenuShow = (id, index) => {
        setIndexCheckBtn(index)
        if (!selectedScorm) {
            setSelectedScorm(id);
        }
        else if (selectedScorm.toString() === id.toString()) {
            setSelectedScorm(null);
        } else {
            setSelectedScorm(id);
        }

    };

    const handleReject = () => {
        if (nameScorm.length > 0) {
            setCommentReject(true)
        }
    }

    const handleApprove = () => {
        if (nameScorm.length > 0) {
            const listFile = []
            nameScorm.forEach(item => {
                const jsonReject = {
                    planId: item.id,
                    typeId: 4,
                    status: 1,
                    comment: null
                }
                listFile.push(jsonReject)
            })
            getDataFromChild('1', listFile)
        }
    }

    const handleCommentReject = (id, data) => {
        if (id === '0') {
            setCommentReject(false)
        } else if (id === '1') {
            setComment(data)
            setCommentReject(false)
            const listFile = []
            nameScorm.forEach(item => {
                const jsonReject = {
                    planId: item.id,
                    typeId: 4,
                    status: 0,
                    comment: data
                }
                listFile.push(jsonReject)
            })
            getDataFromChild('1', listFile)
        }
    }



    useEffect(() => {
        const handlePopupShow = (e) => {
            let numIndex = indexCheckBtn;
            if (hidePopUp.current && !hidePopUp.current.contains(e.target)
                && revealRefs.current[numIndex] && !revealRefs.current[numIndex].contains(e.target)) {
                setSelectedScorm(null);
            }
        };
        document.addEventListener('mousedown', handlePopupShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupShow);
        }
    }, [indexCheckBtn])

    const handleActionPopUp = (data) => {
        try {
            if (data === 3) {
                handleShowScorm(selectedScorm)
            } else if (data === 4) {
                if (appendix === '4') {
                    if (selectedScorm.fileExtension === '.docx') {
                        fetDataDocUrl(selectedScorm.id, '4', selectedScorm.name)
                    } else if (selectedScorm.fileExtension === '.zip') {
                        fetDataDocUrl(selectedScorm.id, '4', selectedScorm.name)
                    } else {
                        fetDataDocUrl(selectedScorm.id, '4', selectedScorm.name)
                    }
                } else if (appendix === '3') {
                    if (selectedScorm.fileExtension === '.docx') {
                        fetDataDocUrl(selectedScorm.id, '3', selectedScorm.name)
                    } else if (selectedScorm.fileExtension === '.zip') {
                        fetDataDocUrl(selectedScorm.id, '3', selectedScorm.name)
                    } else {
                        fetDataDocUrl(selectedScorm.id, '3', selectedScorm.name)
                    }
                }
            }
        } catch (error) {
            // alert(error)
        }

    }

    const fetDataDocUrl = (plainId, typeId, planName) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetPlanFileUrl/${plainId}/${typeId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        const url = window.URL.createObjectURL(new Blob([dataTemp]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', planName);
                        document.body.appendChild(link);
                        link.click();
                    }
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                if (!commentReject) {
                    getDataFromChild('close', false)
                }
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div>
            <div id="approveScorm-wrapper">
                <div ref={hidePopupRef} className="borderPopUp">
                    <div className="topDocument">
                        <p>Tài liệu</p>
                        <Icon icon="flowbite:close-solid" onClick={() => {
                            handleClosePopUp()
                        }} />
                    </div>
                    {isLoading && (
                        <>
                            <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                <div
                                    style={{ left: '48%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        </>
                    )}
                    {!isLoading ? (
                        <div className="middleDocument">
                            {nameScorm.length > 0 ? nameScorm.map((scorm, index) => (
                                <div key={scorm.id} className="perScorm">
                                    <div className="fileName" onClick={() => handleShowScorm(scorm)}>
                                        {scorm.fileExtension === '.zip'
                                            ?
                                            <Icon icon="simple-icons:googleslides" style={{ color: '#ff9f00' }} />
                                            :
                                            (
                                                scorm.fileExtension === '.docx' || scorm.fileExtension === '.doc'
                                                    ?
                                                    <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                                                    :
                                                    (scorm.fileExtension === '.pdf'
                                                        ? (<Icon icon="uiw:file-pdf" style={{ color: '#D82E18' }} />)
                                                        :
                                                        (<Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />))
                                            )

                                        }
                                        <div className='nameViewDocument'>
                                            <p>{scorm.name}</p>
                                        </div>
                                    </div>
                                    {scorm.comment && <div className='commentFileReject' onClick={() => handleViewComment(scorm.comment)}>
                                        <Icon icon="majesticons:comment-text" />
                                    </div>}
                                    <div className="menu"
                                        ref={addToRefs}
                                        onClick={() => handleMenuShow(scorm, index)}
                                    >
                                        <MenuViewDocumentApprove getDataFromChild={handleActionPopUp} />
                                    </div>
                                </div>
                            )) :
                                <>
                                    {!isLoading && <div className='noContent'>
                                        <div>
                                            <div style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                                <Icon icon="nonicons:not-found-16" />
                                                <p>Chưa có tài liệu nào</p>
                                            </div>
                                        </div>
                                    </div>}
                                </>
                            }
                        </div>
                    ) : (
                        <div className='middleDocument'>
                            {!isLoading && <div className='noContent'>
                                <div>
                                    <div style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                        <Icon icon="nonicons:not-found-16" />
                                        <p>Chưa có tài liệu nào</p>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    )}
                    {nameScorm.length > 0 ? (<div className="botDocument">
                        <div className="bottomPopup">
                            <button className="cancel" onClick={() => handleReject()}>Từ chối</button>
                            <button className="accept" onClick={() => handleApprove()}>Phê duyệt</button>
                        </div>
                    </div>) : <div className="botDocument">
                        <div className="bottomPopup">
                            <button className="cancel" disabled style={{ backgroundColor: '#a5483c' }}>Từ chối</button>
                            <button className="accept" disabled style={{ backgroundColor: '#3a8d65' }}>Phê duyệt</button>
                        </div>
                    </div>}
                </div>
            </div>
            {commentReject && <CommentReject getDataFromChild={handleCommentReject} commentContent={commentContent} />}
        </div>
    );
});

export default ApproveScorm