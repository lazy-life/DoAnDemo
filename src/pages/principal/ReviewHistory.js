import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import { loadEffect } from '../components/Ultility'
import ViewDoc from '../components/popUp/ViewDoc'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function ReviewHistory({ userLoginData }) {
    const [activeAppendixType, setActiveAppendixType] = useState(0)
    const [activeAppendixStatus, setActiveAppendixStatus] = useState(0)
    const [appendixType, setAppendixType] = useState(1)
    const [appendixStatus, setAppendixStatus] = useState(1)
    const [lessonPlans, setLessonPlans] = useState([])
    const [lessonPlanUrl, setLessonPlanUrl] = useState('')
    const [isLoadLessonPlans, setIsLoadLessonPlans] = useState(true)
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [lessonPlan, setLessonPlan] = useState(null)

    const listAppendixTypes = [1, 2]
    const listAppendixStatus = [1, 0]

    const openViewDoc = (lessonPLan) => {
        setLessonPlan(lessonPLan)
        loadLessonPlanUrl(lessonPLan.id, appendixType)
        setShowViewDoc(true)
    }

    const closeViewDoc = () => {
        setShowViewDoc(false)
    }

    const changeColorAppendixType = (index) => {
        setActiveAppendixType(index)
    }
    const changeColorAppendixStatus = (index) => {
        setActiveAppendixStatus(index)
    }

    const chooseAppendixType = (index, item) => {
        changeColorAppendixType(index)
        setAppendixType(item)
    }

    const chooseAppendixStatus = (index, item) => {
        changeColorAppendixStatus(index)
        setAppendixStatus(item)
    }

    const loadLessonPlanUrl = async (id, appendixType) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Plan/GetPlanFileUrl/' + id + '/' + appendixType, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res.data)
                    setLessonPlanUrl(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const loadLessonPlans = async () => {
        let path = ''
        if (appendixType === 1) {
            path =
                'api/Plan/GetAllDepartmentSubjectPlan/' +
                userLoginData.schoolId +
                '/' +
                appendixStatus
        } else if (appendixType === 2) {
            path = 'api/Plan/GetAllDepartmentPlan/' + userLoginData.schoolId + '/' + appendixStatus
        }
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + path, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res.data)
                    setLessonPlans(res.data)
                    setIsLoadLessonPlans(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadLessonPlans()
    }, [appendixType, appendixStatus])

    return (
        <div id="review-history-wrapper">
            <div className="lesson-plan-title-container d-flex bg-white w-100">
                <div className="column-title-1 d-flex justify-content-center align-items-center">
                    <p className="m-0 py-2 fw-bold text-center">Tài liệu</p>
                </div>
                <div className="column-title-2">
                    <p className="m-0 py-2 fw-bold text-center">Trạng thái</p>
                </div>
                <div className="column-title-4 d-flex">
                    <p className="m-0 p-2 fw-bold text-center flex-grow-1">Tên tài liệu</p>
                    <p className="m-0 p-2 fw-bold text-center"></p>
                </div>
            </div>
            <div className="lesson-plan-container d-flex bg-white w-100 mt-1 ">
                <div className="column-1 d-flex flex-column align-items-center">
                    {listAppendixTypes.map((item, index) => {
                        return (
                            <p
                                onClick={() => chooseAppendixType(index, item)}
                                key={index}
                                className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeAppendixType === index ? 'active-appendix-type' : ''
                                    }`}
                            >
                                {item === 1
                                    ? 'Kế hoạch dạy học các môn học'
                                    : item === 2
                                        ? 'Kế hoạch tổ chức hoạt động giáo dục'
                                        : ''}
                            </p>
                        )
                    })}
                </div>
                <div className="column-2 d-flex flex-column align-items-center">
                    {listAppendixStatus.map((item, index) => {
                        return (
                            <p
                                onClick={() => chooseAppendixStatus(index, item)}
                                key={index}
                                className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeAppendixStatus === index ? 'active-appendix-status' : ''
                                    }`}
                            >
                                {item === 1 ? 'Phê duyệt' : item === 0 ? 'Từ chối' : ''}
                            </p>
                        )
                    })}
                </div>
                <div className="column-4 d-flex">
                    <div className="fw-bold my-1 rounded-5 w-100">
                        {!isLoadLessonPlans ? (
                            lessonPlans.length > 0 ? (
                                lessonPlans.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="lesson-plan-item px-3 py-2 d-flex align-items-center"
                                        >
                                            <p className="lesson-plan-name flex-grow-1 px-3 m-0">
                                                {item.name}
                                            </p>
                                            <div
                                                onClick={() => openViewDoc(item)}
                                                className="view-history px-2"
                                            >
                                                <Icon
                                                    icon="mdi:folder-eye-outline"
                                                    style={{ fontSize: '18px' }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="d-flex flex-column align-items-center pt-2">
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
                                    style={{ left: '78%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showViewDoc && (
                <ViewDoc
                    getDataFromChild={closeViewDoc}
                    urlDoc={lessonPlanUrl}
                    nameLessonPlan={lessonPlan.name}
                />
            )}
        </div>
    )
}

export default ReviewHistory
