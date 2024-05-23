import React, { useEffect, useState } from 'react'

import '../../../sass/main.scss'
import Success from './Success'
import axios from 'axios'
import { url } from '../../../Config/config'
import ErrorPopup from './ErrorPopUp'
import { handleDecrypt } from '../Ultilities/CommonFunction'

function EnableSchool({ school, loadNewDeletedSchools, closePopUp }) {
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = () => {
        setShowError(false)
    }

    const handleCloseButton = () => {
        closePopUp()
    }

    const handleEnableButton = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .put(url + 'api/School/UnlockSchool/' + school.id, {}, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    loadNewDeletedSchools()
                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        closePopUp()
                    }, 1000)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((err) => {
                    // console.error(err)
                    setErrorMessage(err.response.data)
                    setShowError(true)
                })
        }
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'enable-school-wrapper') {
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
        <div id="enable-school-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white p-4">
                <p className="fw-bold">Thay đổi trạng thái trường học</p>
                <p>
                    Bạn có chắc chắn muốn "{school.schoolName}" được tiếp tục sử dụng trong hệ thống
                    không?
                </p>
                <div className="float-end">
                    <button
                        className="btn btn-secondary rounded-5 mx-1 px-3"
                        onClick={handleCloseButton}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn elp-bg-primary text-white rounded-5 mx-1 px-3"
                        onClick={handleEnableButton}
                    >
                        Có
                    </button>
                </div>
            </div>
            {showSuccess && <Success message={'Thay đổi trạng thái thành công'} />}
            {showError && <ErrorPopup errorMsg={errorMessage} handleClose={handleCloseError} />}
        </div>
    )
}

export default EnableSchool
