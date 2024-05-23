import React, { useState, useEffect } from 'react'
import '../../sass/main.scss'
import { Icon } from '@iconify/react'
import ModifyDepartment from '../components/popUp/ModifyDepartment'
import DepartmentDetail from '../components/popUp/DepartmentDetail'
import axios from 'axios'
import { url } from '../../Config/config'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function PrincipalViewDepartments({ userLoginData, getDeleteObject }) {
    const [departments, setDepartments] = useState([])
    const [department, setDepartment] = useState(null)
    const [showModifyDepartment, setShowModifyDepartment] = useState(false)
    const [showDepartmentDetail, setShowDepartmentDetail] = useState(false)
    const [departmentId, setDepartmentId] = useState()
    const [isLoadDepartments, setIsLoadDepartments] = useState(true)

    const loadAllDepartments = async () => {
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
                    setIsLoadDepartments(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadAllDepartments()
    }, [])

    const { format } = require('date-fns')

    const handleDeleteAction = (department) => {
        let messageDelete = {
            idObject: department.id,
            title: 'Xóa Tổ',
            content:
                'Bạn có chắc chắn muốn xóa ' + department.departmentName + ' khỏi trường không?',
            path: 'api/Department/DeleteDepartment/' + department.id,
            loadNewObjects: () => {
                loadAllDepartments()
            },
        }
        getDeleteObject(messageDelete)
    }

    const showModify = (department) => {
        setDepartment(department)
        setShowModifyDepartment(true)
    }

    const showDetail = (departmentId) => {
        setDepartmentId(departmentId)
        setShowDepartmentDetail(true)
    }

    const closeModifyDepartment = () => {
        setShowModifyDepartment(false)
    }

    const closeDepartmentDetail = () => {
        setShowDepartmentDetail(false)
    }

    return (
        <div id="principal-view-departments-wrapper">
            <div className="d-flex justify-content-between align-items-center">
                <div className="view-department-title">
                    <div className="bg-white border-bottom fw-bold py-2 px-5 mt-3">
                        <i className="fa-solid fa-check"></i>
                        Tổ
                    </div>
                </div>
                <button
                    onClick={() => showModify(null)}
                    type="button"
                    className="btn elp-bg-primary text-white fw-bold px-5 rounded-5"
                >
                    Thêm mới
                </button>
            </div>
            <div className="table-container bg-white shadow">
                <table className="table text-center border-none">
                    <thead>
                        <tr className="text-center">
                            <th>Tên tổ</th>
                            <th>Môn học</th>
                            <th>Tổ trưởng</th>
                            <th>Ngày tạo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoadDepartments ? (
                            departments.length > 0 ? (
                                departments.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                    >
                                        <td>{item.departmentName}</td>
                                        <td className="subject-col">
                                            {[
                                                ...new Set(
                                                    item.subjects.map((subject) => {
                                                        return subject.subjectName
                                                    })
                                                ),
                                            ]
                                                .toString()
                                                .replaceAll(',', ', ')}
                                        </td>
                                        <td>{item.headOfDepartment.fullname}</td>
                                        <td>{format(new Date(item.createAt), 'dd/MM/yyyy')}</td>
                                        <td className="d-flex justify-content-center">
                                            <div className="d-flex justify-content-between align-items-center w-50 mx-3">
                                                <div
                                                    className="icon px-2"
                                                    onClick={() => showDetail(item.id)}
                                                >
                                                    <Icon icon="ph:eye" />
                                                </div>
                                                <div
                                                    className="icon px-2"
                                                    onClick={() => showModify(item)}
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
                                        </td>
                                    </tr>
                                ))
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
                                    style={{ left: '56%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
            {showModifyDepartment && (
                <ModifyDepartment
                    userLoginData={userLoginData}
                    department={department}
                    loadNewDepartments={loadAllDepartments}
                    closePopUp={closeModifyDepartment}
                />
            )}
            {showDepartmentDetail && (
                <DepartmentDetail departmentId={departmentId} closePopUp={closeDepartmentDetail} />
            )}
        </div>
    )
}

export default PrincipalViewDepartments
