import { Icon } from "@iconify/react"
import SelectDropdown from "../SelectDropdown"
import { useEffect, useRef, useState } from "react"
import ErrorPopup from "./ErrorPopUp";


//chỉ tiết này => id: 0
const ModifySession = ({ dataTeacher, getDataFromChild, dataModifySession, handleClose }) => {
    const popupRef = useRef(null);
    const [selectSubject, setSelectSubject] = useState('')
    const [classSession, setClassSession] = useState(null)
    const [dowSession, setDowSession] = useState(null)
    const [sessionName, setSessionName] = useState(null)
    const [repeat, setRepeat] = useState(null)
    const [teacherSelect, setTeacherSelect] = useState(null)
    const [subjectData, setSubjectData] = useState([])
    const [teacherData, setTeacherData] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)
    const [showPopupError, setShowPopupError] = useState(false)

    useEffect(() => {
        const dataTemp = []
        dataTeacher.forEach(item => {
            const dataSubjectTemp = {
                'id': item.subjectId,
                'name': item.subject
            }
            dataTemp.push(dataSubjectTemp)
        })
        setSubjectData(dataTemp)
    }, [dataTeacher])

    useEffect(() => {

        setSessionName(dataModifySession.session)
        setClassSession(dataModifySession.classNameSession)
        setDowSession(dataModifySession.dow)

        setSelectSubject({ 'id': dataModifySession.subjectId, 'name': dataModifySession.subject })

        setRepeat({ id: dataModifySession.repeat })

        setTeacherSelect({ 'id': dataModifySession.teacherId, 'name': dataModifySession.teacher })

        dataTeacher.forEach(item => {
            if (item.subjectId === dataModifySession.subjectId) {
                setTeacherData(item.selectTeacherList)
            }
        });
    }, [dataModifySession])

    const loopAgain = [
        {
            id: 1,
            name: 'Chỉ tiết này'
        },
        {
            id: 2,
            name: 'Hàng tuần'
        },
        {
            id: 3,
            name: 'Hai tuần một lần'
        },
        {
            id: 4,
            name: 'Ba tuần một lần'
        }
    ]
    const handelSelectSubject = (data) => {
        setSelectSubject(data)
        // dataTeacher.forEach(item => {
        //     if (item.subjectId === Object.values(selectSubject)[0]) {
        //         setTeacherData(item.selectTeacherList)
        //         setTeacherSelect({ 'id': 'Chọn giáo viên' })
        //     }
        // });
    }

    useEffect(() => {
        dataTeacher.forEach(item => {
            if (item.subjectId === Object.values(selectSubject)[0]) {
                setTeacherData(item.selectTeacherList)
                setTeacherSelect({ 'id': item.teacherId, 'name': item.name })
            }
        });
    }, [selectSubject])

    const handelSelectLoop = (data) => {
        setRepeat(data)
    }

    const handelSelectTeacher = (data) => {
        setTeacherSelect(data)
    }

    const handleCloseError = (data) => {
        if (data === 'cancel') {
            setShowPopupError(false)
        }
    }

    const handleCancel = () => {
        setSelectSubject('')
        setClassSession(null)
        setDowSession(null)
        setSessionName(null)
        setRepeat(null)
        setTeacherSelect(null)
        setSubjectData([])
        setTeacherData([])
        handleClose('0');
    }
    const handleSave = () => {
        if (!selectSubject || Object.values(selectSubject)[0] === 0) {
            setErrorMsg('Vui lòng chọn môn học')
            setShowPopupError(true)
        } else if (!teacherSelect || Object.values(teacherSelect)[0] === 0) {
            setErrorMsg('Vui lòng chọn giáo viên')
            setShowPopupError(true)
        } else {
            const data = {
                'dow': dataModifySession.dow,
                'classSession': dataModifySession.classSession,
                'classNameSession': dataModifySession.session,
                'sessionId': dataModifySession.sessionId,
                'session': dataModifySession.session,
                "subject": Object.values(selectSubject)[1],
                "teacher": Object.values(teacherSelect)[1],
                "subjectId": Object.values(selectSubject)[0],
                "teacherId": Object.values(teacherSelect)[0],
                "repeat": (parseInt(Object.values(repeat)[0]) - 1)
            }
            getDataFromChild('1', data)
            setSelectSubject('')
            setClassSession(null)
            setDowSession(null)
            setSessionName(null)
            setRepeat(null)
            setTeacherSelect(null)
            setSubjectData([])
            setTeacherData([])
        }
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                handleClose('0');
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (
        <>
            <div id="modifySession-wrapper">
                <div ref={popupRef} className="popup">
                    <div className="topPopup">
                        <p>Chỉnh sửa tiết học</p>
                    </div>
                    <div className="centerPopup">
                        <div className="topCenter">
                            <p>Lớp: {classSession}</p>
                            <p>Thứ: {dowSession}</p>
                            <p>Tiết: {sessionName}</p>
                        </div>
                        <div className="contentCenter">
                            <div className="leftContent">
                                <div className="top">
                                    <p>Môn học</p>
                                    <div className="select">
                                        <SelectDropdown color={'black'} label={'Chọn môn học'}
                                            getDataFromChild={handelSelectSubject} optionList={subjectData}
                                            dataUpdate={selectSubject} />
                                    </div>
                                </div>
                                <div className="bottom">
                                    <p>Tần suất lặp</p>
                                    <div className="select">
                                        <SelectDropdown color={'black'} label={'Chọn tần suất'}
                                            getDataFromChild={handelSelectLoop} optionList={loopAgain}
                                            dataUpdate={repeat} />
                                    </div>
                                </div>
                            </div>
                            <div className="rightContent">
                                <div className="top">
                                    <p>Giáo viên</p>
                                    <div className="select">
                                        <SelectDropdown color={'black'} label={'Chọn giáo viên'}
                                            getDataFromChild={handelSelectTeacher} optionList={teacherData}
                                            dataUpdate={teacherSelect} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="noticeCenter">
                            <Icon icon="gridicons:notice-outline" />
                            <p>Tần suất lặp là số lần diễn ra môn học trong một đơn vị thời gian</p>
                        </div>
                        <div className="noticeCenter">
                            <Icon icon="gridicons:notice-outline" />
                            <p>Các môn học chưa được phân công giáo viên giảng dạy sẽ không hiển thị ở đây</p>
                        </div>
                    </div>
                    <div className="bottomPopup">
                        <button onClick={() => handleCancel()} className="cancel">Huỷ</button>
                        <button onClick={() => handleSave()} className="save">Lưu</button>
                    </div>
                </div>
            </div>
            {showPopupError && <ErrorPopup handleClose={handleCloseError} errorMsg={errorMsg} />}
        </>
    )
}

export default ModifySession




