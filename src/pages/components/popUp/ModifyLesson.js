import React, { useEffect, useRef, useState } from 'react'
import Success from './Success'
import axios from 'axios'
import { url } from '../../../Config/config'
import ErrorPopup from './ErrorPopUp'

import '../../../sass/main.scss'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function ModifyLesson({ lesson, lessonIndex, subjectId, loadNewLessons, editable, closePopUp }) {
    const [subject, setSubject] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const lessonNameRef = useRef(null)
    const numberOfSessionRef = useRef(null)
    const descriptionRef = useRef(null)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = () => {
        setShowError(false)
    }

    const loadSubject = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Subject/GetSubjectById/' + subjectId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setSubject(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadSubject()
        if (!editable) {
            document.getElementById('lessonName').setAttribute('readOnly', true)
            document.getElementById('numberOfSession').setAttribute('readOnly', true)
            document.getElementById('description').setAttribute('readOnly', true)
        }
    }, [])

    const addLesson = async () => {
        let lessonAdd = {
            lessonName: document.getElementById('lessonName').value,
            description: document.getElementById('description').value,
            numberOfSession: document.getElementById('numberOfSession').value,
            subjectId: subjectId,
        }

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .post(url + 'api/Lesson/AddLessonToSubject', lessonAdd, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewLessons()
                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        closePopUp()
                    }, 2300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((err) => {
                    // console.error(err)
                    setErrorMessage(err.response.data)
                    setShowError(true)
                })
        }
    }

    const updateLesson = async () => {
        let lessonUpdate = {
            id: lesson.id,
            lessonName: lessonNameRef.current.value,
            description: descriptionRef.current.value,
            numberOfSession: numberOfSessionRef.current.value,
            subjectId: subjectId,
        }


        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .put(url + 'api/Lesson/UpdateLesson', lessonUpdate, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewLessons()
                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        closePopUp()
                    }, 2300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((err) => {
                    // console.error(err)
                    setErrorMessage(err.response.data)
                    setShowError(true)
                })
        }
    }

    const modifyLesson = (event) => {
        event.preventDefault()
        if (lesson === null) {
            addLesson()
        } else {
            updateLesson()
        }
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'modify-lesson-wrapper') {
            closePopUp()
        }
    }

    const handleCloseButton = () => {
        closePopUp()
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

    return (
        <div id="modify-lesson-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white">
                <div className="pop-up-title px-3 py-2 border-bottom">
                    <p className="m-0 fw-bold elp-text-title fs-5 text-center">
                        {lesson === null
                            ? 'Tạo mới khung chương trình'
                            : 'Cập nhật khung chương trình'}
                    </p>
                </div>
                <form onSubmit={modifyLesson}>
                    <div className="pop-up-body p-3 border-bottom">
                        <div className="subject-name d-flex justify-content-between px-4 fw-bold rounded-5 mb-3">
                            <p className="m-0 py-2">Tên môn: {subject && subject.subjectName}</p>
                            <p className="m-0 py-2">Khối: {subject && subject.grade}</p>
                            <p className="m-0 py-2">Bài số: {lessonIndex}</p>
                        </div>
                        <div className="d-flex mb-3">
                            <div className="w-75 pe-3">
                                <label htmlFor="lessonName" className="form-label mb-2 fw-bold">
                                    Tên bài học
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded-5"
                                    id="lessonName"
                                    placeholder="Tên bài học"
                                    ref={lessonNameRef}
                                    defaultValue={lesson !== null ? lesson.lessonName : ''}
                                    required
                                />
                            </div>
                            <div className="w-25 ps-3">
                                <label
                                    htmlFor="numberOfSession"
                                    className="form-label mb-2 fw-bold"
                                >
                                    Số tiết học
                                </label>
                                <input
                                    type="number"
                                    className="form-control rounded-5"
                                    id="numberOfSession"
                                    placeholder="Số tiết học"
                                    min={1}
                                    ref={numberOfSessionRef}
                                    defaultValue={lesson !== null ? lesson.numberOfSession : ''}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label mb-2 fw-bold">
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                className="form-control rounded-4"
                                rows={5}
                                placeholder="Nhập mô tả cho bài học"
                                ref={descriptionRef}
                                defaultValue={lesson !== null ? lesson.description : ''}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="pop-up-footer p-3 d-flex">
                        {editable ? (
                            <div className="w-100">
                                <button
                                    type="submit"
                                    className="btn elp-bg-primary text-white rounded-5 px-4 mx-2 float-end"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary rounded-5 px-4 mx-2 float-end"
                                    onClick={handleCloseButton}
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <div className="w-100">
                                <button
                                    type="button"
                                    className="btn elp-bg-primary text-white rounded-5 px-4 mx-2 float-end"
                                    onClick={handleCloseButton}
                                >
                                    Xong
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
            {showSuccess && (
                <Success
                    message={
                        lesson === null ? 'Thêm bài học thành công' : 'Chỉnh sửa bài học thành công'
                    }
                />
            )}
            {showError && <ErrorPopup errorMsg={errorMessage} handleClose={handleCloseError} />}
        </div>
    )
}

export default ModifyLesson
