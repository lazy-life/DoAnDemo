import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { url } from '../../Config/config'

import '../../sass/main.scss'
import ModifyLesson from '../components/popUp/ModifyLesson'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function Syllabus({ userLoginData, getDeleteObject }) {
    const grades =
        userLoginData.schoolLevel === 2
            ? [6, 7, 8, 9]
            : userLoginData.schoolLevel === 3
                ? [10, 11, 12]
                : []

    const [subjectsOfDepartment, setSubjectsOfDepartment] = useState([])
    const [activeGrade, setActiveGrade] = useState(0)
    const [selectedGrade, setSelectedGrade] = useState(grades[0])
    const [activeSubject, setActiveSubject] = useState(0)
    const [selectedSubject, setSelectedSubject] = useState()
    const [lessons, setLessons] = useState([])
    const [showModify, setShowModify] = useState(false)
    const [lesson, setLesson] = useState(null)
    const [lessonIndex, setLessonIndex] = useState(0)
    const [selectedSubjectId, setSelectedSubjectId] = useState(0)
    const [editable, setEditable] = useState(true)
    const [totalNumberOfSessions, setTotalNumberOfSessions] = useState(0)
    const [currentNumberOfSessions, setCurrentNumberOfSessions] = useState(0)

    const changeColorGrade = (index, grade) => {
        setSelectedGrade(grade)
        setActiveGrade(index)
    }

    const changeColorSubject = (index, subjectName) => {
        setSelectedSubject(subjectName)
        setActiveSubject(index)
    }

    const loadSubjectsOfDepartment = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetSubjectsOfDepartmentByHodId/' + userLoginData.userId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setSubjectsOfDepartment(res.data)
                    setSelectedSubject(res.data[0].subjectName)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const findSubjectId = (subjectName, grade) => {
        let subject = null
        let id = 0
        subject = subjectsOfDepartment.find((item) => item.subjectName === subjectName)
        subject.grades.forEach((item) => {
            if (item.grade === grade) {
                id = item.subjectId
            }
        })
        return id
    }

    const loadLessonsOfSubject = async () => {
        let subjectId = findSubjectId(selectedSubject, selectedGrade)
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
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const loadCurrentNumberOfSessions = async () => {
        let subjectId = findSubjectId(selectedSubject, selectedGrade)

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetSubjectsOfDepartmentByHodId/' + userLoginData.userId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    res.data.forEach((subject) => {
                        subject.grades.forEach((item) => {
                            if (item.subjectId === subjectId) {
                                setTotalNumberOfSessions(item.totalNumberOfSession)
                            }
                        })
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadSubjectsOfDepartment()
    }, [])

    useEffect(() => {
        if (
            selectedSubject !== null &&
            selectedSubject !== undefined &&
            selectedGrade !== null &&
            selectedGrade !== undefined
        ) {
            loadLessonsOfSubject()
            loadCurrentNumberOfSessions()
        }
    }, [selectedSubject, selectedGrade])

    const handleShowModify = (lesson, lessonIndex, editable) => {
        setLesson(lesson)
        setLessonIndex(lessonIndex + 1)
        setSelectedSubjectId(findSubjectId(selectedSubject, selectedGrade))
        setEditable(editable)
        setShowModify(true)
    }

    const handleDeleteAction = (lesson) => {
        let messageDelete = {
            idObject: lesson.id,
            title: 'Xóa bài học',
            content: 'Bạn có chắc chắn muốn xóa bài "' + lesson.lessonName + '" không?',
            path: 'api/Lesson/DeleteLesson/' + lesson.id,
            loadNewObjects: () => {
                loadLessonsOfSubject()
            },
        }
        getDeleteObject(messageDelete)
    }

    const closeModify = () => {
        setShowModify(false)
    }

    return (
        <div id="syllabus-wrapper" className="px-3">
            <div className="syllabus-container">
                <div className="syllabus-title d-flex w-100 bg-white">
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
                    <div className="column-1 d-flex flex-column align-items-center">
                        {subjectsOfDepartment.map((item, index) => {
                            return (
                                <p
                                    onClick={() => changeColorSubject(index, item.subjectName)}
                                    key={index}
                                    className={`fw-bold my-1 px-3 py-2 rounded-5 w-50 ${activeSubject === index ? 'active-subject' : ''
                                        }`}
                                >
                                    {item.subjectName}
                                </p>
                            )
                        })}
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
                        <div className="content-container h-100 d-flex flex-column align-items-center">
                            {lessons.length > 0 ? (
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
                                                <div
                                                    className="icon px-2"
                                                    onClick={() =>
                                                        handleShowModify(item, index, true)
                                                    }
                                                >
                                                    <Icon icon="iconamoon:edit-light" />
                                                </div>
                                                <div
                                                    className="icon px-2"
                                                    onClick={() => handleDeleteAction(item)}
                                                >
                                                    <Icon icon="fluent:delete-24-regular" />
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
                        <div className="add-lesson-container d-flex py-3 justify-content-center">
                            <button
                                className="btn elp-bg-primary text-white rounded-5 w-75"
                                onClick={() => handleShowModify(null, lessons.length, true)}
                            >
                                Thêm bài học
                            </button>
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

export default Syllabus
