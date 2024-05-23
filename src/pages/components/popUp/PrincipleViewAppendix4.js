import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

import '../../../sass/main.scss'
import axios from 'axios'
import { url } from '../../../Config/config'
import { loadEffect } from '../Ultility'
import ViewDoc from './ViewDoc'
import ScormPlayer from '../ScormPlayer'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function PrincipalViewAppendix4({ lessonId, teacherId, closePopUp }) {
    const [lessonPlans, setLessonPans] = useState([])
    const [isLoadLessonPlans, setIsLoadLessonPlans] = useState(true)
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [showScorm, setShowScorm] = useState(false)
    const [lessonPlanUrl, setLessonPlanUrl] = useState('')
    const [fileName, setFileName] = useState('')
    const [staticSiteUrl, setStaticSiteUrl] = useState('')

    const loadLessonPlanUrl = async (id) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Plan/GetPlanFileUrl/' + id + '/4', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setLessonPlanUrl(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const handleViewLessonPlan = (lessonPlanId, fileExtension, fileName, staticSiteUrl) => {
        if (fileExtension === '.zip') {
            setStaticSiteUrl(staticSiteUrl)
            setFileName(fileName)
            setShowScorm(true)
        } else if (fileExtension === '.doc' || fileExtension === '.docx') {
            loadLessonPlanUrl(lessonPlanId)
            setFileName(fileName)
            setShowViewDoc(true)
        }
    }

    const closeViewDoc = () => {
        setShowViewDoc(false)
    }

    const closeScorm = () => {
        setShowScorm(false)
    }

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'view-appendix4-wrapper') {
            closePopUp()
        }
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                closePopUp()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const loadAppendix4 = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Plan/GetLessonPlanWithStatus/' + teacherId + '/' + lessonId + '/1', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setLessonPans(res.data)
                    setIsLoadLessonPlans(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadAppendix4()
    }, [])

    return (
        <div id="view-appendix4-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white py-3">
                <div className="border-bottom border-2 mb-3">
                    <p className="fs-3 elp-text-title px-3 m-0">Tài liệu</p>
                </div>
                <div className="appendix-4-container border-bottom border-2">
                    {!isLoadLessonPlans ? (
                        lessonPlans.length > 0 ? (
                            lessonPlans.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="appendix4 d-flex align-items-center px-3 py-2 mx-2 rounded-4"
                                        onClick={() =>
                                            handleViewLessonPlan(
                                                item.id,
                                                item.fileExtension,
                                                item.name,
                                                item.staticSiteUrl
                                            )
                                        }
                                    >
                                        {item.fileExtension === '.zip' ? (
                                            <Icon
                                                icon="simple-icons:googleslides"
                                                style={{ color: '#ff9f00' }}
                                            />
                                        ) : item.fileExtension === '.docx' ||
                                            item.fileExtension === '.doc' ? (
                                            <Icon
                                                icon="simple-icons:googledocs"
                                                style={{ color: '#4285f4' }}
                                            />
                                        ) : (
                                            <Icon
                                                icon="ri:file-unknow-fill"
                                                style={{ color: '#6b6b6b' }}
                                            />
                                        )}
                                        <p className="px-2 m-0 flex-grow-1">{item.name}</p>
                                        <div className="d-flex align-items-center">
                                            <Icon className="icon" icon="ph:eye-bold" />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="d-flex flex-column align-items-center">
                                <Icon icon="ion:ban" style={{ fontSize: '40px' }} />
                                <span className="px-3 fw-bold">Không có dữ liệu</span>
                            </div>
                        )
                    ) : (
                        <div
                            style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                            className="loading"
                        >
                            <div
                                style={{ left: '47%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        className="btn elp-bg-primary text-white mt-3 mx-3 px-3 float-end rounded-5"
                        onClick={handleCloseButton}
                    >
                        Xong
                    </button>
                </div>
            </div>
            {showViewDoc && (
                <ViewDoc
                    getDataFromChild={closeViewDoc}
                    urlDoc={lessonPlanUrl}
                    nameLessonPlan={fileName}
                />
            )}
            {showScorm && (
                <ScormPlayer
                    getDataFromChild={closeScorm}
                    webInfor={{ name: fileName, staticSiteUrl: staticSiteUrl }}
                />
            )}
        </div>
    )
}

export default PrincipalViewAppendix4
