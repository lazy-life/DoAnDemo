import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react";
import Calendar from 'react-calendar';
import { parse, format } from 'date-fns';
import Header from "../components/Header"
import 'react-calendar/dist/Calendar.css';
import TeachNow from "../components/popUp/TeachNow";
import ScormPlayer from "../components/ScormPlayer";
import { handleAccessPage, handleDecrypt } from "../components/Ultilities/CommonFunction";
import axios from "axios";
import ViewDoc from "../components/popUp/ViewDoc";
import { url } from "../../Config/config";


const HomePageTeacher = () => {
    const [showPopUp, setShowPopUp] = useState(false)
    const [showPopUpScorm, setShowPopUpScorm] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const hidePopUp = useRef('')
    const hidePopUpScorm = useRef('')
    const [urlDoc, setUrlDoc] = useState(null)
    const [lessonPlan, setLessonPlan] = useState([])
    const [userLoginValue, setUserLoginValue] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState(true)
    const [timeTable, setTimeTable] = useState([])
    const [webInfor, setWebInfor] = useState(null)

    const handleShowMenu = (data) => {
        // setIsShowSideBar(data)
    };

    const handleKeySearch = (data) => {
        // setDataSearch(data)
    }

    const dataText = ['Lịch', 'Lịch dạy hôm nay', 'Ngày hiện tại', 'Có lịch dạy', 'Không có lịch dạy', 'Chỉnh sửa giáo án', 'Dạy ngay', 'Chi tiết ']

    const [value, onChange] = useState(new Date())
    const [scheduleSelect, setScheduleSelect] = useState(null)
    const [lessonContent, setLessonContent] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        document.addEventListener('mousedown', handlePopupShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupShow);
        }
    }, [])
    useEffect(() => {
        document.addEventListener('mousedown', handlePopupScormShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupScormShow);
        }
    }, [])

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'));

        if (value !== null) {
            const today = new Date();
            const formattedDate = today.toString().split(' ').slice(0, 4).join(' ');
            const dataUser = handleDecrypt(value)
            setUserLoginValue(dataUser)
            fetchDataOnDate(dataUser.userId, formattedDate)
        }
    }, [])

    useEffect(() => {
        //call api
        const dateData = value.toString();
        const formattedDate = dateData.split(' ').slice(0, 4).join(' ');

        setLessonContent('')
        setScheduleSelect('')
        if (userLoginValue) {
            fetchDataOnDate(userLoginValue.userId, formattedDate)
        }
    }, [value])

    const fetchDataOnDate = (usId, dateData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Session/GetSessionOfTeacherOnDate/${usId}/${dateData}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setTimeTable(dataTemp)
                    }
                })
                .catch(error => {
                    // Handle error
                    setTimeTable([])
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'));
        if (!value) {
            navigate('/login')
        }
    }, [])


    const notes = [{
        name: 'Ngày hiện tại',
        colorFill: '#FF4F00'
    },
    {
        name: 'Ngày đang chọn',
        colorFill: '#FECE8A'
    }]

    const SelectScheduleSubject = (lesson) => {
        setScheduleSelect(lesson)
        setLessonContent(lesson.lessonName ? lesson.lessonName : 'Chưa có thông tin bài dạy')
    }

    const handleView = () => {
        if (scheduleSelect) {
            setShowPopUp(true)
            if (userLoginValue) {
                fetchDataViewListScorm(scheduleSelect.lessonId, userLoginValue.userId)
            }
        }
    }
    const handleViewScorm = (id, data) => {
        try {
            if (id === 'close') {
                setShowPopUp(false)
            } else {
                if (id.fileExtension === '.zip') {
                    const dataTempScorm = {
                        'name': id.name,
                        'staticSiteUrl': id.staticSiteUrl
                    }
                    setWebInfor(dataTempScorm)
                    setShowPopUpScorm(true)
                    setShowPopUp(false)
                } else if (id.fileExtension === '.docx') {
                    fetDataDocUrl(id.id, '4')
                    setNameLessonPlan(id.name)
                    setShowPopUpDoc(true)
                    setShowPopUp(false)
                }
            }
        } catch (error) {

        }

    }

    const fetDataDocUrl = (plainId, typeId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetPlanFileUrl/${plainId}/${typeId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setUrlDoc(dataTemp)
                    }
                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                });
        }
    }

    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowPopUp(true)
            setShowPopUpDoc(false)
        }
    }

    const handlePlayScorm = (id, data) => {
        if (id === 'close') {
            setShowPopUpScorm(data)
            setShowPopUp(!data)
        }
    }

    const handlePopupShow = (e) => {
        if (hidePopUp.current && !hidePopUp.current.contains(e.target)) {
            setShowPopUp(false)
        }
    };
    const handlePopupScormShow = (e) => {
        if (hidePopUpScorm.current && !hidePopUpScorm.current.contains(e.target)) {
            setShowPopUpScorm(false)
            setShowPopUp(true)
        }
    };

    const fetchDataViewListScorm = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetLessonPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setLessonPlan(dataTemp)
                        setLoadingStatus(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLessonPlan([])
                    setLoadingStatus('hello')
                    console.error('Error:', error);
                });
        }
    }


    return (
        <div>
            <Header showMenuRole={'3'} getDataFromChild={handleShowMenu} getKeySearchFromChild={handleKeySearch} />

            <div id="homePage-teacher-wrapper">
                <div className="homepageContent">
                    <div className="leftSide">
                        <div className="topLeftSide">
                            <p>{dataText[0]}</p>
                            <Calendar
                                onChange={onChange}
                                value={value}
                                locale="vi-VN"
                            />
                            <div className="centerLeftSide">
                                {notes.map(note => (
                                    <div className="note" key={note.name}>
                                        <div className="noteColor" style={{ backgroundColor: note.colorFill }}></div>
                                        <div className="noteText">{note.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bottomLeftSide">
                            <Link to="/teacher">
                                <button>{dataText[5]}</button>
                            </Link>
                        </div>
                    </div>
                    <div className="center">
                        <div className="topCenterSide">
                            <p>{dataText[1]}</p>
                            {timeTable.length > 0 ?
                                <div className="centerCenterSide">
                                    {timeTable.map(schedule => (
                                        <div className={schedule.id === scheduleSelect.id ? " selectSchedule schedule" : "schedule"} key={schedule.id}
                                            onClick={() => SelectScheduleSubject(schedule)}>
                                            <div className="headScheduleItem">
                                                <div className="slotName">{schedule.sessionNumber}</div>
                                                <div>{schedule.subjectName}</div>
                                            </div>
                                            <div>Tiết {schedule.sessionNumber}
                                            </div>
                                            <div>Lớp: {schedule.className}</div>
                                        </div>
                                    ))}
                                </div>
                                : <div className="centerCenterSide">
                                    <div className="noContent">
                                        <Icon icon="nonicons:not-found-16" />
                                        <p>Chưa có lịch dạy</p>
                                    </div>
                                </div>}
                        </div>
                    </div>
                    <div className="rightSide">
                        <div className="topRightSide">
                            <p>{dataText[7]}</p>
                            <div className="centerRightSide">
                                {timeTable.length > 0 && scheduleSelect.lessonName ?
                                    <button onClick={() => {
                                        handleView()
                                    }}>{dataText[6]}</button>
                                    :
                                    <button style={{ backgroundColor: '#d77a4e' }}>{dataText[6]}</button>
                                }
                            </div>
                        </div>
                        <div className="bottomRightSide">
                            <p>{lessonContent}</p>
                        </div>
                    </div>
                </div>
            </div>
            {showPopUp &&
                <div style={{ position: 'fixed', zIndex: 12, margin: 0 }}>
                    <TeachNow getDataFromChild={handleViewScorm} lessonPLan={lessonPlan} loadingStatus={loadingStatus} />
                </div>
            }
            {showPopUpScorm && <ScormPlayer getDataFromChild={handlePlayScorm} webInfor={webInfor} />}
            {showPopUpDoc && <ViewDoc getDataFromChild={handleViewDoc} urlDoc={urlDoc} nameLessonPlan={nameLessonPlan} />}
        </div>
    )
}

export default HomePageTeacher
