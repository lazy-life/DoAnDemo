import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { loadEffect } from '../Ultility';

const TeachNow = forwardRef(({ getDataFromChild, lessonPLan, loadingStatus }) => {
    const fileInputRef = useRef(null);
    const hidePopUp = useRef(null)
    const [nameScorm, setNameScorm] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (loadingStatus === true) {
            if (lessonPLan.length > 0) {
                setNameScorm(lessonPLan)
                setIsLoading(false)
            }
        } else if (loadingStatus === false) {
            if (lessonPLan.length > 0) {
                setNameScorm(lessonPLan)
                setIsLoading(false)
            }
        } else {
            setNameScorm([])
            setIsLoading(false)
        }
    }, [lessonPLan, loadingStatus])

    const handleShowScorm = (data) => {
        getDataFromChild(data, true)
    }

    const handleClosePopUp = () => {
        getDataFromChild('close', false)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handlePopupShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupShow);
        }
    }, [])

    const handlePopupShow = (e) => {
        if (hidePopUp.current && !hidePopUp.current.contains(e.target)) {
            getDataFromChild('close', false)
        }
    };

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


    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        // onFileSelect(file);
    };




    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                accept=".zip"
            />
            <div id="view-document-wrapper">
                <div ref={hidePopUp} className="borderPopUp">
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
                                {nameScorm.length > 0 ? nameScorm.map((scorm) => (
                                    <div key={scorm.id} className="perScorm" onClick={() => handleShowScorm(scorm)}>
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
                                                        <Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />
                                                )
                                            }
                                            <div className='nameViewDocument'>
                                                <p>{scorm.name}</p>
                                            </div>
                                        </div>
                                        <div className="menu">
                                            <Icon icon="ph:monitor-play-bold" />
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
                            </>
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
                    <div className="botDocument">
                        <button onClick={() => {
                            handleClosePopUp()
                        }} >Xong</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TeachNow;
