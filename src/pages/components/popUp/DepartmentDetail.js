import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { url } from '../../../Config/config'

import '../../../sass/main.scss'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function DepartmentDetail({ departmentId, closePopUp }) {
    const [department, setDepartment] = useState({
        departmentName: 'Tổ Khoa Học Xã Hội',
        subjects: [],
        members: [],
        headOfDepartmentName: 'Tổ Trưởng',
    })

    const loadDepartment = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetDetailDepartmentById/' + departmentId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setDepartment(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadDepartment()
    }, [])

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'department-detail-wrapper') {
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
        <div id="department-detail-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up p-3 bg-white">
                <h3 className="text-center mb-5">{department.departmentName}</h3>
                <div className="row">
                    <div className="col-lg-7 border-end">
                        <div className="d-flex">
                            <p>Tổ trưởng</p>
                            <p className="ms-5">{department.headOfDepartmentName}</p>
                        </div>
                        <div className="text-start">
                            <p>Thành viên</p>
                            <div className="department-members border px-5 py-3">
                                {department.members.map((item) => {
                                    return <p>{item.fullname}</p>
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="text-start">
                            <p>Các môn học</p>
                            <div className="department-subjects border p-3">
                                {[
                                    ...new Set(
                                        department.subjects.map((subject) => subject.subjectName)
                                    ),
                                ].map((item, index) => {
                                    return <p key={index}>{item}</p>
                                })}
                            </div>
                        </div>
                        <button
                            onClick={handleCloseButton}
                            type="button"
                            className="btn elp-bg-primary text-white mt-3 px-3 rounded-5 fw-bold float-end"
                        >
                            Xong
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepartmentDetail
