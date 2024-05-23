import React, { useState, forwardRef, useRef, useEffect } from 'react';
import axios from 'axios';
import fileDownload from 'js-file-download'
import { Icon } from '@iconify/react';
import MenuViewDocument from './MenuViewDocument';
import { loadEffect } from '../Ultility';
import Success from './Success';
import DeleteConfirm from './DeleteConfirm';
import { url } from '../../../Config/config';
import ViewComment from './ViewComment';
import { handleDecrypt } from '../Ultilities/CommonFunction';

const ViewDocument = forwardRef(({ isShowUpload, getDataFromChild, lessonPlan, loadingStatus, appendix, userLoginValue, subjectSelect, deleteItemList }) => {
    const fileInputRef = useRef(null);
    const [selectedScorm, setSelectedScorm] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpload, setsUpload] = useState(null);
    const hidePopUp = useRef('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [indexCheckBtn, setIndexCheckBtn] = useState()
    const [nameLessonSelect, setNameLessonSelect] = useState(null)
    const [deleteShow, setDeleteShow] = useState(false)
    const [viewCommentShow, setViewCommentShow] = useState(false)
    const [deleteObject, setDeleteObject] = useState({})
    const [commentContent, setCommentContent] = useState(null)
    const [deleteItem, setDeleteItem] = useState([])
    const hidePopupRef = useRef(null)

    const [hideViewDocument, setHideViewDocument] = useState(true)

    const [nameScorm, setNameScorm] = useState([])

    useEffect(() => {
        if (deleteItemList.length > 0) {
            let listTemp = []
            deleteItemList.forEach(x => {
                if (x.appendixType === appendix) {
                    listTemp.push(x.id)
                }
            })
            setDeleteItem(listTemp)
        } else {
            setDeleteItem([])
        }
    }, [deleteItemList])

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
            if (hideViewDocument && !viewCommentShow) {
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
    }, [hideViewDocument, viewCommentShow]);

    useEffect(() => {
        setsUpload(isShowUpload)
    }, [isShowUpload])

    const revealRefs = {
        current: [],
    };

    const addToRefs = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    const handleShowScorm = (data) => {
        setNameLessonSelect(data)
        getDataFromChild(data, true)
    }
    const handleDeletePlanFile = (data) => {
        if (data) {
            setHideViewDocument(false)
            setNameLessonSelect(data)
            setDeleteShow(true)
            setDeleteObject({
                idObject: 1,
                title: 'Xoá tài liệu',
                content: `Bạn có muốn xoá tài liệu ${data.name} không?`,
                path: ''
            })
        }
    }

    const getDataDelete = (data) => {
        if (data === 'delete') {
            setHideViewDocument(true)
            setDeleteShow(false)
            const dataDelete = {
                subjectSelectedId: subjectSelect.id,
                userDataId: userLoginValue.userId,
                lessonSelectedId: nameLessonSelect.id,
                lessonSelectedName: data.name,
                appendixType: appendix,
                dataDeleteItem: nameLessonSelect.id
            }

            setDeleteItem(prev => [...prev, nameLessonSelect.id])
            getDataFromChild('7', dataDelete)
        } else if (data === 'cancel') {
            setHideViewDocument(true)
            setDeleteShow(false)
        }
    }

    const handleDeleteAppendix3 = () => {
        if (appendix === '3') {
            getDataFromChild('3', true)
        }
    }
    const handleDeleteAppendix4 = () => {
        if (appendix === '4') {
            getDataFromChild('6', true)
        }
    }

    const handleClosePopUp = () => {
        setNameScorm([])
        getDataFromChild('close', false)
    }

    const handleCloseViewComment = (data) => {
        if (data === '0') {
            setViewCommentShow(false)
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

    const handleViewComment = (dataComment) => {
        setCommentContent(dataComment)
        setViewCommentShow(true)
    }

    const handleFileInputChange = (e) => {
        const fileData = e.target.files[0];
        getDataFromChild('5', fileData)
    };

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
            if (data === 2) {
                handleDeletePlanFile(selectedScorm)
            } else if (data === 3) {
                handleShowScorm(selectedScorm)
            } else if (data === 4) {
                if (appendix === '4') {
                    if (selectedScorm.fileExtension === '.docx') {
                        fetDataDocUrl(selectedScorm.id, '4', selectedScorm.name)
                    } else if (selectedScorm.fileExtension === '.zip') {
                        fetDataDocUrl(selectedScorm.id, '4', selectedScorm.name)
                    }
                } else if (appendix === '3') {
                    if (selectedScorm.fileExtension === '.docx') {
                        fetDataDocUrl(selectedScorm.id, '3', selectedScorm.name)
                    } else if (selectedScorm.fileExtension === '.pdf') {
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
                        axios.get(dataTemp, {
                            responseType: 'blob'
                        })
                            .then((res) => {
                                fileDownload(res.data, planName)
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            })
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
                getDataFromChild('close', false)
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
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                accept=".zip, .docx, .doc, .pdf"
            />
            <div id="view-document-wrapper">
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
                            <>
                                {nameScorm.length > 0 ? nameScorm.map((scorm, index) => (
                                    deleteItem.includes(scorm.id)
                                        ?
                                        (<div key={scorm.id} className="perScorm" style={{ opacity: '0.5' }}>
                                            <div className="fileName">
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
                                            <div className="menu"
                                                ref={addToRefs}
                                            >
                                                <Icon icon="eos-icons:loading" style={{ color: '#c20000' }} />
                                            </div>
                                        </div>)
                                        :
                                        (<div key={scorm.id} className="perScorm">
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
                                                <MenuViewDocument getDataFromChild={handleActionPopUp} />
                                            </div>
                                        </div>)

                                )) :
                                    <>
                                        {!isLoading && <div className='noContent'>
                                            <div>
                                                <div style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                                    <p>Chưa có tài liệu nào</p>
                                                </div>
                                                <button onClick={() => fileInputRef.current.click()}>Tải lên tài liệu</button>
                                            </div>
                                        </div>}
                                    </>
                                }
                            </>
                        </div>
                    ) : (
                        <div className='middleDocument'>
                            {!isLoading && <div className='noContent'>
                                <div>
                                    <div style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                        <p>Chưa có tài liệu nào</p>
                                    </div>
                                    <button onClick={() => fileInputRef.current.click()}>Tải lên tài liệu</button>
                                </div>
                            </div>}
                        </div>
                    )}
                    <div className="botDocument">
                        <button onClick={() => fileInputRef.current.click()}>Tải lên</button>
                    </div>
                </div>
            </div>
            {showSuccess && <Success message={msgSuccess} />}
            {deleteShow && (
                <DeleteConfirm getDataFromChild={getDataDelete} messageDelete={deleteObject} />
            )}

            {viewCommentShow && <ViewComment getDataFromChild={handleCloseViewComment} commentContent={commentContent} />}
        </div>
    );
});

export default ViewDocument;
