import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { url } from '../../Config/config'
import SuccessWithButton from './popUp/SuccessWithButton'
import LoadingDataWait from './LoadingDataWait'

function ForgetPasswordForm() {
    const [showWarning, setShowWarning] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [loadingWait, setLoadingWait] = useState(false)
    const navigate = useNavigate()

    let resetPasswordHandle = async (event) => {
        event.preventDefault()
        let email = document.getElementById('email').value

        setLoadingWait(true)

        await axios
            .put(url + 'api/User/ForgetPassword?email=' + email)
            .then((res) => {
                // console.log(res)
                setLoadingWait(false)
                setShowWarning(false)
                setShowSuccess(true)
            })
            .catch((err) => {
                // console.error(err)
                setLoadingWait(false)
                setShowWarning(true)
            })
    }

    const closeSuccess = () => {
        setShowSuccess(false)
    }

    let backButtonHandle = () => {
        navigate(-1)
    }

    return (
        <div className="formFotgetPassword">
            <form onSubmit={resetPasswordHandle}>
                <div className="titleForm border-bottom">
                    <p className="">Lấy lại mật khẩu</p>
                </div>
                <div className="border-bottom my-3 px-3">
                    {showWarning && (
                        <div id="fail-warning-block" className="border elp-border-primary mb-2 p-2">
                            <p className="form-text elp-text-title fw-bold m-0">Không có kết quả</p>
                            <p className="form-text m-0">
                                Thông tin của bạn không đúng. Vui lòng thử lại với thông tin khác
                            </p>
                        </div>
                    )}
                    <p className="textNotice">Vui lòng nhập địa chỉ Email để lấy lại mật khẩu</p>
                    <div className="mb-4">
                        <input
                            type="email"
                            className="form-control rounded-5"
                            id="email"
                            placeholder="Nhập địa chỉ Email"
                            required
                            autoFocus
                        />
                    </div>
                </div>
                <div className="my-3 px-3 d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-secondary text-white rounded-5 mx-2 px-3"
                        onClick={backButtonHandle}
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="btn elp-bg-primary text-white rounded-5 mx-2 px-3"
                    >
                        Lấy mật khẩu
                    </button>
                </div>
            </form>
            {loadingWait && <LoadingDataWait />}
            {showSuccess && (
                <SuccessWithButton
                    message={
                        'Lấy lại mật khẩu thành công, vui lòng kiểm tra email để xem mật khẩu mới'
                    }
                    closePopUp={closeSuccess}
                />
            )}
        </div>
    )
}

export default ForgetPasswordForm
