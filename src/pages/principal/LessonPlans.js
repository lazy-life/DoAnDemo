import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { url } from '../../Config/config'

import '../../sass/main.scss'
import PrincipalViewAppendix4 from '../components/popUp/PrincipleViewAppendix4'
import { loadEffect } from '../components/Ultility'
import ViewDoc from '../components/popUp/ViewDoc'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function LessonPlans({ userLoginData, grades, appendixType, className }) {
    const [activeSubject, setActiveSubject] = useState(0)
    const [activeGrade, setActiveGrade] = useState(0)
    const [activeTeacher, setActiveTeacher] = useState(0)
    const [selectedSubject, setSeletedSubject] = useState('')
    const [selectedGrade, setSelectedGrade] = useState(grades[0])
    const [listTeachersWithSubject, setListTeachersWithSubject] = useState([])
    const [seletedTeacher, setSelectedTeacher] = useState()
    const [appendix3, setAppendix3] = useState(null)
    const [appendix3Url, setAppendix3Url] = useState('')
    const [lessons, setLessons] = useState([])
    const [lessonId, setLessonId] = useState([])
    const [showAppendix4, setShowAppendix4] = useState(false)
    const [isLoadLessons, setIsLoadLessons] = useState(true)
    const [isLoadTeachers, setIsLoadTeachers] = useState(true)
    const [isLoadSubjects, setIsLoadSubjects] = useState(true)
    const [showViewDoc, setShowViewDoc] = useState(false)

    const [subjects, setSubjects] = useState([])
    const [listObjectSubjects, setListObjectSubjects] = useState([])

    useEffect(() => {
        loadAllSubjects()
    }, [])

    useEffect(() => {
        setSelectedGrade(grades[0])
    }, [])

    const changeColorSubject = (index, subjectName) => {
        setSeletedSubject(subjectName)
        setActiveSubject(index)
    }
    const changeColorTeacher = (index, teacher) => {
        setSelectedTeacher(teacher)
        setActiveTeacher(index)
    }
    const changeColorGrade = (index, grade) => {
        setSelectedGrade(grade)
        setActiveGrade(index)
    }

    const loadAllSubjects = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Subject/GetAllSubjectsBySchoolId/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    const subjectList = [
                        ...new Set(
                            res.data.map((subject) => {
                                return subject.subjectName
                            })
                        ),
                    ]
                    setSubjects(subjectList)
                    setSeletedSubject(subjectList[0])
                    setListObjectSubjects(res.data)
                    setIsLoadSubjects(false)
                })
                .catch((err) => {
                    // console.error(err)
                    setSubjects([])
                    setIsLoadSubjects(false)
                })
        }
    }

    const findSubject = (subjectName, grade) => {
        return listObjectSubjects.find(
            (item) => item.subjectName === subjectName && item.grade === grade
        )
    }

    const closeAppendix4 = () => {
        setShowAppendix4(false)
    }

    const loadTeachersWithSubject = async () => {
        let subject = findSubject(selectedSubject, selectedGrade)
        // console.log(selectedSubject, selectedGrade)

        if (subject !== null && subject !== undefined) {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .get(url + 'api/TeachingInfor/GetListTeacherTeachingBySubject/' + subject.id, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        // console.log(res)
                        setListTeachersWithSubject(res.data)
                        setSelectedTeacher(res.data[0])
                        setActiveTeacher(0)
                        setIsLoadTeachers(false)
                    })
                    .catch((err) => {
                        // console.error(err)
                        setListTeachersWithSubject([])
                        setIsLoadTeachers(false)
                        setAppendix3(null)
                        setIsLoadLessons(false)
                    })
            } else {
                setListTeachersWithSubject([])
                setIsLoadTeachers(false)
                setAppendix3(null)
                setIsLoadLessons(false)
            }
        }
    }

    const loadAppendix3Url = async (id) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Plan/GetPlanFileUrl/' + id + '/3', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setAppendix3Url(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const loadAppendix3 = async () => {
        let subject = findSubject(selectedSubject, selectedGrade)
        // console.log(seletedTeacher, subject)

        if (
            seletedTeacher !== null &&
            seletedTeacher !== undefined &&
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
                        'api/Plan/GetSubjectPlanWithStatus/' +
                        seletedTeacher.id +
                        '/' +
                        subject.id +
                        '/1', {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    }
                    )
                    .then((res) => {
                        // console.log(res.data)
                        if (Object.keys(res.data).length > 0) {
                            setAppendix3(res.data)
                            loadAppendix3Url(res.data.id)
                            setIsLoadLessons(false)
                        } else {
                            setAppendix3(null)
                            setIsLoadLessons(false)
                        }
                    })
                    .catch((err) => {
                        // console.error(err)
                        setAppendix3(null)
                        setIsLoadLessons(false)
                    })
            }
        } else {
            setAppendix3(null)
            setIsLoadLessons(false)
        }
    }

    const loadLessonsOfSubject = async () => {
        let subject = findSubject(selectedSubject, selectedGrade)

        // console.log(subject, seletedTeacher)
        if (
            seletedTeacher !== null &&
            seletedTeacher !== undefined &&
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
                        'api/Lesson/PrincipalGetListLessonOfSubject/' +
                        subject.id +
                        '/' +
                        seletedTeacher.id, {
                            headers: {
                                'Authorization': `Bearer ${dataUserToken}`
                            }
                        }
                    )
                    .then((res) => {
                        // console.log(res)
                        setLessons(res.data)
                        setIsLoadLessons(false)
                    })
                    .catch((err) => {
                        // console.error(err)
                        setLessons([])
                        setIsLoadLessons(false)
                    })
            }
        } else {
            setLessons([])
            setIsLoadLessons(false)
        }
    }

    const openAppendix4 = (lessonId) => {
        setLessonId(lessonId)
        setShowAppendix4(true)
    }

    useEffect(() => {
        if (subjects.length > 0 && listObjectSubjects.length > 0) {
            loadTeachersWithSubject()
        }
    }, [selectedSubject, selectedGrade, listObjectSubjects])

    const closeViewDoc = () => {
        setShowViewDoc(false)
    }

    useEffect(() => {
        if (appendixType === 3) {
            if (selectedSubject !== undefined && seletedTeacher !== undefined) {
                loadAppendix3()
            } else {
                setAppendix3(null)
                setIsLoadLessons(false)
            }
        } else if (appendixType === 4) {
            if (selectedSubject !== undefined && seletedTeacher !== undefined) {
                loadLessonsOfSubject()
            } else {
                setLessons([])
                setIsLoadLessons(false)
            }
        }
    }, [selectedSubject, selectedGrade, seletedTeacher])

    return (
        <div id="lesson-plans-wrapper">
            <div className={`lesson-plan-title-container d-flex bg-white w-100 ${className}`}>
                <div className="column-title-1">
                    <p className="m-0 py-2 fw-bold text-center">Tên môn</p>
                </div>
                <div className="column-title-3">
                    <p className="m-0 py-2 fw-bold text-center">Khối</p>
                </div>
                <div className="column-title-2">
                    <p className="m-0 py-2 fw-bold text-center">Giáo viên</p>
                </div>
                <div className="column-title-4 d-flex">
                    <p className="m-0 p-2 fw-bold text-center flex-grow-1">
                        {appendixType === 3
                            ? 'Tên tài liệu'
                            : appendixType === 4
                                ? 'Tên bài học'
                                : ''}
                    </p>
                    <p className="m-0 p-2 fw-bold text-center"></p>
                </div>
            </div>
            <div className="lesson-plan-container d-flex bg-white w-100 mt-1 ">
                <div className="column-1 d-flex flex-column align-items-center">
                    {!isLoadSubjects ? (
                        subjects.length > 0 ? (
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
                        )
                    ) : (
                        <div
                            style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                            className="loading"
                        >
                            <div
                                style={{ left: '27%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
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
                    {!isLoadTeachers ? (
                        listTeachersWithSubject.length > 0 ? (
                            listTeachersWithSubject.map((item, index) => {
                                return (
                                    <p
                                        onClick={() => changeColorTeacher(index, item)}
                                        key={index}
                                        className={`fw-bold my-1 px-3 py-2 rounded-5 ${activeTeacher === index ? 'active-teacher' : ''
                                            }`}
                                    >
                                        {item.fullname}
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
                                style={{ left: '49.5%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    )}
                </div>
                <div className="column-4 d-flex">
                    <div className="fw-bold my-1 rounded-5 w-100">
                        {!isLoadLessons ? (
                            appendixType === 3 ? (
                                appendix3 !== null && Object.keys(appendix3).length > 0 ? (
                                    <div className="lesson-plan-item d-flex align-items-center px-3 py-2">
                                        <p className="lesson-plan-name flex-grow-1 px-3 m-0">
                                            {appendix3.name}
                                        </p>
                                        <div
                                            onClick={() => setShowViewDoc(true)}
                                            className="view-appendix3 px-2"
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
                            ) : appendixType === 4 ? (
                                lessons.length > 0 && listTeachersWithSubject.length > 0 ? (
                                    lessons.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={`${index % 2 === 0 ? 'even-row' : 'odd-row'
                                                    } lesson-plan-item d-flex align-items-center px-3 py-2`}
                                            >
                                                <p className="lesson-name flex-grow-1 px-3 m-0">
                                                    {item.lessonName}
                                                </p>
                                                <div
                                                    className="view-appendix4 px-2 float-end text-dark"
                                                    onClick={() => openAppendix4(item.id)}
                                                >
                                                    {item.lessonPlanLastUpdate !== null && (
                                                        <Icon
                                                            icon="mdi:folder-eye-outline"
                                                            style={{ fontSize: '18px' }}
                                                        />
                                                    )}
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
                                ''
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
            {showAppendix4 && (
                <PrincipalViewAppendix4
                    lessonId={lessonId}
                    teacherId={seletedTeacher.id}
                    closePopUp={closeAppendix4}
                />
            )}
            {showViewDoc && (
                <ViewDoc
                    getDataFromChild={closeViewDoc}
                    urlDoc={appendix3Url}
                    nameLessonPlan={appendix3.name}
                />
            )}
        </div>
    )
}

export default LessonPlans
