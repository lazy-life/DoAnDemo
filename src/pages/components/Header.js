import React, { useState, useRef, useEffect } from 'react'
import '../../sass/main.scss'
import Notification from './popUp/Notification'
import Avatar from './popUp/Avatar'
import Information from './popUp/Information'
import Success from './popUp/Success'
import { useNavigate } from 'react-router-dom'
import ConfirmLogout from './popUp/ConfirmLogout'
import { findPriorityValue, handleDecrypt, roles } from '../components/Ultilities/CommonFunction'
import axios from 'axios'
import { url } from '../../Config/config'
import { Icon } from '@iconify/react/dist/iconify.js'
import LoadingDataWait from './LoadingDataWait'

// 1: principal, 2: head of department, 3: teacher, 4: admin

const Header = ({ showMenuRole, getDataFromChild, getKeySearchFromChild, dataResetSearch }) => {
    const logo = process.env.PUBLIC_URL + '/logo.png'

    const [showPersonalInformation, setShowPersonalInformation] = useState(false)
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [isCheckCircle, setIsCheckCircle] = useState(false)
    const [showMenu, setShowMenu] = useState(true)
    const [dataSearch, setDataSearch] = useState('')
    const [isPopupVisible, setPopupVisible] = useState(false)
    const [isPopupAvatarVisible, setIsPopupAvatarVisible] = useState(false)
    const [loadingWait, setLoadingWait] = useState(false)
    const [isShowMenu, setIsShowMenu] = useState(false)
    const [logoutCf, setLogoutCf] = useState(false)
    const [buttonChangeRole, setButtonChangeRole] = useState(false)
    const [checkNoticeNew, setCheckNoticeNew] = useState(false)
    const [totalNewNotice, setTotalNewNotice] = useState(0)
    const [userInfor, setUserInfor] = useState(null)
    const [avatarInfor, setAvatarInfor] = useState(null)
    const [noticeData, setNoticeData] = useState([])

    const popupRef = useRef(null)
    const popupAvatarRef = useRef(null)
    const buttonRef = useRef(null)
    const buttonAvatarRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (showMenuRole === '1' || showMenuRole === '4') {
            setShowMenu(true)
        } else {
            setShowMenu(false)
        }
    }, [])

    useEffect(() => {
        if (dataResetSearch) {
            setDataSearch('')
            getKeySearchFromChild(null)
        }
    }, [dataResetSearch])

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'))

        if (value) {
            const dataUser = handleDecrypt(value)
            let position = ''
            if (dataUser.userRole.includes(4)) {
                position = 'Admin'
            } else if (dataUser.userRole.includes(1)) {
                position = 'Hiệu trưởng'
            } else if (dataUser.userRole.includes(2)) {
                position = 'Tổ trưởng'
            } else if (dataUser.userRole.includes(3)) {
                position = 'Giáo viên'
            } else {
                position = ''
            }

            const dataUs = {
                name: dataUser.name,
                email: dataUser.email,
                acedemi: dataUser.acedemi,
                dob: dataUser.dob,
                position: position.toString().replaceAll(',', ', '),
                userId: dataUser.userId,
                gmail: dataUser.gmail,
            }
            setUserInfor(dataUs)

            const str = dataUs.name
            const words = str.split(' ')
            const lastWord = words[words.length - 1]
            setAvatarInfor(lastWord.charAt(0))

            if (dataUser.userRole.length === 1) {
                setButtonChangeRole(false)
            } else if (dataUser.userRole.length > 1) {
                setButtonChangeRole(true)
            }
        }
    }, [])

    const handleClick = () => {
        if (showMenuRole === '3') {
            navigate('/hompageTeacher')
        }
    }

    const handleDocument = () => {
        navigate('/hompageTeacher')
    }

    const handleApproveDocument = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))

        if (value) {
            const dataUser = handleDecrypt(value)
            const roleValue = findPriorityValue(roles, dataUser.userRole)
            if (roleValue === 1) {
                navigate('/principal')
            } else if (roleValue === 2) {
                navigate('/headOfDepartment')
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            getKeySearchFromChild(dataSearch)
        }
    }

    const sendDataSearch = () => {
        const dataSearchSend = dataSearch.trim()
        if (dataSearchSend) {
            getKeySearchFromChild(dataSearch)
        } else {
            setDataSearch('')
        }
    }

    const clearData = () => {
        setDataSearch('')
        getKeySearchFromChild(null)
    }

    const handleInputFocus = () => {
        setIsInputFocused(true)
    }
    const handleInputBlur = () => {
        setIsInputFocused(false)
    }

    const handleInputSearch = (event) => {
        setDataSearch(event.target.value)
    }

    const handleNoticeClick = () => {
        setPopupVisible(!isPopupVisible)
    }

    useEffect(() => {
        if (!isPopupVisible) {
            if (noticeData.length > 0) {
                const dataSend = []
                noticeData.forEach(item => {
                    if (!item.isReaded) {
                        dataSend.push(item)
                    }
                })
                changeNoticeStatus(dataSend)
            }
        }
    }, [isPopupVisible])

    const changeNoticeStatus = async (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`,
                    'content-type': 'application/json'
                }
            }
            const apiUrl = url + 'api/Notification/ChangeNotifyStatus'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    const value = JSON.parse(localStorage.getItem('userlogin'))

                    if (value) {
                        const dataUser = handleDecrypt(value)
                        fetchDataNotice(dataUser.userId);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const handleAvatarClick = () => {
        setIsPopupAvatarVisible(!isPopupAvatarVisible)
    }

    const handleDocumentNoticeClick = (e) => {
        if (
            popupRef.current &&
            !popupRef.current.contains(e.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(e.target)
        ) {
            setPopupVisible(false)
        }
    }
    const handleDocumentAvatarClick = (e) => {
        if (
            popupAvatarRef.current &&
            !popupAvatarRef.current.contains(e.target) &&
            buttonAvatarRef.current &&
            !buttonAvatarRef.current.contains(e.target)
        ) {
            setIsPopupAvatarVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentNoticeClick)
        return () => {
            document.removeEventListener('mousedown', handleDocumentNoticeClick)
        }
    }, [])
    useEffect(() => {
        document.addEventListener('mousedown', handleDocumentAvatarClick)
        return () => {
            document.removeEventListener('mousedown', handleDocumentAvatarClick)
        }
    }, [])

    const handleOpenSetting = (data) => {
        if (data === 'setting') {
            setShowPersonalInformation(true)
            setIsPopupAvatarVisible(false)
        }
        if (data === 'logout') {
            setLogoutCf(true)
            setIsPopupAvatarVisible(false)
        }
    }
    const handleSaveSetting = (data) => {
        if (data === 'saveSetting') {
            setIsCheckCircle(true)
        } else if (data === 'closeSetting') {
            setShowPersonalInformation(false)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsCheckCircle(false)
        }, 2500)

        return () => {
            clearTimeout(timeout)
        }
    }, [isCheckCircle])

    const sendDataIsShowSideBar = () => {
        setIsShowMenu(!isShowMenu)
        getDataFromChild(isShowMenu)
    }

    const handleLogout = (data) => {
        if (data === 'cancel') {
            setLogoutCf(false)
        } else if (data === 'accept') {
            setLoadingWait(true)
            logoutUser()
        }
    }

    const logoutUser = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Login/Logout`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    // Handle success
                    localStorage.removeItem('userlogin')
                    setLoadingWait(false)
                    navigate('/login')
                })
                .catch(error => {
                    localStorage.removeItem('userlogin')
                    navigate('/login')
                    setLoadingWait(false)
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'))

        if (value) {
            const dataUser = handleDecrypt(value)
            fetchDataNotice(dataUser.userId);
        }
    }, [])

    useEffect(() => {
        // Đặt hẹn giờ để gọi API sau mỗi 5 phút
        const intervalId = setInterval(() => {
            // Gọi API ở đây
            const value = JSON.parse(localStorage.getItem('userlogin'))

            if (value) {
                const dataUser = handleDecrypt(value)
                fetchDataNotice(dataUser.userId);
            }
        }, 60000); // 5 phút * 60 giây/phút * 1000 milliseconds/giây

        // Hủy hẹn giờ khi component unmount
        return () => clearInterval(intervalId);
    }, []); // useEffect sẽ chỉ được gọi một lần khi component mount

    function arraysAreEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; i++) {
            const obj1 = array1[i];
            const obj2 = array2[i];
            // So sánh từng thuộc tính của các đối tượng
            for (let key in obj1) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
        }
        return true;
    }

    const fetchDataNotice = (usid) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Notification/GetNotificationByUser/${usid}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        const datacheck = arraysAreEqual(dataTemp, noticeData)
                        let dataCountNewNotice = 0; // Initialize a counter variable to count the number of items that are marked as read

                        // Iterate over each item in the dataTemp array
                        dataTemp.forEach(item => {
                            // Check if the current item's isReaded property is true
                            if (!item.isReaded) {
                                // If true, increment the counter variable
                                dataCountNewNotice++;
                            }
                        });
                        setTotalNewNotice(dataCountNewNotice)
                        setCheckNoticeNew(datacheck)
                        setNoticeData(dataTemp)
                    } else {
                        setNoticeData([])
                    }
                })
                .catch(error => {
                    // Handle error
                    setNoticeData([])
                    console.error('Error:', error);
                });
        }
    }

    return (
        <div>
            <div id="header-wrapper">
                <div className="wrapper">
                    <div className="logo">
                        {showMenu && (
                            <div className="menu" onClick={sendDataIsShowSideBar}>
                                <i className="fa-solid fa-bars"></i>
                            </div>
                        )}

                        <img height="100%" src={logo} alt="ELP" onClick={handleClick} />
                    </div>
                    {showMenuRole === '4'
                        ? (<>
                            <div className={`searchBar ${isInputFocused ? 'focused' : ''}`}>
                                <div className="searchBtn" onClick={sendDataSearch}>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                                <input
                                    value={dataSearch}
                                    onChange={handleInputSearch}
                                    className={`inputBar ${isInputFocused ? 'focused' : ''}`}
                                    placeholder="Tìm kiếm"
                                    onKeyPress={handleKeyPress}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                                {dataSearch && <div onClick={() => clearData()} className='clearData'>
                                    <Icon onClick={() => clearData()} icon="flowbite:close-solid" />
                                </div>}
                            </div>
                        </>)
                        : (<>
                            <div style={{ background: 'transparent', color: 'transparent' }} className={`searchBar`}>
                                <div className="searchBtn" onClick={sendDataSearch}>
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>
                                <input disabled style={{ background: 'transparent', color: 'transparent' }}
                                    value={dataSearch}
                                    onChange={handleInputSearch}
                                    className={`inputBar ${isInputFocused ? 'focused' : ''}`}
                                    placeholder=""
                                    onKeyPress={handleKeyPress}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                            </div>
                        </>)
                    }

                    <div className="avatar">
                        {buttonChangeRole && (showMenuRole === '1' || showMenuRole === '2') && (
                            <div className="changeScreenTeacher">
                                <button onClick={() => handleDocument()}>Giảng dạy</button>
                            </div>
                        )}
                        {buttonChangeRole && showMenuRole === '3' && (
                            <div className="changeScreenManage">
                                <button onClick={() => handleApproveDocument()}>
                                    Duyệt tài liệu
                                </button>
                            </div>
                        )}
                        <div ref={buttonRef} className="noticeIcon" onClick={handleNoticeClick}>
                            <i className="fa-solid fa-bell"></i>
                            {totalNewNotice === 0
                                ? (
                                    <></>
                                )
                                : (
                                    <>
                                        <div class="notification-count">{totalNewNotice}</div>
                                    </>
                                )
                            }
                        </div>
                        <div
                            ref={buttonAvatarRef}
                            className="avatarName"
                            onClick={handleAvatarClick}
                        >
                            <span>{avatarInfor}</span>
                        </div>
                    </div>
                </div>
                {isPopupVisible && (
                    <div className="popup" ref={popupRef}>
                        <Notification noticeData={noticeData} />
                    </div>
                )}

                {isPopupAvatarVisible && (
                    <div className="popup" ref={popupAvatarRef}>
                        <Avatar getDataFromChild={handleOpenSetting} useInfor={userInfor} />
                    </div>
                )}
            </div>
            {showPersonalInformation && (
                <Information getDataFromChild={handleSaveSetting} useInfor={userInfor} />
            )}

            {isCheckCircle && <Success message={'Đổi mật khẩu thành công!'} />}
            {logoutCf && <ConfirmLogout getDataFromChild={handleLogout} />}
            {loadingWait && <LoadingDataWait />}
        </div>
    )
}

export default Header
