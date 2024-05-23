import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import TeacherDetail from '../components/popUp/TeacherDetail'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function DepartmentInformation({ userLoginData }) {
    const [department, setDepartment] = useState(null)
    const [showTeacherDetail, setShowTeacherDetail] = useState(false)
    const [teacher, setTeacher] = useState(null)
    const [isLoadDepartment, setIsLoadDepartment] = useState(true)

    const loadDepartment = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetDetailDepartmentByHodId/' + userLoginData.userId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    setDepartment(res.data)
                    setIsLoadDepartment(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        if (department === null) {
            loadDepartment()
        }
    }, [department])

    const showDetail = (teacher) => {
        setTeacher(teacher)
        setShowTeacherDetail(true)
    }

    const closeTeacherDetail = () => {
        setShowTeacherDetail(false)
    }

    return (
        <div id="department-information-wrapper" className="px-3">
            <div className="department-information-container">
                <div className="information-title d-flex w-100 bg-white">
                    <div className="column-title-1">
                        <p className="m-0 py-2 fw-bold text-center">Thông tin tổ</p>
                    </div>
                    <div className="column-title-2">
                        <p className="m-0 py-2 fw-bold text-center">Thành viên</p>
                    </div>
                </div>
                <div className="information d-flex bg-white w-100 mt-1">
                    {!isLoadDepartment ? (
                        department !== null && (
                            <div className="d-flex w-100 h-100">
                                <div className="column-1 py-4">
                                    <div className="d-flex border-bottom border-2 mx-3 mb-3">
                                        <p className="label px-3">Tên tổ</p>
                                        <p className="fw-bold">
                                            {department && department.departmentName}
                                        </p>
                                    </div>
                                    <div className="d-flex border-bottom border-2 mx-3 mb-3">
                                        <p className="label px-3">Tổ trưởng</p>
                                        <p className="fw-bold">
                                            {department && department.headOfDepartment.fullname}
                                        </p>
                                    </div>
                                    <div className="d-flex border-bottom border-2 mx-3 mb-3">
                                        <p className="label px-3">Số lượng môn học</p>
                                        <p className="fw-bold">
                                            {department &&
                                                [
                                                    ...new Set(
                                                        department.subjects.map((subject) => {
                                                            return subject.subjectName
                                                        })
                                                    ),
                                                ].length}
                                        </p>
                                    </div>
                                    <div className="d-flex border-bottom border-2 mx-3 mb-3">
                                        <p className="label px-3 align-self-center">Các môn học</p>
                                        <p className="fw-bold">
                                            {department &&
                                                [
                                                    ...new Set(
                                                        department.subjects.map((subject) => {
                                                            return subject.subjectName
                                                        })
                                                    ),
                                                ]
                                                    .toString()
                                                    .replaceAll(',', ', ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="column-2 py-4">
                                    {department &&
                                        department.members.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`d-flex justify-content-between px-3 py-2  ${index % 2 === 0 ? 'even-row' : 'odd-row'
                                                        }`}
                                                >
                                                    <p className="m-0 fw-bold">{item.fullname}</p>
                                                    <div
                                                        className="icon px-2"
                                                        onClick={() => showDetail(item)}
                                                    >
                                                        <Icon icon="ph:eye-bold" />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            </div>
                        )
                    ) : (
                        <div
                            style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                            className="loading"
                        >
                            <div
                                style={{ left: '56%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {showTeacherDetail && (
                <TeacherDetail teacher={teacher} closePopUp={closeTeacherDetail} />
            )}
        </div>
    )
}

export default DepartmentInformation
