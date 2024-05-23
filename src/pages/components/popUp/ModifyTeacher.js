import React, { useState, useRef, useEffect } from 'react'
import Success from './Success'
import SelectDropdown from '../SelectDropdown'
import MultipleSelect from '../MultipleSelect'
import '../../../sass/main.scss'
import axios from 'axios'
import { url } from '../../../Config/config'
import ErrorPopup from './ErrorPopUp'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function ModifyTeacher({ userLoginData, teacher, loadNewTeachers, closePopUp }) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [gender, setGender] = useState(
        teacher === null
            ? {
                id: 1,
                gender: 'Nam',
                value: true,
            }
            : teacher.gender
                ? {
                    id: 1,
                    gender: 'Nam',
                    value: true,
                }
                : {
                    id: 2,
                    gender: 'Nữ',
                    value: false,
                }
    )
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = () => {
        setShowError(false)
    }

    const getObjectAcademicLevel = (academicLevel) => {
        let id = 0
        if (academicLevel !== null && academicLevel !== undefined) {
            if (academicLevel.toLowerCase() === 'cao đẳng') id = 1
            else if (academicLevel.toLowerCase() === 'đại học') id = 2
            else if (academicLevel.toLowerCase() === 'thạc sĩ') id = 3
            else if (academicLevel.toLowerCase() === 'tiến sĩ') id = 4
            return {
                id: id,
                academicLevel: academicLevel,
            }
        } else {
            return {
                id: 0,
                academicLevel: '',
            }
        }
    }
    const [academicLevel, setAcademicLevel] = useState(
        teacher === null
            ? getObjectAcademicLevel('Cao đẳng')
            : getObjectAcademicLevel(teacher.academicLevel)
    )
    const [subjectsSelected, setSubjectsSelected] = useState(
        teacher === null
            ? []
            : teacher.subjects.map((item) => {
                return item.subjectName + ' (' + item.grade + ')'
            })
    )
    const [subjects, setSubjects] = useState([])
    const [academicLevels, setAcademicLevels] = useState([])
    const genders = [
        { id: 1, gender: 'Nam', value: true },
        { id: 2, gender: 'Nữ', value: false },
    ]
    const currentDate = new Date()
    const maxDate = new Date(currentDate)
    maxDate.setDate(currentDate.getDate() - 1)
    const dateValidation =
        maxDate.getFullYear() -
        18 +
        '-' +
        String(maxDate.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(maxDate.getDate()).padStart(2, '0')

    const teacherNameRef = useRef('')
    const dobRef = useRef('')
    const emailRef = useRef('')
    const phoneRef = useRef('')
    const addressRef = useRef('')

    const getGender = (data) => {
        setGender(data)
    }

    const getAcademicLevel = (data) => {
        setAcademicLevel(data)
    }

    const getSubjects = (data) => {
        setSubjectsSelected(data)
    }

    const addTeacher = async () => {
        let subjectsObject = subjectsSelected.map((item, index) => {
            let splitIndex = item.lastIndexOf(' ')
            return {
                id: index,
                subjectName: item.substring(0, splitIndex),
                grade: item.substring(splitIndex + 1).replace(/\D/g, ''),
            }
        })

        let teacherAdd = {
            fullname: document.getElementById('teacherName').value,
            dob: document.getElementById('dob').value,
            gender: gender.value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phone').value,
            address: document.getElementById('teacherAddress').value,
            academicLevel: academicLevel.academicLevel,
            subjects: subjectsObject,
        }

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .post(url + 'api/User/AddTeacherWithSubject/' + userLoginData.schoolId, teacherAdd, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewTeachers()
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

    const updateTeacher = async () => {
        let subjectsObject = subjectsSelected.map((item, index) => {
            let splitIndex = item.lastIndexOf(' ')
            return {
                id: index,
                subjectName: item.substring(0, splitIndex),
                grade: item.substring(splitIndex + 1).replace(/\D/g, ''),
            }
        })

        let teacherUpdate = {
            id: teacher.id,
            fullname: teacherNameRef.current.value,
            dob: dobRef.current.value,
            gender: gender.value,
            email: emailRef.current.value,
            phoneNumber: phoneRef.current.value,
            address: addressRef.current.value,
            academicLevel: academicLevel.academicLevel,
            subjects: subjectsObject,
        }

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .put(url + 'api/User/UpdateTeacher/' + userLoginData.schoolId, teacherUpdate, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewTeachers()
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

    const modifyTeacher = (event) => {
        event.preventDefault()
        if (teacher === null) {
            addTeacher()
        } else {
            updateTeacher()
        }
    }

    const loadAcademicLevels = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/User/GetAcacdemicLevel', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setAcademicLevels(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const loadAllSubjects = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Subject/GetSubjectsOfSchoolToSelect/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    let listSubject = res.data.map((item) => {
                        return {
                            id: item.id,
                            subjectName: item.subjectName + ' (' + item.grade + ')',
                            value: false,
                            grade: item.grade,
                        }
                    })
                    setSubjects(listSubject)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadAcademicLevels()
        loadAllSubjects()
    }, [])

    useEffect(() => {
        if (teacher !== null) {
            document.getElementById('email').setAttribute('readOnly', true)
        }
    }, [])

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'modify-teacher-wrapper') {
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

    return (
        <div id="modify-teacher-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white p-5 pb-3">
                <p className="create-title text-center elp-text-title">
                    {teacher === null ? 'Thêm giáo viên mới' : 'Chỉnh sửa thông tin giáo viên'}
                </p>
                <div>
                    <form onSubmit={modifyTeacher}>
                        <div className="mb-3 d-flex">
                            <label
                                htmlFor="teacherName"
                                className="form-label mb-0 align-self-center"
                            >
                                Tên giáo viên
                            </label>
                            <input
                                type="text"
                                className="form-control ms-5 rounded-5"
                                id="teacherName"
                                placeholder="Tên giáo viên"
                                ref={teacherNameRef}
                                defaultValue={teacher === null ? '' : teacher.fullname}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label htmlFor="dob" className="form-label mb-0 align-self-center">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                className="form-control ms-5 rounded-5"
                                id="dob"
                                ref={dobRef}
                                defaultValue={teacher === null ? '' : teacher.dob}
                                max={dateValidation}
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label className="form-label mb-0 align-self-center">Giới tính</label>
                            <SelectDropdown
                                label={'Chọn giới tính'}
                                getDataFromChild={getGender}
                                optionList={genders}
                                className={'border w-100 ms-5 rounded-5'}
                                dataUpdate={gender}
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label htmlFor="email" className="form-label mb-0 align-self-center">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control ms-5 rounded-5"
                                id="email"
                                placeholder="Email"
                                ref={emailRef}
                                defaultValue={teacher === null ? '' : teacher.email}
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label htmlFor="phone" className="form-label mb-0 align-self-center">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                className="form-control ms-5 rounded-5"
                                id="phone"
                                placeholder="Số điện thoại"
                                ref={phoneRef}
                                defaultValue={teacher === null ? '' : teacher.phoneNumber}
                                pattern="0\d{9}"
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label
                                htmlFor="teacherAddress"
                                className="form-label mb-0 align-self-center"
                            >
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                className="form-control ms-5 rounded-5"
                                id="teacherAddress"
                                placeholder="Địa chỉ"
                                ref={addressRef}
                                defaultValue={teacher === null ? '' : teacher.address}
                                required
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label className="form-label mb-0 align-self-center">Trình độ</label>
                            <SelectDropdown
                                label={'Chọn trình độ học vấn'}
                                getDataFromChild={getAcademicLevel}
                                optionList={academicLevels}
                                className={'border w-100 ms-5 rounded-5'}
                                dataUpdate={academicLevel}
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label className="form-label mb-0 align-self-center">Dạy môn</label>
                            <MultipleSelect
                                label={'Chọn môn học'}
                                getDataFromChild={getSubjects}
                                optionList={subjects}
                                className={'ms-5 w-100 border rounded-5 subject-select'}
                                selectedItem={subjectsSelected}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn elp-bg-primary text-white rounded-5 px-3 float-end mx-2 mt-5"
                        >
                            {teacher === null ? 'Tạo' : 'Lưu'}
                        </button>
                        <button
                            onClick={handleCloseButton}
                            type="button"
                            className="btn btn-secondary text-white rounded-5 px-3 float-end mx-2 mt-5"
                        >
                            Hủy
                        </button>
                    </form>
                </div>
            </div>
            {showSuccess && (
                <Success
                    message={
                        teacher === null
                            ? 'Thêm giáo viên thành công'
                            : 'Chỉnh sửa thông tin thành công'
                    }
                />
            )}
            {showError && <ErrorPopup errorMsg={errorMessage} handleClose={handleCloseError} />}
        </div>
    )
}

export default ModifyTeacher
