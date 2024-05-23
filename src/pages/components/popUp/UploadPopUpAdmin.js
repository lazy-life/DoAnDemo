import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Success from './Success';
import ErrorPopup from './ErrorPopUp';

const UploadPopUpAdmin = ({ getDataFromChild }) => {
    const fileInputRef = useRef(null);
    const [selectedScorm, setSelectedScorm] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpload, setsUpload] = useState(null);
    const hidePopUp = useRef('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [indexCheckBtn, setIndexCheckBtn] = useState()
    const [nameLessonSelect, setNameLessonSelect] = useState(null)
    const [deleteShow, setDeleteShow] = useState(false)
    const [deleteObject, setDeleteObject] = useState({})
    const [deleteItem, setDeleteItem] = useState([])
    const hidePopupRef = useRef(null)

    const [hideViewDocument, setHideViewDocument] = useState(true)
    const [msgLoad, setMsgLoad] = useState(null)
    const [showAlertUpload, setShowAlertUpload] = useState(false)
    const [msgShowAlert, setMsgShowAlert] = useState(null)

    const [nameScorm, setNameScorm] = useState([])

    const handleDropdownClick = (e) => {
        if (hidePopupRef.current && !hidePopupRef.current.contains(e.target)) {
            if (!showAlertUpload && nameScorm.length === 0) {
                getDataFromChild("close")
            }
        }
    };

    useEffect(() => {
        if (showAlertUpload) {
            document.addEventListener('mousedown', handleDropdownClick);
            return () => {
                document.removeEventListener('mousedown', handleDropdownClick);
            };
        }
    }, [showAlertUpload]);

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

    const handleClosePopUp = () => {
        setNameScorm([])
        getDataFromChild('close', false)
    }


    const handleMenuShow = (data) => {
        if (nameScorm.length > 0) {
            const dataFile = nameScorm
            const dataRemoved = dataFile.filter(item => item.file.name !== data.file.name)
            setNameScorm(dataRemoved)
        }
    };

    const handleFileInputChange = (e) => {
        setMsgLoad('Vui lòng không thoát trong quá trình tải lên!')
        setIsLoading(true)
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

    const handleUploadFiles = () => {
        getDataFromChild(nameScorm)
    }

    const addNewFiles = (selectedFiles, savedFiles) => {
        if (savedFiles.length > 0) {
            const newFiles = selectedFiles.filter(selectedFile => {
                return !savedFiles.some(savedFile => savedFile.file.name === selectedFile.file.name);
            });

            const updatedFiles = savedFiles.concat(newFiles);

            return updatedFiles;
        } else {
            return selectedFiles;
        }
    };

    const handleFileChange = (event) => {
        let checkRegex = false
        const files = event.target.files;
        const selectedFiles = [];

        const englishLettersRegex = /^[a-zA-Z0-9_\-\.\(\) ]+$/;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (englishLettersRegex.test(file.name)) {
                const fileExtension = file.name.split('.');
                selectedFiles.push({
                    file: file,
                    extension: fileExtension[1]
                });
            } else {
                checkRegex = true
            }
        }

        const updatedFiles = addNewFiles(selectedFiles, nameScorm); // Thay `savedFiles` bằng tên state hoặc mảng đã lưu

        setNameScorm(updatedFiles)

        if (checkRegex) {
            checkRegex = false
            setMsgShowAlert('Vui lòng tải lên các tài liệu có Tên Tiếng Việt không dấu!')
            setShowAlertUpload(true)
        }
    }

    const handleClosePopupShowAlert = (data) => {
        if (data === 'cancel') {
            setShowAlertUpload(false)
        }
    }

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".docx, .doc, .pdf"
            />
            <div id="view-document-wrapper">
                <div ref={hidePopupRef} className="borderPopUp">
                    <div className="topDocument">
                        <p>Tài liệu</p>
                        <Icon icon="flowbite:close-solid" onClick={() => {
                            handleClosePopUp()
                        }} />
                    </div>
                    <div className="middleDocument">
                        <>
                            <>
                                {nameScorm.length > 0 ? nameScorm.map((scorm) => (
                                    (
                                        <div className="perScorm">
                                            <div className="fileName" onClick={() => handleShowScorm(scorm)}>
                                                {scorm.extension === 'pdf'
                                                    ?
                                                    <Icon icon="uiw:file-pdf" style={{ color: '#D82E18' }} />
                                                    :
                                                    (
                                                        scorm.extension === 'docx' || scorm.extension === 'doc'
                                                            ?
                                                            <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                                                            :
                                                            <Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />
                                                    )

                                                }
                                                <div className='nameViewDocument'>
                                                    <p>{scorm.file.name}</p>
                                                </div>
                                            </div>
                                            <div className="menu"
                                                ref={addToRefs}
                                                onClick={() => handleMenuShow(scorm)}
                                            >
                                                <Icon icon="mingcute:delete-2-line" />
                                            </div>
                                        </div>
                                    )
                                )) :
                                    <>
                                        <div className='noContent'>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <div style={{ width: '100%', textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
                                                    <p>Lưu ý: Tên tài liệu tải lên là tiếng Việt không dấu</p>
                                                </div>
                                                <button onClick={() => fileInputRef.current.click()}>Chọn tài liệu cần tải</button>
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        </>
                    </div>
                    <div className="botDocument">
                        {nameScorm.length > 0 && <div style={{ width: '70%', display: 'flex', justifyContent: 'center', fontSize: '1.2rem', padding: '0' }}>
                            <button style={{ padding: '.3rem .6rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => fileInputRef.current.click()}>
                                <Icon icon="ph:plus-circle-bold" width={'1.9rem'} style={{ color: 'white' }} />
                            </button>
                        </div>}
                        <button onClick={() => handleUploadFiles()}>Tải lên</button>
                    </div>
                </div>
            </div>
            {showSuccess && <Success message={msgSuccess} />}
            {showAlertUpload && <ErrorPopup handleClose={handleClosePopupShowAlert} errorMsg={msgShowAlert} />}
        </div>
    );
};

export default UploadPopUpAdmin;
