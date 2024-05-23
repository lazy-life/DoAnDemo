import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import axios from 'axios'
import { url } from '../../Config/config'
import ModifyLesson from '../components/popUp/ModifyLesson'
import { loadEffect } from '../components/Ultility'

import '../../sass/main.scss'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function PrincipalViewSyllabus({ userLoginData }) {
    const grades =
        userLoginData.schoolLevel === 2
            ? [6, 7, 8, 9]
            : userLoginData.schoolLevel === 3
                ? [10, 11, 12]
                : []
    const [departments, setDepartments] = useState([])
    const [subjectsOfDepartment, setSubjectsOfDepartment] = useState([])
    const [subjects, setSubjects] = useState([])

    const [activeDepartment, setActiveDepartment] = useState(0)
    const [selectedDepartment, setSelectedDepartment] = useState()
    const [activeSubject, setActiveSubject] = useState(0)
    const [selectedSubject, setSelectedSubject] = useState()
    const [activeGrade, setActiveGrade] = useState(0)
    const [selectedGrade, setSelectedGrade] = useState(grades[0])
    const [lessons, setLessons] = useState([])
    const [showModify, setShowModify] = useState(false)
    const [lesson, setLesson] = useState(null)
    const [lessonIndex, setLessonIndex] = useState(0)
    const [selectedSubjectId, setSelectedSubjectId] = useState(0)
    const [editable, setEditable] = useState(true)
    const [totalNumberOfSessions, setTotalNumberOfSessions] = useState(0)
    const [currentNumberOfSessions, setCurrentNumberOfSessions] = useState(0)

    const [isLoadDepartments, setIsLoadDepartments] = useState(true)
    const [isLoadLessons, setIsLoadLessons] = useState(true)

    const changeColorDepartment = (index, department) => {
        setSelectedDepartment(department)
        setActiveDepartment(index)
        let arraySubject = [
            ...new Set(
                department.subjects.map((subject) => {
                    return subject.subjectName
                })
            ),
        ]
        setSubjectsOfDepartment(department.subjects)
        setTotalNumberOfSessions(department.subjects[0].totalNumberOfSession)
        setSubjects(arraySubject)
        setSelectedSubject(arraySubject[0])
        setActiveSubject(0)
        setSelectedGrade(grades[0])
        setActiveGrade(0)
    }

    const changeColorSubject = (index, subjectName) => {
        setSelectedSubject(subjectName)
        setActiveSubject(index)
    }

    const changeColorGrade = (index, grade) => {
        setSelectedGrade(grade)
        setActiveGrade(index)
    }

    const handleShowModify = (lesson, lessonIndex, editable) => {
        setLesson(lesson)
        setLessonIndex(lessonIndex + 1)
        setSelectedSubjectId(findSubject(selectedSubject, selectedGrade).id)
        setEditable(editable)
        setShowModify(true)
    }

    const loadDepartments = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetListDepartmentBySchoolId/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    setDepartments(res.data)
                    let arraySubject = [
                        ...new Set(
                            res.data[0].subjects.map((subject) => {
                                return subject.subjectName
                            })
                        ),
                    ]
                    setSelectedDepartment(res.data[0])
                    setSubjectsOfDepartment(res.data[0].subjects)
                    setTotalNumberOfSessions(res.data[0].subjects[0].totalNumberOfSession)
                    setSubjects(arraySubject)
                    setSelectedSubject(arraySubject[0])
                    setIsLoadDepartments(false)
                })
                .catch((err) => {
                    // console.error(err)
                    setDepartments([])
                    setIsLoadDepartments(false)
                })
        }
    }

    useEffect(() => {
        loadDepartments()
    }, [])

    const findSubject = (subjectName, grade) => {
        let subject = subjectsOfDepartment.find(
            (item) => item.subjectName === subjectName && item.grade === grade
        )
        return subject
    }

    const loadLessonsOfSubject = async () => {
        let subject = findSubject(selectedSubject, selectedGrade)
        let subjectId = 0
        if (subject !== null && subject !== undefined) {
            subjectId = subject.id
            setTotalNumberOfSessions(subject.totalNumberOfSession)
        }
        let currentSessions = 0

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Lesson/GetListLessonOfSubject/' + subjectId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setLessons(res.data)
                    res.data.forEach((item) => {
                        currentSessions += item.numberOfSession
                    })
                    setCurrentNumberOfSessions(currentSessions)
                    setIsLoadLessons(false)
                })
                .catch((err) => {
                    // console.error(err)
                    setLessons([])
                    setIsLoadLessons(false)
                })
        }
    }

    useEffect(() => {
        if (
            selectedSubject !== undefined &&
            selectedGrade !== undefined &&
            subjectsOfDepartment.length > 0
        ) {
            loadLessonsOfSubject()
        }
        setIsLoadLessons(false)
    }, [selectedDepartment, selectedSubject, selectedGrade])

    const closeModify = () => {
        setShowModify(false)
    }

    return (
        <div id="principal-view-syllabus-wrapper">
            <div className="syllabus-container">
                <div className="syllabus-title d-flex w-100 bg-white">
                    <div className="column-title-4">
                        <p className="m-0 py-2 fw-bold text-center">Tên tổ</p>
                    </div>
                    <div className="column-title-1">
                        <p className="m-0 py-2 fw-bold text-center">Tên môn học</p>
                    </div>
                    <div className="column-title-2">
                        <p className="m-0 py-2 fw-bold text-center">Khối</p>
                    </div>
                    <div className="column-title-3 d-flex">
                        <div>
                            <p className="m-0 py-2 fw-bold text-center">
                                Khung chương trình môn{' '}
                                {`(${currentNumberOfSessions}/${totalNumberOfSessions})`}
                            </p>
                        </div>
                        <div>
                            <p className="m-0 py-2 fw-bold text-center">
                                Số lượng tiết
                            </p>
                        </div>
                        <div>
                            <p className="m-0 py-2 fw-bold text-center"></p>
                        </div>
                    </div>
                </div>
                <div className="syllabus d-flex bg-white w-100 mt-1">
                    <div className="column-4 d-flex flex-column align-items-center">
                        {!isLoadDepartments ? (
                            departments.length > 0 ? (
                                departments.map((item, index) => {
                                    return (
                                        <p
                                            onClick={() => changeColorDepartment(index, item)}
                                            key={index}
                                            className={`fw-bold my-1 px-3 py-2 rounded-5 w-50 ${activeDepartment === index
                                                ? 'active-departments'
                                                : ''
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
                                    style={{ left: '27%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="column-1 d-flex flex-column align-items-center">
                        {subjects.length > 0 ? (
                            subjects.map((item, index) => {
                                return (
                                    <p
                                        onClick={() => changeColorSubject(index, item)}
                                        key={index}
                                        className={`fw-bold my-1 px-3 py-2 rounded-5 w-50 ${activeSubject === index ? 'active-subject' : ''
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
                    <div className="column-2 d-flex flex-column align-items-center">
                        {grades.length > 0 &&
                            grades.map((item, index) => {
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
                    <div className="column-3 d-flex flex-column">
                        <div className="h-100 d-flex flex-column align-items-center">
                            {!isLoadLessons ? (
                                lessons.length > 0 ? (
                                    lessons.map((item, index) => {
                                        return (
                                            <div className="lessons-container d-flex fw-bold w-100">
                                                <div className="lesson-col-1 py-2 border-end border-3">
                                                    <p className="m-0 text-center">{index + 1}</p>
                                                </div>
                                                <div className="lesson-col-2 py-2 border-end border-3">
                                                    <p className="m-0 px-3 text-start">
                                                        {item.lessonName}
                                                    </p>
                                                </div>
                                                <div className="lesson-col-3 py-2 border-end border-3">
                                                    <p className="m-0 text-center">
                                                        {item.numberOfSession} tiết
                                                    </p>
                                                </div>
                                                <div className="lesson-col-4 py-2 d-flex justify-content-around align-items-center w-50">
                                                    <div
                                                        className="icon px-2"
                                                        onClick={() =>
                                                            handleShowModify(item, index, false)
                                                        }
                                                    >
                                                        <Icon icon="ph:eye" />
                                                    </div>
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
                                        style={{ left: '74%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            )}
                            {lessons.length > 0 && (
                                <div className="lessons-no-content-container d-flex fw-bold w-100 flex-grow-1">
                                    <div className="no-content-1 border-end border-3"></div>
                                    <div className="no-content-2 border-end border-3"></div>
                                    <div className="no-content-3 border-end border-3"></div>
                                    <div className="no-content-4"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModify && (
                <ModifyLesson
                    lesson={lesson}
                    lessonIndex={lessonIndex}
                    subjectId={selectedSubjectId}
                    loadNewLessons={loadLessonsOfSubject}
                    editable={editable}
                    closePopUp={closeModify}
                />
            )}
        </div>
    )
}

export default PrincipalViewSyllabus
