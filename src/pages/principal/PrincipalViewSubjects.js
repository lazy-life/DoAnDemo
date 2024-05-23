import React, { useEffect, useState } from 'react'
import MultipleSelect from '../components/MultipleSelect'
import '../../sass/main.scss'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { url } from '../../Config/config'
import Success from '../components/popUp/Success'
import { loadEffect } from '../components/Ultility'
import ErrorPopup from '../components/popUp/ErrorPopUp'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function PrincipalViewSubjects({ userLoginData, getDeleteObject }) {
    const [selectedSubjects, setSelectedSubjects] = useState([])
    const [schoolSubjects, setSchoolSubjects] = useState([])
    const [overallSubjects, setOverallSubjects] = useState([])
    const [showSuccess, setShowSuccess] = useState(false)
    const [resetSelectedItem, setResetSelectedItem] = useState([])
    const [isLoadSubjects, setIsLoadSubjects] = useState(true)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = () => {
        setShowError(false)
    }

    const loadSubjectsNotInSchool = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Subject/GetSubjectsNotInSchool/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setOverallSubjects(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }
    const allSubjects = [
        ...new Set(
            overallSubjects.map((item) => {
                return item.subjectName
            })
        ),
    ]

    const subjectOptionsList = allSubjects.map((item, index) => {
        return {
            id: index,
            subjectName: item,
            value: false,
        }
    })

    const handleDeleteAction = (subject) => {
        let messageDelete = {
            idObject: subject.id,
            title: 'Xóa môn học',
            content:
                'Bạn có chắc chắn muốn xóa môn ' +
                subject.subjectName +
                ' (' +
                subject.grade +
                ') không?',
            path: 'api/Subject/DeleteSubject/' + subject.id,
            loadNewObjects: () => {
                loadSchoolSubjects()
                loadSubjectsNotInSchool()
            },
        }
        getDeleteObject(messageDelete)
    }

    const loadSchoolSubjects = async () => {
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
                    // console.log(res)
                    setSchoolSubjects(res.data)
                    setIsLoadSubjects(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadSubjectsNotInSchool()
        loadSchoolSubjects()
    }, [])

    const getSubjects = (data) => {
        setSelectedSubjects(data)
    }

    const addSubjects = async (event) => {
        event.preventDefault()

        if (selectedSubjects.length > 0) {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .post(
                        url + 'api/Subject/AddListSubject/' + userLoginData.schoolId,
                        selectedSubjects,
                        {
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${dataUserToken}`
                            }
                        }
                    )
                    .then((res) => {
                        // console.log(res)
                        loadSchoolSubjects()
                        loadSubjectsNotInSchool()
                        setResetSelectedItem([])
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
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
        } else {
            setErrorMessage('Danh sách môn trống!')
            setShowError(true)
        }
    }

    return (
        <div id="principal-view-subjects-wrapper" className="row w-100">
            <div id="view-subject-container" className="p-3 h-100 col-lg-7">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="view-subject-title">
                        <div className="bg-white border-bottom fw-bold p-2 px-5 ">
                            <i className="fa-solid fa-check"></i>
                            Môn học
                        </div>
                    </div>
                </div>
                <div className="table-container bg-white shadow">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>Số thứ tự</th>
                                <th>Tên môn</th>
                                <th>Khối</th>
                                <th>Tổng số tiết</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoadSubjects ? (
                                schoolSubjects.length > 0 &&
                                schoolSubjects.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{item.subjectName}</td>
                                            <td>{item.grade}</td>
                                            <td>{item.totalNumberOfSession}</td>
                                            <td>
                                                <div
                                                    className="icon"
                                                    onClick={() => handleDeleteAction(item)}
                                                >
                                                    <Icon icon="fluent:delete-24-regular" />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <div
                                    style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                                    className="loading"
                                >
                                    <div
                                        style={{ left: '40%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="add-subject-wrapper" className="col-lg-5">
                <div className="p-3 pt-3 shadow bg-white add-subject-container">
                    <p className="create-title text-center elp-text-title fw-bold mb-4">
                        Thêm môn học mới
                    </p>
                    <div>
                        <form onSubmit={addSubjects}>
                            <div className="mb-3 d-flex">
                                <label className="form-label mb-0 align-self-center text-start">
                                    Các môn học
                                </label>
                                <MultipleSelect
                                    label={'Chọn môn học'}
                                    getDataFromChild={getSubjects}
                                    optionList={subjectOptionsList}
                                    className={'ms-3 w-100 border subject-select'}
                                    selectedItem={resetSelectedItem}
                                />
                            </div>
                            <div className="d-flex justify-content-center mt-5">
                                <button
                                    type="submit"
                                    className="btn elp-bg-primary text-white rounded-5 px-3"
                                >
                                    Thêm môn học
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showSuccess && <Success message={'Thêm môn học thành công'} />}
            {showError && <ErrorPopup errorMsg={errorMessage} handleClose={handleCloseError} />}
        </div>
    )
}

export default PrincipalViewSubjects
