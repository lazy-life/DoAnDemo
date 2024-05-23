import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import ImportTeachers from '../components/popUp/ImportTeachers'
import ModifyTeacher from '../components/popUp/ModifyTeacher'
import TeacherDetail from '../components/popUp/TeacherDetail'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function PrincipalViewTeachers({ userLoginData, getDeleteObject }) {
    const [teachers, setTeachers] = useState([])
    const [teacher, setTeacher] = useState(null)
    const [showImportTeacher, setShowImportTeacher] = useState(false)
    const [showModifyTeacher, setShowModifyTeacher] = useState(false)
    const [showTeacherDetail, setShowTeacherDetail] = useState(false)
    const [isLoadTeachers, setIsLoadTeachers] = useState(true)

    const loadAllTeachers = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/User/GetTeachersWithSubject/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setTeachers(res.data)
                    setIsLoadTeachers(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadAllTeachers()
    }, [])

    const { format } = require('date-fns')

    const handleDeleteAction = (teacher) => {
        let messageDelete = {
            idObject: teacher.id,
            title: 'Xóa giáo viên',
            content: 'Bạn có chắc chắn muốn xóa giáo viên ' + teacher.fullname + ' không?',
            path: 'api/User/DeleteTeacher?teacherId=' + teacher.id,
            loadNewObjects: () => {
                loadAllTeachers()
            },
        }
        getDeleteObject(messageDelete)
    }

    const closeImportTeacher = () => {
        setShowImportTeacher(false)
    }

    const closeModifyTeacher = () => {
        setShowModifyTeacher(false)
    }

    const closeDetail = () => {
        setShowTeacherDetail(false)
    }

    const showImport = () => {
        setShowImportTeacher(true)
    }

    const showDetail = (teacher) => {
        setTeacher(teacher)
        setShowTeacherDetail(true)
    }

    const showModify = (teacher) => {
        setTeacher(teacher)
        setShowModifyTeacher(true)
    }

    return (
        <div id="principal-view-teachers-wrapper">
            <div className="d-flex justify-content-between align-items-center">
                <div className="view-teachers-title">
                    <div className="bg-white border-bottom fw-bold py-2 px-5 mt-3">
                        <i className="fa-solid fa-check"></i>
                        Giáo viên
                    </div>
                </div>
                <div>
                    <button onClick={showImport} className="btn btn-success mx-2 rounded-5">
                        Thêm từ Excel
                    </button>
                    <button
                        onClick={() => showModify(null)}
                        className="btn elp-bg-primary text-white mx-2 rounded-5"
                    >
                        Thêm mới
                    </button>
                </div>
            </div>
            <div className="table-container bg-white shadow">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>Họ và tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Email</th>
                            <th>Trình độ</th>
                            <th>Dạy môn</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoadTeachers ? (
                            teachers.length > 0 &&
                            teachers.map((item, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                    >
                                        <td>{item.fullname}</td>
                                        <td>{format(new Date(item.dob), 'dd/MM/yyyy')}</td>
                                        <td>{item.gender ? 'Nam' : 'Nữ'}</td>
                                        <td className='email-col'>{item.email}</td>
                                        <td>{item.academicLevel}</td>
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
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <div
                                                    onClick={() => showDetail(item)}
                                                    className="icon px-2"
                                                >
                                                    <Icon icon="ph:eye" />
                                                </div>
                                                <div
                                                    onClick={() => showModify(item)}
                                                    className="icon px-2"
                                                >
                                                    <Icon icon="iconamoon:edit-light" />
                                                </div>
                                                <div
                                                    onClick={() => handleDeleteAction(item)}
                                                    className="icon px-2"
                                                >
                                                    <Icon icon="fluent:delete-24-regular" />
                                                </div>
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
                                    style={{ left: '56%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
            {showImportTeacher && (
                <ImportTeachers
                    userLoginData={userLoginData}
                    loadNewTeachers={loadAllTeachers}
                    closePopUp={closeImportTeacher}
                />
            )}
            {showModifyTeacher && (
                <ModifyTeacher
                    userLoginData={userLoginData}
                    teacher={teacher}
                    loadNewTeachers={loadAllTeachers}
                    closePopUp={closeModifyTeacher}
                />
            )}
            {showTeacherDetail && <TeacherDetail teacher={teacher} closePopUp={closeDetail} />}
        </div>
    )
}

export default PrincipalViewTeachers
