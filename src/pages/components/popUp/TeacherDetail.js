import React, { useEffect } from 'react'

import '../../../sass/main.scss'

function TeacherDetail({ teacher, closePopUp }) {
    const { format } = require('date-fns')

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'teacher-detail-wrapper') {
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
        <div id="teacher-detail-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white">
                <div className="p-5">
                    <p className="elp-text-title text-center fs-5 mb-4">Thông tin giáo viên</p>
                    <div className="row">
                        <div className="col-lg-6 border-end">
                            <div className="d-flex mb-3">
                                <p className="label">Họ và tên</p>
                                <p>{teacher.fullname}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <p className="label">Ngày sinh</p>
                                <p>{format(new Date(teacher.dob), 'dd/MM/yyyy')}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <p className="label">Giới tính</p>
                                <p>{teacher.gender ? 'Nam' : 'Nữ'}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <p className="label">Email</p>
                                <p>{teacher.email}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <p className="label">Số điện thoại</p>
                                <p>{teacher.phoneNumber}</p>
                            </div>
                            <div className="d-flex mb-3">
                                <p className="label">Địa chỉ</p>
                                <p>{teacher.address}</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="d-flex mb-3">
                                <p className="label">Trình độ</p>
                                <p>{teacher.academicLevel}</p>
                            </div>
                            <div className="mb-3">
                                <p className="label">Dạy môn</p>
                                <div className="subjects border p-3">
                                    {teacher.subjects.map((item, index) => {
                                        return (
                                            <p key={index} className="text-start">
                                                {item.subjectName + ' (' + item.grade + ')'}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                            <button
                                className="btn elp-bg-primary text-white px-3 rounded-5 float-end"
                                onClick={handleCloseButton}
                            >
                                Xong
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDetail
