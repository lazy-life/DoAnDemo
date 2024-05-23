import React, { useState, useRef, useEffect } from 'react'
import { Icon } from "@iconify/react"
import CryptoJS from 'crypto-js';
import { Link, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { url } from '../../Config/config'

import '../../sass/main.scss'
import { findPriorityValue, handleDecrypt, roles, userLogin } from '../components/Ultilities/CommonFunction';
import ErrorPopup from '../components/popUp/ErrorPopUp';
import axios from 'axios';
import LoadingDataWait from '../components/LoadingDataWait';

// 1: principal, 2: head of department, 3: teacher, 4: admin
function Login() {
    const [showLogoBlock, setShowLogoBlock] = useState(true)
    const [showWarningBlock, setShowWarningBlock] = useState(false)
    const [loadingWait, setLoadingWait] = useState(false)
    const [accessGoogle, setAccessGoogle] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const navigate = useNavigate()
    const submitButtonRef = useRef(null)
    const [showEyePassword, setShowEyePassword] = useState(false)


    const [emailInput, setEmailInput] = useState(null)
    const [passwordInput, setPasswordInput] = useState(null)

    const handleEncrypt = (data) => {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, 'secretKey').toString();
        localStorage.setItem('userlogin', JSON.stringify(encrypted));
    };
    const handleEncryptUserInfor = (data) => {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, 'secretKey').toString();
        localStorage.setItem('userInfor', JSON.stringify(encrypted));
    };

    const showOrHidePass = (props) => {
        if (props.numberProp === 3) {
            setShowEyePassword(!showEyePassword)
        }
    }

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'));

        if (value) {
            const dataUser = handleDecrypt(value)
            const roleValue = findPriorityValue(roles, dataUser.userRole);
            if (roleValue === 1) {
                navigate('/principal')
            } else if (roleValue === 2) {
                navigate('/headOfDepartment')
            } else if (roleValue === 3) {
                navigate('/hompageTeacher')
            } else if (roleValue === 4) {
                navigate('/admin')
            }
        }
    }, [])

    const handleClose = (data) => {
        if (data === 'cancel') {
            setAccessGoogle(false)
        }
    }



    let loginButtonHandle = (event) => {
        event.preventDefault()
        const requestData = {
            email: emailInput,
            password: CryptoJS.SHA256(passwordInput).toString(),
        }
        setLoadingWait(true)
        const config = { 'content-type': 'application/json' }
        const apiUrl = url + 'api/Login/Login'
        axios.post(apiUrl, requestData, config)
            .then((response) => {
                const dataFetch = {
                    "token": response.data.token,
                    "userId": response.data.userId,
                    "userRole": response.data.userRole,
                    "schoolId": response.data.schoolId,
                    "schoolLevel": response.data.schoolLevel,
                    "refreshToken": null,
                    'name': null,
                    'email': null,
                    'acedemi': null,
                    'dob': null,
                    'position': null,
                    'gmail': null
                }
                fetchUserInfor(dataFetch.userId, dataFetch)

            })
            .catch((error) => {
                setLoadingWait(false)
                console.error('Error:', error);
                setShowLogoBlock(false)
                setShowWarningBlock(true)
                setEmailInput('')
                setPasswordInput('')
            });
    }

    const handleLoginGoogle = (requestData) => {
        const config = { 'content-type': 'application/json' }
        const apiUrl = url + 'api/Login/GoogleLogin'
        setLoadingWait(true)
        axios.post(apiUrl, requestData, config)
            .then((response) => {
                const dataFetch = {
                    "token": response.data.token,
                    "userId": response.data.userId,
                    "userRole": response.data.userRole,
                    "schoolId": response.data.schoolId,
                    "schoolLevel": response.data.schoolLevel,
                    "refreshToken": null,
                    'name': null,
                    'email': null,
                    'acedemi': null,
                    'dob': null,
                    'position': null,
                    'gmail': null
                }
                fetchUserInfor(dataFetch.userId, dataFetch)

            })
            .catch((error) => {
                setErrorMsg('Tài khoản Google của bạn chưa được liên kết với tài khoản nào!')
                setLoadingWait(false)
                setAccessGoogle(true)
                console.error('Error:', error);
                setEmailInput('')
                setPasswordInput('')
            });
    }

    const fetchUserInfor = (usId, dataFetch) => {

        let dataUserToken = dataFetch.token
        axios.get(url + `api/User/GetUserProfile/${usId}`, {
            headers: {
                'Authorization': `Bearer ${dataUserToken}`
            }
        })
            .then(response => {
                // Handle success
                if (response.data) {
                    const dataUs = response.data
                    dataFetch.name = dataUs.fullname
                    dataFetch.email = dataUs.email
                    dataFetch.acedemi = dataUs.academicLevel
                    dataFetch.dob = dataUs.dob
                    dataFetch.position = dataUs.email
                    dataFetch.gmail = dataUs.gmail
                    handleEncrypt(dataFetch)
                    const roleValue = findPriorityValue(roles, dataFetch.userRole);
                    setLoadingWait(false)
                    if (roleValue === 1) {
                        navigate('/principal')
                    } else if (roleValue === 2) {
                        navigate('/headOfDepartment')
                    } else if (roleValue === 3) {
                        navigate('/hompageTeacher')
                    } else if (roleValue === 4) {
                        navigate('/admin')
                    }
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    }

    return (
        <div id="login-wrapper">
            <div className="body d-flex">
                <div className="d-flex align-items-center w-100 logo-title">
                    {showLogoBlock && (
                        <div className='leftContent'>
                            <div id="logo-block" className="d-none d-md-block mx-5">
                                <img src={process.env.PUBLIC_URL + '/logo.png'}
                                    alt="ELP Logo"
                                />
                                <p>
                                    ELP giúp bạn quản lý giáo án một <br />
                                    cách thông minh và hiệu quả
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={showLogoBlock ? 'rightContent' : 'rightContentError'}>
                        <div className="form-container border p-3 bg-white mx-5">
                            <form onSubmit={loginButtonHandle}>
                                {showWarningBlock && (
                                    <div id="warning-block">
                                        <p className="elp-text-title text-center fw-bold fs-4">
                                            Đăng nhập vào ELP
                                        </p>
                                        <div className="login-fail-warning">
                                            Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.
                                            <div className="d-inline">
                                                <Link
                                                    to="/forget-password"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <strong className="warning-forget-password ">
                                                        {''}
                                                        Bạn quên mật khẩu?
                                                    </strong>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        className="form-control px-3"
                                        id="email"
                                        placeholder="Email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div className={`mb-4 inputPasswordLogin ${isFocused ? 'focused' : ''}`}>
                                    <input
                                        type={!showEyePassword ? 'password' : 'text'}
                                        className="form-control px-3"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        id="password"
                                        placeholder="Mật khẩu"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        // pattern=".{8}"
                                        required
                                    />
                                    {showEyePassword && passwordInput && (
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
                                    {!showEyePassword && passwordInput && (
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
                                <button
                                    type='submit'
                                    className="login-btn elp-bg-primary btn text-white w-100 mb-4"
                                    ref={submitButtonRef}
                                >
                                    Đăng nhập
                                </button>
                                <div className="text-center forget-password">
                                    <Link
                                        to="/forget-password"
                                        style={{ textDecoration: 'none', color: '#18A4F7' }}
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                            </form>
                            <button
                                className="login-google-btn login-btn btn text-white w-100 mb-4"
                            >

                                <GoogleOAuthProvider clientId="654099406675-posg3antbgrkq172osrobie69tlba67f.apps.googleusercontent.com">
                                    <GoogleLogin width={'1000'} locale={'vi_VN'} theme={'outline'} shape={'pill'} type={'standard'} size={'large'}
                                        onSuccess={(credentialResponse) => {
                                            const dataCredential = credentialResponse?.credential
                                            const requestData = {
                                                token: dataCredential
                                            };
                                            handleLoginGoogle(requestData)
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    />
                                </GoogleOAuthProvider>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-footer bg-white d-flex align-items-center justify-content-center">
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

            {loadingWait && <LoadingDataWait />}
            {accessGoogle && <ErrorPopup handleClose={handleClose} errorMsg={errorMsg} />}
        </div>
    )
}

export default Login
