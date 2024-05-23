import React from 'react'
import ForgetPasswordForm from '../components/ForgetPasswordForm'

function ForgetPassword() {
    return (
        <div id="forget-password-wrapper">
            <div className="body d-flex align-items-center justify-content-center">
                <ForgetPasswordForm />
            </div>

            <div className="forget-password-footer bg-white d-flex align-items-center justify-content-center">
                <div className="d-flex flex-column align-items-center">
                    <p className="mb-2 opacity-75 fw-bold">Hỗ trợ</p>
                    <p className="mb-2 opacity-75">
                        Email: <a href="mailto: dduc11092002@gmail.com">dduc11092002@gmail.com</a>
                    </p>
                    <p className="mb-2 opacity-75">
                        Số điện thoại: <a href="tel: 0964013255">0964013255</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword
