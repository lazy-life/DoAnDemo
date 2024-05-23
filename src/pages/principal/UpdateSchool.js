import React, { useState } from 'react'
import Success from '../components/popUp/Success'
import SelectDropdown from '../components/SelectDropdown'

import '../../sass/main.scss'

function UpdateSchool({ school }) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [province, setProvince] = useState('')
    const [provinces, setProvinces] = useState([])
    const [district, setDistrict] = useState('')
    const [districts, setDistricts] = useState([])

    const getProvince = (data) => {
        setProvince(data)
    }

    const getDistrict = (data) => {
        setDistrict(data)
    }

    const updateSchool = (event) => {
        event.preventDefault()

        setShowSuccess(true)
        const timeout = setTimeout(() => {
            setShowSuccess(false)
        }, 2300)

        return () => {
            clearTimeout(timeout)
        }
    }

    return (
        <div id="update-school-wrapper">
            <button
                type="button"
                className="btn elp-bg-primary text-white fw-bold px-3 py-2 rounded-5 float-end"
                data-bs-toggle="modal"
                data-bs-target="#createDepartmentModal"
            >
                Chỉnh sửa thông tin trường
            </button>
            <div
                className="modal fade"
                id="createDepartmentModal"
                tabIndex="-1"
                aria-labelledby="createDepartmentModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content modal-create p-4 px-5">
                        <p className="create-title text-center elp-text-title mb-5">
                            Cập nhật thông tin trường học
                        </p>
                        <form onSubmit={updateSchool}>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="school-name"
                                    className="form-label mb-0 align-self-center"
                                >
                                    Tên trường
                                </label>
                                <input
                                    type="text"
                                    className="form-control ms-5 rounded-5"
                                    id="school-name"
                                    placeholder="Tên trường"
                                    defaultValue={school.schoolName}
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label className="form-label mb-0 align-self-center">
                                    Tên Tỉnh/TP
                                </label>
                                <SelectDropdown
                                    label={school.provinceName}
                                    getDataFromChild={getProvince}
                                    optionList={provinces}
                                    className={'border w-100 px-3 py-2 ms-5 rounded-5'}
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label className="form-label mb-0 align-self-center">
                                    Tên Quận/Huyện
                                </label>
                                <SelectDropdown
                                    label={school.districtName}
                                    getDataFromChild={getDistrict}
                                    optionList={districts}
                                    className={'border w-100 px-3 py-2 ms-5 rounded-5'}
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="detail-address"
                                    className="form-label mb-0 align-self-center"
                                >
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    className="form-control ms-5 rounded-5"
                                    id="detail-address"
                                    placeholder="Địa chỉ"
                                    defaultValue={school.detailAddress}
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="principal-name"
                                    className="form-label mb-0 align-self-center"
                                >
                                    Tên hiệu trường
                                </label>
                                <input
                                    type="text"
                                    className="form-control ms-5 rounded-5"
                                    id="principal-name"
                                    placeholder="Tên hiệu trưởng"
                                    defaultValue={school.principalName}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn elp-bg-primary text-white rounded-5 px-3 float-end mx-2"
                            >
                                Lưu
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary text-white rounded-5 px-3 float-end mx-2"
                                data-bs-dismiss="modal"
                            >
                                Hủy
                            </button>
                        </form>
                    </div>
                </div>
                {showSuccess && <Success message={'Cập nhật thông tin thành công'} />}
            </div>
        </div>
    )
}

export default UpdateSchool
