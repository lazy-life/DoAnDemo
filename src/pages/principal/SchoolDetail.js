import React, { useEffect, useState } from 'react'

import '../../sass/main.scss'
import axios from 'axios'
import { url } from '../../Config/config'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function SchoolDetail({ userLoginData }) {
    const [school, setSchool] = useState(null)
    const [isLoadSchool, setIsLoadSchool] = useState(true)

    const loadSChoolDetail = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/School/PrincipalGetSchoolById/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setSchool(res.data)
                    setIsLoadSchool(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadSChoolDetail()
    }, [])

    return (
        <div id="school-detail-wrapper">
            <div className="school-detail-title">
                <div className="bg-white border-bottom fw-bold py-2 px-5 mt-3">
                    <i className="fa-solid fa-check"></i>
                    Thông tin trường
                </div>
            </div>
            <div id="information-container" className="mb-5 bg-white p-3 py-5">
                {!isLoadSchool ? (
                    school !== null && (
                        <div>
                            <div className="d-flex border-bottom border-2 mb-3">
                                <p className="label px-3">Tên trường</p>
                                <p className="fw-bold">{school.schoolName}</p>
                            </div>
                            <div className="d-flex border-bottom border-2 mb-3">
                                <p className="label px-3">Tên Tỉnh/TP</p>
                                <p className="fw-bold">{school.provinceName}</p>
                            </div>
                            <div className="d-flex border-bottom border-2 mb-3">
                                <p className="label px-3">Tên Quận/Huyện</p>
                                <p className="fw-bold">{school.districtName}</p>
                            </div>
                            <div className="d-flex border-bottom border-2 mb-3">
                                <p className="label px-3">Địa chỉ</p>
                                <p className="fw-bold">{school.detailAddress}</p>
                            </div>
                            <div className="d-flex border-bottom border-2 mb-4">
                                <p className="label px-3">Tên hiệu trưởng</p>
                                <p className="fw-bold">{school.principalName}</p>
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
    )
}

export default SchoolDetail
