import React, { useEffect, useState } from 'react'
import { loadEffect } from '../components/Ultility'
import { Icon } from '@iconify/react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import Success from '../components/popUp/Success'
import ErrorPopup from '../components/popUp/ErrorPopUp'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function SchoolYear({ userLoginData, getDeleteObject }) {
    const [schoolYears, setSchoolYears] = useState([])
    const [isLoadSchoolYear, setIsLoadSchoolYear] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const loadSchoolYears = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Semester/GetListSemesterOfSchool/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setSchoolYears(res.data)
                    setIsLoadSchoolYear(false)
                })
                .catch((err) => {
                    // console.error(err)
                    setSchoolYears([])
                    setIsLoadSchoolYear(false)
                })
        }
    }

    useEffect(() => {
        loadSchoolYears()
    }, [])

    const { format } = require('date-fns')

    const addSchoolYear = async (event) => {
        event.preventDefault()
        let startTime = document.getElementById('startTime').value
        let endTime = document.getElementById('endTime').value

        let schoolYear = {
            name: format(new Date(startTime), 'yyyy') + '-' + format(new Date(endTime), 'yyyy'),
            startTime: startTime,
            endTime: endTime,
            schoolId: userLoginData.schoolId,
        }
        // console.log(schoolYear)
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .post(url + 'api/Semester/CreateSemester', schoolYear, {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    document.getElementById('startTime').value = ''
                    document.getElementById('endTime').value = ''
                    loadSchoolYears()
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
    }

    const closeError = () => {
        setShowError(false)
    }

    const handleDeleteAction = (schoolYear) => {
        let messageDelete = {
            idObject: schoolYear.id,
            title: 'Xóa năm học',
            content: 'Bạn có chắc chắn muốn xóa năm học ' + schoolYear.name + ' không?',
            path: 'api/Semester/DeleteSemester/' + schoolYear.id,
            loadNewObjects: () => {
                loadSchoolYears()
            },
        }
        getDeleteObject(messageDelete)
    }

    return (
        <div id="school-year-wrapper" className="row w-100">
            <div id="school-year-container" className="p-3 h-100 col-lg-7">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="school-year-title">
                        <div className="bg-white border-bottom fw-bold p-2 px-5 ">
                            <i className="fa-solid fa-check"></i>
                            Năm học
                        </div>
                    </div>
                </div>
                <div className="table-container bg-white shadow">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>Số thứ tự</th>
                                <th>Năm học</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoadSchoolYear ? (
                                schoolYears.length > 0 ? (
                                    schoolYears.map((item, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                            >
                                                <td>{index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>
                                                    {format(new Date(item.startTime), 'dd/MM/yyyy')}
                                                </td>
                                                <td>
                                                    {format(new Date(item.endTime), 'dd/MM/yyyy')}
                                                </td>
                                                <td>
                                                    <div
                                                        className="icon px-2"
                                                        onClick={() => handleDeleteAction(item)}
                                                    >
                                                        <Icon icon="fluent:delete-24-regular" />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <td colSpan={5}>
                                        <div className="d-flex flex-column align-items-center pt-2 elp-text-color">
                                            <Icon icon="ion:ban" style={{ fontSize: '40px' }} />
                                            <span className="px-3 fw-bold">Không có dữ liệu</span>
                                        </div>
                                    </td>
                                )
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
            <div id="add-school-year-wrapper" className="col-lg-5">
                <div className="p-3 pt-3 shadow bg-white add-school-year-container">
                    <p className="create-title text-center elp-text-title fw-bold mb-4">
                        Thêm năm học mới
                    </p>
                    <div>
                        <form onSubmit={addSchoolYear}>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="startTime"
                                    className="form-label mb-0 align-self-center"
                                >
                                    Thời gian bắt đầu
                                </label>
                                <input
                                    type="date"
                                    className="form-control ms-3 rounded-5"
                                    id="startTime"
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="endTime"
                                    className="form-label mb-0 align-self-center"
                                >
                                    Thời gian kết thúc
                                </label>
                                <input
                                    type="date"
                                    className="form-control ms-3 rounded-5"
                                    id="endTime"
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-center mt-5">
                                <button
                                    type="submit"
                                    className="btn elp-bg-primary text-white rounded-5 px-3"
                                >
                                    Thêm năm học
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showSuccess && <Success message={'Thêm năm học thành công'} />}
            {showError && <ErrorPopup handleClose={closeError} errorMsg={errorMessage} />}
        </div>
    )
}

export default SchoolYear
