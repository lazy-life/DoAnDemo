import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { url } from '../../Config/config'

import '../../sass/main.scss'
import EnableSchool from './popUp/EnableSchool'
import { loadEffect } from './Ultility'
import { handleDecrypt } from './Ultilities/CommonFunction'

function ListDeletedSchools({ dataSearch }) {
    const [deletedSchools, setDeletedSchools] = useState([])
    const [deletedSchoolsTemp, setDeletedSchoolsTemp] = useState([])
    const [showEnableConfirm, setShowEnableConfirm] = useState(false)
    const [school, setSchool] = useState()
    const [isLoadSchools, setIsLoadSchools] = useState(true)

    const loadDeletedSchools = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/School/GetListDeletedSchool', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setDeletedSchools(res.data)
                    setDeletedSchoolsTemp(JSON.parse(JSON.stringify(res.data)))
                    setIsLoadSchools(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadDeletedSchools()
    }, [])

    useEffect(() => {
        if (dataSearch) {
            if (dataSearch.trim()) {
                const dataTemp = JSON.parse(JSON.stringify(deletedSchoolsTemp))
                if (dataTemp.length > 0) {
                    const dataSearchTemp = []
                    // const results = dataTemp.filter(item => item.subjectName.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()));
                    dataTemp.map(item => {
                        if (item.schoolName.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()) ||
                            item.provinceName.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()) ||
                            item.fullname.trim().toLowerCase().includes(dataSearch.trim().toLowerCase())
                        ) {
                            dataSearchTemp.push(item)
                        }
                    })
                    setDeletedSchools(dataSearchTemp)
                }
            } else {
                setDeletedSchools(JSON.parse(JSON.stringify(deletedSchoolsTemp)))
            }
        } else {
            setDeletedSchools(JSON.parse(JSON.stringify(deletedSchoolsTemp)))
        }
    }, [dataSearch])

    const handleUnlock = (school) => {
        setSchool(school)
        setShowEnableConfirm(true)
    }

    const closePopUp = () => {
        setShowEnableConfirm(false)
    }

    return (
        <div id="deleted-schools-wrapper" className="px-5 py-4">
            <div className="d-flex justify-content-between align-items-center">
                <div className="view-deleted-schools-title">
                    <p className="fw-bold">Danh sách các trường học bị xóa</p>
                </div>
            </div>
            <div className="table-container bg-white shadow">
                <table className="table text-center border-none">
                    <thead>
                        <tr className="text-center">
                            <th>Số thứ tự</th>
                            <th>Tên trường</th>
                            <th>Tỉnh/Thành phố</th>
                            <th>Hiệu trưởng</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoadSchools ? (
                            deletedSchools.length > 0 ? (
                                deletedSchools.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{item.schoolName}</td>
                                            <td>{item.provinceName}</td>
                                            <td>{item.fullname}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <div className="icon px-2">
                                                        <Icon
                                                            icon="tabler:lock-open"
                                                            onClick={() => handleUnlock(item)}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <td colSpan={5}>
                                    <div className="d-flex flex-column align-items-center elp-text-color">
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
            {showEnableConfirm && (
                <EnableSchool
                    school={school}
                    loadNewDeletedSchools={loadDeletedSchools}
                    closePopUp={closePopUp}
                />
            )}
        </div>
    )
}

export default ListDeletedSchools
