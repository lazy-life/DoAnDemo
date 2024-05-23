import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import { loadEffect } from '../components/Ultility'
import ApproveDoc from '../components/ApproveDoc'
import Success from '../components/popUp/Success'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function Appendix1({ departments, grades }) {
    const [lessonPlan, setLessonPlan] = useState(null)
    const [lessonPlanUrl, setLessonPlanUrl] = useState('')
    const [activeSubject, setActiveSubject] = useState(0)
    const [activeGrade, setActiveGrade] = useState(0)
    const [activeDepartment, setActiveDepartment] = useState(0)
    const [selectedSubject, setSeletedSubject] = useState()
    const [selectedGrade, setSelectedGrade] = useState()
    const [selectedDepartment, setSelectedDepartment] = useState()
    const [subjects, setSubjects] = useState([])
    const [headOfDepartment, setHeadOfDepartment] = useState(null)
    const [isLoadLessonPlan, setIsLoadLessonPlan] = useState(true)
    const [isLoadDepartments, setIsLoadDepartments] = useState(true)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const [commentContent, setCommentContent] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedDoc, setSelectedDoc] = useState(null)

    const changeColorDepartment = (index, department) => {
        setActiveDepartment(index)
        setSelectedDepartment(department)
        if (department.subjects.length > 0) {
            setSubjects([
                ...new Set(
                    department.subjects.map((subject) => {
                        return subject.subjectName
                    })
                ),
            ])
            setSeletedSubject(department.subjects[0].subjectName)
            setActiveSubject(0)
        } else {
            setSubjects([])
            setSeletedSubject(null)
            setActiveSubject(null)
        }
        setHeadOfDepartment(department.headOfDepartment)
    }
    const changeColorSubject = (index, subjectName) => {
        setActiveSubject(index)
        setSeletedSubject(subjectName)
    }
    const changeColorGrade = (index, grade) => {
        setActiveGrade(index)
        setSelectedGrade(grade)
    }

    const findSubject = (listSubjects, subjectName, grade) => {
        return listSubjects.find((item) => item.subjectName === subjectName && item.grade === grade)
    }

    const handleApproveDoc = (data, dataSend) => {
        if (data === '0') {
            setShowPopUpDoc(false)
        } else if (data === '1') {
            if (selectedDoc) {
                dataSend.PlanId = selectedDoc.id
                dataSend.TypeId = 1
                fetchApproveFile(dataSend)
            }
        }
    }

    const fetchApproveFile = async (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/Plan/UpdatePlan'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    loadLessonPlan()
                    if (requestData.Status === 1) {
                        setMsgSuccess('Đã phê duyệt')
                    } else if (requestData.Status === 0) {
                        setMsgSuccess('Đã từ chối')
                    }

                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        setShowPopUpDoc(false)
                    }, 1000)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const fetDataDocUrl = (plainId, typeId) => {
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
                        setUrlDoc(dataTemp)
                    }
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                });
        }
    }

    const loadLessonPlan = async () => {
        let subject = findSubject(selectedDepartment.subjects, selectedSubject, selectedGrade)

        if (
            selectedDepartment !== null &&
            selectedDepartment !== undefined &&
            subject !== null &&
            subject !== undefined
        ) {

            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .get(
                        url +
                        'api/Plan/GetDepartmentSubjectPlan/' +
                        selectedDepartment.id +
                        '/' +
                        subject.id, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }

                    }
                    )
                    .then((res) => {
                        // console.log(res.data)
                        if (Object.keys(res.data).length > 0) {
                            setLessonPlan(res.data)
                            setIsLoadLessonPlan(false)
                        } else {
                            setLessonPlan(null)
                            setIsLoadLessonPlan(false)
                        }
                    })
                    .catch((err) => {
                        // console.error(err)
                        setLessonPlan(null)
                        setIsLoadLessonPlan(false)
                    })
            } else {
                setLessonPlan(null)
                setIsLoadLessonPlan(false)
            }
        }
    }

    useEffect(() => {
        if (departments.length > 0) {
            setSelectedDepartment(departments[0])
            if (departments[0].subjects.length > 0) {
                setSubjects([
                    ...new Set(
                        departments[0].subjects.map((subject) => {
                            return subject.subjectName
                        })
                    ),
                ])
                setSeletedSubject(departments[0].subjects[0].subjectName)
            }
            setSelectedGrade(grades[0])
            setHeadOfDepartment(departments[0].headOfDepartment)
        } else {
            setLessonPlan(null)
            setIsLoadLessonPlan(false)
        }
        setIsLoadDepartments(false)
    }, [departments])

    useEffect(() => {
        if (
            departments.length > 0 &&
            selectedDepartment !== null &&
            selectedDepartment !== undefined
        ) {
            loadLessonPlan()
        }
    }, [selectedDepartment, selectedSubject, selectedGrade])

    const handleOpenDocument = (data) => {
        setSelectedDoc(data)
        fetDataDocUrl(data.id, 1)
        setNameLessonPlan(data.name)
        setCommentContent(data.comment)
        setShowPopUpDoc(true)
    }

    return (
        <div id="appendix-1-wrapper">
            <div className="lesson-plan-title-container d-flex bg-white w-100">
                <div className="column-title-1 d-flex justify-content-center align-items-center">
                    <p className="m-0 py-2 fw-bold text-center">Tên tổ</p>
                </div>
                <div className="column-title-5">
                    <p className="m-0 py-2 fw-bold text-center">Tên môn</p>
                </div>
                <div className="column-title-3">
                    <p className="m-0 py-2 fw-bold text-center">Khối</p>
                </div>
                <div className="column-title-2">
                    <p className="m-0 py-2 fw-bold text-center">Tên tổ trưởng</p>
                </div>
                <div className="column-title-4 d-flex">
                    <p className="m-0 p-2 fw-bold text-center flex-grow-1">Tên tài liệu</p>
                    <p className="m-0 p-2 fw-bold text-center"></p>
                </div>
            </div>
            <div className="lesson-plan-container d-flex bg-white w-100 mt-1 ">
                <div className="column-1 d-flex flex-column align-items-center">
                    {!isLoadDepartments ? (
                        departments.length > 0 ? (
                            departments.map((item, index) => {
                                return (
                                    <p
                                        onClick={() => changeColorDepartment(index, item)}
                                        key={index}
                                        className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeDepartment === index ? 'active-department' : ''
                                            }`}
                                    >
                                        {item.departmentName}
                                    </p>
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
                                style={{ left: '25%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    )}
                </div>
                <div className="column-5 d-flex flex-column align-items-center">
                    {subjects.length > 0 ? (
                        subjects.map((item, index) => {
                            return (
                                <p
                                    onClick={() => changeColorSubject(index, item)}
                                    key={index}
                                    className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeSubject === index ? 'active-subject' : ''
                                        }`}
                                >
                                    {item}
                                </p>
                            )
                        })
                    ) : (
                        <div className="d-flex flex-column align-items-center pt-2">
                            <Icon icon="ion:ban" style={{ fontSize: '40px' }} />
                            <span className="px-3 fw-bold">Không có dữ liệu</span>
                        </div>
                    )}
                </div>
                <div className="column-3 d-flex flex-column align-items-center">
                    {grades.map((item, index) => {
                        return (
                            <p
                                onClick={() => changeColorGrade(index, item)}
                                key={index}
                                className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeGrade === index ? 'active-grade' : ''
                                    }`}
                            >
                                {item}
                            </p>
                        )
                    })}
                </div>
                <div className="column-2 d-flex flex-column align-items-center">
                    {headOfDepartment !== null ? (
                        <p className="fw-bold my-1 px-3 py-2 rounded-5 active-teacher">
                            {headOfDepartment.fullname}
                        </p>
                    ) : (
                        <div className="d-flex flex-column align-items-center pt-2">
                            <Icon icon="ion:ban" style={{ fontSize: '40px' }} />
                            <span className="px-3 fw-bold">Không có dữ liệu</span>
                        </div>
                    )}
                </div>
                <div className="column-4 d-flex">
                    <div className="fw-bold my-1 rounded-5 w-100">
                        {!isLoadLessonPlan ? (
                            lessonPlan !== null ? (
                                <div className="lesson-plan-item d-flex align-items-center px-3 py-2">
                                    <p onClick={() => handleOpenDocument(lessonPlan)} className="lesson-plan-name flex-grow-1 px-3 m-0">
                                        {lessonPlan.name}
                                    </p>
                                    <div style={lessonPlan.status === 0 ? { backgroundColor: '#f76b59', borderRadius: '10px' }
                                        :
                                        lessonPlan.status === 1 ? { backgroundColor: '#2dcc7f', borderRadius: '10px' }
                                            :
                                            {}
                                    }
                                        onClick={() => handleOpenDocument(lessonPlan)}
                                        className="view-appendix1 px-2"
                                    >
                                        <Icon
                                            icon="mdi:folder-eye-outline"
                                            style={{ fontSize: '18px' }}
                                        />
                                    </div>
                                </div>
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
            {showPopUpDoc && <ApproveDoc getDataFromChild={handleApproveDoc} urlDoc={urlDoc} nameLessonPlan={nameLessonPlan} commentContent={commentContent} />}
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default Appendix1
