import React, { useState, useEffect, useRef } from 'react'
import SelectDropdown from '../SelectDropdown'
import MultipleSelect from '../MultipleSelect'
import axios from 'axios'
import { url } from '../../../Config/config'
import Success from './Success'
import ErrorPopUp from './ErrorPopUp'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function ModifyDepartment({ userLoginData, department, loadNewDepartments, closePopUp }) {
    const [teachers, setTeachers] = useState([])
    const [subjects, setSubjects] = useState([])
    const [headOfDepartment, setHeadOfDepartment] = useState(null)
    const [headOfDepartmentSelect, setHeadOfDepartmentSelect] = useState('')
    const [subjectsOfDepartment, setSubjectsOfDepartment] = useState(
        department === null
            ? []
            : [
                ...new Set(
                    department.subjects.map((subject) => {
                        return subject.subjectName
                    })
                ),
            ]
    )
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const departmentNameRef = useRef(null)

    useEffect(() => {
        if (department) {
            const subjectTemp = [
                ...new Set(
                    department.subjects.map((subject) => {
                        return subject.subjectName
                    })
                ),
            ]
            setHeadOfDepartment(department.headOfDepartment)
            setHeadOfDepartmentSelect(department.headOfDepartment.id)
            setSubjectsOfDepartment(subjectTemp)
        }
    }, [department])

    const addDepartment = async () => {
        let departmentName = document.getElementById('department').value

        if (headOfDepartment !== null) {
            let department = {
                departmentName: departmentName,
                schoolId: userLoginData.schoolId,
                headOfDepartmentId: headOfDepartment.id,
                subjectNames: subjectsOfDepartment.map((item) => {
                    return item
                }),
            }

            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token

                await axios
                    .post(url + 'api/Department/CreateDepartment', department, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        loadNewDepartments()
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
                        // console.error(err.response.data)
                        setErrorMessage(err.response.data)
                        setShowError(true)
                    })
            }
        } else {
            setErrorMessage('Bạn chưa chọn tổ trưởng')
            setShowError(true)
        }
    }

    const updateDepartment = async () => {
        let departmentUpdate = {
            id: department.id,
            departmentName: departmentNameRef.current.value,
            schoolId: userLoginData.schoolId,
            headOfDepartmentId: headOfDepartmentSelect,
            subjectNames: subjectsOfDepartment,
        }
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .put(url + 'api/Department/UpdateDepartment/' + department.id, departmentUpdate, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewDepartments()
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

    const modifyDepartment = (event) => {
        event.preventDefault()
        if (department === null) {
            addDepartment()
        } else {
            updateDepartment()
        }
    }

    const getHeadOfDepartment = (data) => {
        setHeadOfDepartmentSelect(data.id)
        setHeadOfDepartment(data)
    }

    const getSubjectsOfDepartment = (data) => {
        setSubjectsOfDepartment(data)
    }

    const loadAllTeachers = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/User/GetTeachersOfSchoolToSelect/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setTeachers(res.data)
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
                .get(url + 'api/Subject/GetAllSubjectsBySchoolId/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    let listSubject = [
                        ...new Set(
                            res.data.map((item) => {
                                return item.subjectName
                            })
                        ),
                    ].map((item, index) => {
                        return {
                            id: index,
                            subjectName: item,
                            value: false,
                        }
                    })
                    setSubjects(listSubject)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleCloseError = () => {
        setShowError(false)
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'modify-department-wrapper') {
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

    useEffect(() => {
        loadAllTeachers()
        loadAllSubjects()
    }, [])

    return (
        <div id="modify-department-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up p-5 bg-white">
                <p className="create-title text-center elp-text-title">
                    {department === null ? 'Thêm tổ mới' : 'Chỉnh sửa thông tin tổ'}
                </p>
                <div>
                    <form onSubmit={modifyDepartment}>
                        <div className="mb-3 d-flex">
                            <label
                                htmlFor="department"
                                className="form-label mb-0 align-self-center"
                            >
                                Tên tổ
                            </label>
                            <input
                                type="text"
                                className="form-control ms-5 rounded-5"
                                id="department"
                                placeholder="Tên tổ"
                                defaultValue={department === null ? '' : department.departmentName}
                                ref={departmentNameRef}
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label className="form-label mb-0 align-self-center">Tổ trưởng</label>
                            <SelectDropdown
                                label={'Chọn tổ trưởng'}
                                getDataFromChild={getHeadOfDepartment}
                                optionList={teachers}
                                className={'border w-100 ms-5 rounded-5'}
                                dataUpdate={
                                    { 'id': headOfDepartmentSelect }
                                }
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <label className="form-label mb-0 align-self-center">Các môn học</label>
                            <MultipleSelect
                                label={'Chọn môn học'}
                                getDataFromChild={getSubjectsOfDepartment}
                                optionList={subjects}
                                className={'ms-5 w-100 border rounded-5 subject-select'}
                                selectedItem={subjectsOfDepartment}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn elp-bg-primary text-white rounded-5 px-3 float-end mx-2"
                        >
                            {department === null ? 'Tạo' : 'Lưu'}
                        </button>
                        <button
                            onClick={handleCloseButton}
                            type="button"
                            className="btn btn-secondary text-white rounded-5 px-3 float-end mx-2"
                        >
                            Hủy
                        </button>
                    </form>
                </div>
                {showSuccess && (
                    <Success
                        message={
                            department === null
                                ? 'Thêm tổ thành công'
                                : 'Chỉnh sửa thông tin tổ thành công'
                        }
                    />
                )}
                {showError && <ErrorPopUp errorMsg={errorMessage} handleClose={handleCloseError} />}
            </div>
        </div>
    )
}

export default ModifyDepartment
