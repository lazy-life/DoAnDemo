import { useState, useRef, useEffect } from 'react'
import '../../../sass/main.scss'
import ErrorPopup from './ErrorPopUp'
import axios from 'axios'
import { url } from '../../../Config/config'
import CryptoJS from 'crypto-js'
import { Link } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import Success from './Success'
import { handleDecrypt } from '../Ultilities/CommonFunction'

const Information = ({ getDataFromChild, useInfor }) => {
    const popupRef = useRef(null)
    const { name, email, acedemi, dob, position, gmail } = useInfor

    const [showErrorPopUp, setShowErrorPopUp] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [gmailData, setGmailData] = useState(useInfor.gmail)

    const { format } = require('date-fns')

    const sendDataSaveToParent = () => {
        getDataFromChild('saveSetting')
    }
    const sendDataCloseToParent = () => {
        getDataFromChild('closeSetting')
    }

    const handleChangePassword = async () => {
        let oldPassword = document.getElementById('oldPassInput').value
        let newPassword = document.getElementById('newPassInput').value
        let reNewPassword = document.getElementById('reNewPassInput').value

        if (oldPassword === '') {
            setErrorMessage('Vui lòng nhập mật khẩu!')
            setShowErrorPopUp(true)
        } else if (newPassword === '') {
            setErrorMessage('Vui lòng nhập mật khẩu mới!')
            setShowErrorPopUp(true)
        } else if (reNewPassword === '') {
            setErrorMessage('Vui lòng nhập lại mật khẩu mới!')
            setShowErrorPopUp(true)
        } else if (newPassword !== reNewPassword) {
            setErrorMessage('Mật khẩu không trùng khớp!')
            setShowErrorPopUp(true)
        } else if (newPassword.length < 8) {
            setErrorMessage('Mật khẩu phải đủ 8 kí tự!')
            setShowErrorPopUp(true)
        } else {
            let changePassword = {
                userId: useInfor.userId,
                oldPassword: CryptoJS.SHA256(oldPassword).toString(),
                newPassword: CryptoJS.SHA256(newPassword).toString(),
            }
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token

                await axios
                    .put(url + 'api/User/ChangePassword', changePassword, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        setShowPassOld('')
                        setShowPassNew('')
                        setShowPassReNew('')
                        sendDataSaveToParent()
                    })
                    .catch((err) => {
                        // console.error(err.response.data)
                        setErrorMessage(err.response.data)
                        setShowErrorPopUp(true)
                    })
            }
        }
    }

    const closeErrorPopUp = (data) => {
        if (data === 'cancel') {
            setShowErrorPopUp(false)
        }
    }

    const [isFocusBtn1, setIsFocusBtn1] = useState(true)
    const [isFocusBtn2, setIsFocusBtn2] = useState(false)

    const [showEyeOld, setShowEyeOld] = useState(false)
    const [showEyeNew, setShowEyeNew] = useState(false)
    const [showEyeReNew, setShowEyeReNew] = useState(false)

    const [showPassOld, setShowPassOld] = useState('')
    const [showPassNew, setShowPassNew] = useState('')
    const [showPassReNew, setShowPassReNew] = useState('')
    const [activeBtnSelect, setActiveBtnSelect] = useState('1')

    const btn1Ref = useRef('')
    const btn2Ref = useRef('')

    const showOrHidePass = (props) => {
        if (props.numberProp === 1) {
            setShowEyeOld(!showEyeOld)
        }
        if (props.numberProp === 2) {
            setShowEyeNew(!showEyeNew)
        }
        if (props.numberProp === 3) {
            setShowEyeReNew(!showEyeReNew)
        }
    }

    const handleEncrypt = (data) => {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, 'secretKey').toString();
        localStorage.setItem('userlogin', JSON.stringify(encrypted));
    };

    const fetchUserInfor = (usId, dataFetch) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/User/GetUserProfile/${usId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataUs = response.data
                        dataFetch.gmail = dataUs.gmail
                        setGmailData(dataUs.gmail)
                        handleEncrypt(dataFetch)

                        setMsgSuccess('Liên kết thành công')
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                        }, 1000)

                        return () => {
                            clearTimeout(timeout)
                        }
                    }
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                });
        }
    }

    const handleLinkAccount = (data) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const requestData = {
                "userId": useInfor.userId,
                "token": data.token
            }
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/User/AccountConnnect'
            axios.put(apiUrl, requestData, config)
                .then((response) => {

                    const value = JSON.parse(localStorage.getItem('userlogin'));

                    if (value) {
                        const dataUser = handleDecrypt(value)
                        fetchUserInfor(useInfor.userId, dataUser)
                    }
                })
                .catch((error) => {
                    setErrorMessage('Tài khoản Google của bạn đã được liên kết với tài khoản khác!')
                    setShowErrorPopUp(true)
                });
        }
    }

    const activeBtn = (data) => {
        setActiveBtnSelect(data)
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if ((event.keyCode === 27 || event.key === 'Escape') && !showErrorPopUp) {
                getDataFromChild('closeSetting')
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown)

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [showErrorPopUp])

    const handleCancelClick = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target) && !showErrorPopUp) {
            getDataFromChild('closeSetting')
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleCancelClick)
        return () => {
            document.removeEventListener('mousedown', handleCancelClick)
        }
    }, [showErrorPopUp])

    return (
        <div id="personal-wrapper">
            <div ref={popupRef} id="information-wrapper">
                <div className="left">
                    <div
                        ref={btn1Ref}
                        onClick={() => activeBtn('1')}
                        className={`personalInfor ${activeBtnSelect === '1' ? 'focused' : ''}`}
                    >
                        <p>Thông tin cá nhân</p>
                    </div>
                    <div
                        ref={btn2Ref}
                        onClick={() => activeBtn('2')}
                        className={`password ${activeBtnSelect === '2' ? 'focused' : ''}`}
                    >
                        <p>Mật khẩu</p>
                    </div>
                    <div
                        ref={btn2Ref}
                        onClick={() => activeBtn('3')}
                        className={`password ${activeBtnSelect === '3' ? 'focused' : ''}`}
                    >
                        <p>Tài khoản liên kết</p>
                    </div>
                </div>

                {activeBtnSelect === '1' && (
                    <div className="right ">
                        <div className="titleInfor">
                            <p>Thông tin cá nhân</p>
                        </div>
                        <div className="avatarInfor">
                            <div className="avatarName">
                                <span>D</span>
                            </div>
                            <div className="fullname">
                                <p className="name">{name}</p>
                                <p className="age">
                                    Tuổi: {new Date().getFullYear() - new Date(dob).getFullYear()}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="specialize">
                                <p className="titleUser">Chức vụ</p>
                                <p className="dataUser">{position}</p>
                            </div>
                            <div className="email">
                                <p className="titleUser">Email</p>
                                <p className="dataUser">{email}</p>
                            </div>
                            <div className="username">
                                <p className="titleUser">Ngày sinh</p>
                                <p className="dataUser">
                                    {format(new Date(dob), 'dd/MM/yyyy')}
                                </p>
                            </div>
                        </div>
                        <div className="btnClose">
                            <div onClick={sendDataCloseToParent} className="closeBtn">
                                <p>Đóng</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeBtnSelect === '2' && (
                    <div className="right ">
                        <div className="titleInfor">
                            <p>Thay đổi mật khẩu</p>
                        </div>
                        <div className="borderChangePassword">
                            <div className="changePassword">
                                <div className="oldPass">
                                    <input
                                        id="oldPassInput"
                                        placeholder="Mật khẩu cũ"
                                        type={!showEyeOld ? 'password' : 'text'}
                                        value={showPassOld}
                                        onChange={(e) => setShowPassOld(e.target.value)}
                                        required
                                    />
                                    {showEyeOld && showPassOld && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 1 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                    {!showEyeOld && showPassOld && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 1 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye-off"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </div>
                                <div className="newPass">
                                    <input
                                        id="newPassInput"
                                        placeholder="Mật khẩu mới"
                                        type={!showEyeNew ? 'password' : 'text'}
                                        value={showPassNew}
                                        onChange={(e) => setShowPassNew(e.target.value)}
                                        required
                                    />
                                    {showEyeNew && showPassNew && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 2 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                    {!showEyeNew && showPassNew && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 2 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye-off"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </div>
                                <div className="reNewPass">
                                    <input
                                        id="reNewPassInput"
                                        placeholder="Nhập lại mật khẩu mới"
                                        type={!showEyeReNew ? 'password' : 'text'}
                                        value={showPassReNew}
                                        onChange={(e) => setShowPassReNew(e.target.value)}
                                        required
                                    />
                                    {showEyeReNew && showPassReNew && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 3 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                    {!showEyeReNew && showPassReNew && (
                                        <svg
                                            onClick={() => showOrHidePass({ numberProp: 3 })}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="feather feather-eye-off"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="btnClose">
                            <div onClick={sendDataCloseToParent} className="cancelBtn">
                                <p>Huỷ</p>
                            </div>
                            <div onClick={handleChangePassword} className="saveBtn">
                                <p>Lưu</p>
                            </div>
                        </div>

                        <div className="forgotPassword">
                            <Link
                                to="/forget-password"
                                style={{ textDecoration: 'none', color: '#18A4F7' }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>
                )}

                {activeBtnSelect === '3' && (
                    <div className="right ">
                        <div className="titleInfor">
                            <p>Tài khoản liên kết</p>
                        </div>
                        <div className="borderLinkAccount">
                            {gmailData
                                ? (<>
                                    <div className='noticeLink'>
                                        <p style={{ fontFamily: 'GoogleSans-Medium' }}>Tài khoản của bạn đã được liên kết với: </p>
                                        <div className='account'>
                                            <p style={{ fontFamily: 'GoogleSans-Medium' }}>{gmailData}</p>
                                        </div>
                                    </div>
                                    <div style={{color: 'white'}}>
                                        <button style={{color: 'white', padding: '.3rem 1rem', backgroundColor: '#886E62'}}>Huỷ liên kết</button>
                                    </div>
                                </>)
                                : (<>
                                    <div className='noticeNotLink'>
                                        <p>Chưa có tài khoản được liên kết. Vui lòng chọn tài khoản Google để liên kết!</p>
                                    </div>
                                    <button
                                        className="login-google-btn login-btn btn text-white w-100 mb-4"
                                    >

                                        <GoogleOAuthProvider clientId="654099406675-posg3antbgrkq172osrobie69tlba67f.apps.googleusercontent.com">
                                            <GoogleLogin text={"continue_with"} width={'1000'} locale={'vi_VN'} theme={'outline'} shape={'pill'} type={'standard'} size={'large'}
                                                onSuccess={(credentialResponse) => {
                                                    const dataCredential = credentialResponse?.credential
                                                    const requestData = {
                                                        token: dataCredential
                                                    };
                                                    handleLinkAccount(requestData)
                                                }}
                                                onError={() => {
                                                    console.log('Login Failed');
                                                }}
                                            />
                                        </GoogleOAuthProvider>
                                    </button>
                                </>)}
                        </div>
                        <div className="btnClose">
                            <div onClick={sendDataCloseToParent} className="saveBtn">
                                <p>Xong</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showErrorPopUp && <ErrorPopup handleClose={closeErrorPopUp} errorMsg={errorMessage} />}
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default Information
