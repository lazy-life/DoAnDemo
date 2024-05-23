import React, { Suspense, useEffect, useState } from 'react'
import { format, startOfWeek, endOfWeek, addWeeks, isBefore, isAfter, isWithinInterval, parseISO } from 'date-fns';
import Header from '../components/Header'
import '../../sass/main.scss'
import SideBar from '../components/SideBar'
import { useNavigate } from 'react-router-dom'
import SideBarPrincipal from '../components/SideBarPrincipal'
import PrincipalViewDepartments from './PrincipalViewDepartments'
import PrincipalViewSubjects from './PrincipalViewSubjects'
import PrincipalViewLessonPlans from './PrincipalViewLessonPlans'
import PrincipalViewTeachers from './PrincipalViewTeachers'
import DeleteConfirm from '../components/popUp/DeleteConfirm'
import PrincipalReviewLessonPlans from './PrincipalReviewLessonPlans'
import axios from 'axios'
import { url } from '../../Config/config'
import SchoolDetail from './SchoolDetail'
// import ListClass from '../components/ListClass'
// import TimeTable from '../components/TimeTable'
import Success from '../components/popUp/Success'
import ModifySession from '../components/popUp/ModifySession'
import AddSemester from '../components/popUp/AddSemester'
import ApplyTimetable from '../components/popUp/ApplyTimetable'
import ViewDoc from '../components/popUp/ViewDoc'
import ApproveDoc from '../components/ApproveDoc'
import {
    findPriorityValue,
    handleAccess,
    handleAccessPage,
    handleDecrypt,
    roles,
} from '../components/Ultilities/CommonFunction'
import AddSession from '../components/popUp/AddSession'
import SchoolYear from './SchoolYear'
import DeleteSessionConfirm from '../components/popUp/DeleteSessionConfirm'
import ErrorPopup from '../components/popUp/ErrorPopUp'
import PrincipalViewSyllabus from './PrincipalViewSyllabus'
import ErrorPopupNotSave from '../components/popUp/ErrorPopupNotSave';
import { loadEffect } from '../components/Ultility';

const ListClass = React.lazy(() => {
    return import('../components/ListClass').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})

const TimeTable = React.lazy(() => {
    return import('../components/TimeTable').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})
function PrincipalPage() {
    const [isShowSideBar, setIsShowSideBar] = useState(true)
    const [deleteShow, setDeleteShow] = useState(false)
    const [deleteShowSession, setDeleteShowSession] = useState(false)
    const [modifyShow, setModifyShow] = useState(false)
    const [addSessionShow, setAddSessionShow] = useState(false)
    const [showApplyTimeTable, setShowApplyTimeTable] = useState(false)
    const [deleteObject, setDeleteObject] = useState({})
    const [pageName, setPageName] = useState('review-lesson-plans')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showAddSemester, setShowAddSemester] = useState(false)
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [dataModifySession, setDataModifySession] = useState(null)
    const [classSession, setClassSession] = useState(null)
    const [timeTable, setTimeTable] = useState([])
    const [timeTableTemp, setTimeTableTemp] = useState([])
    const [timeTableModify, setTimeTableModify] = useState([])
    const [dataClass, setDataClass] = useState([])
    const [semesterData, setSemesterData] = useState([])
    const [semesterWeekData, setSemesterWeekData] = useState([])
    const [dataTeacher, setDataTeacher] = useState([])
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [timetableGrade, setTimetableGrade] = useState(null)
    const [userDataCurrentSchoolId, setUserDataCurrentSchoolId] = useState(null)
    const [semesterSelect, setSemesterSelect] = useState(null)
    const [weekSemesterSelect, setWeekSemesterSelect] = useState(null)
    const [userLoginData, setUserLoginData] = useState(null)
    const [showPopupError, setShowPopupError] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [errorMsgNotSave, setErrorMsgNotSave] = useState(null)
    const [checkIsEditTimeTable, setCheckIsEditTimeTable] = useState(false) //kiem tra xem tkb co dang edit khong
    const [checkChangeSideBar, setCheckChangeSideBar] = useState(false) // kiem tra xem co thay doi gi sidebar
    const [showErrorEdit, setShowErrorEdit] = useState(false)

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'))

        if (value !== null) {
            const dataUser = handleDecrypt(value)
            setUserLoginData(dataUser)
            setUserDataCurrentSchoolId(dataUser.schoolId)
            fetchDataSemester(dataUser.schoolId)
        }
    }, [])

    useEffect(() => {
        fetchDataClassOfSchool(userDataCurrentSchoolId, timetableGrade)
        fetchDataSemester(userDataCurrentSchoolId)
    }, [timetableGrade])

    useEffect(() => {
        if (classSession && semesterSelect && weekSemesterSelect) {
            fetchTimeTable(classSession.id)
            fetchDataTeachingInformation(classSession.id, semesterSelect)
        }
    }, [classSession, semesterSelect, weekSemesterSelect])

    const fetchTimeTable = (classSessionId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(
                    url +
                    `api/Session/GetWeekTimeTableOfClass/${classSessionId}/${weekSemesterSelect.weekStartTime}/${weekSemesterSelect.weekEndTime}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setTimeTable(response.data)
                        setTimeTableTemp(JSON.parse(JSON.stringify(response.data)))
                    }
                })
                .catch((error) => {
                    // Handle error
                    console.error('Error:', error)
                })
        }
    }

    useEffect(() => {
        fetchDataWeekOfSemester(semesterSelect)
    }, [semesterSelect])

    const fetchDataSemester = (schoolId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(url + `api/Semester/GetListSemesterOfSchool/${schoolId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        const currentDate = new Date();
                        setSemesterData(response.data)
                        let checkSemesterYear = false
                        response.data.forEach(item => {
                            const startTime = parseISO(item.startTime); // Thời gian bắt đầu
                            const endTime = parseISO(item.endTime); // Thời gian kết thúc


                            const isInInterval = isWithinInterval(currentDate, { start: startTime, end: endTime });
                            if (isInInterval) {
                                setSemesterSelect(item.id)
                                checkSemesterYear = true
                                return
                            }
                        })

                        if (!checkSemesterYear) {
                            setSemesterSelect(response.data[0].id)
                        }

                    }
                })
                .catch((error) => {
                    // Handle error
                    setSemesterWeekData([])
                    setWeekSemesterSelect(null)
                    console.error('Error:', error)
                })
        }
    }
    const fetchDataTeachingInformation = (classId, semesterId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(
                    url + `api/TeachingInfor/GetListTeachingInforOfClassInSemester/${classId}/${semesterId}/${weekSemesterSelect.weekStartTime}/${weekSemesterSelect.weekEndTime}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setDataTeacher(response.data)
                    }
                })
                .catch((error) => {
                    // Handle error
                    setDataTeacher([])
                    console.error('Error teaching information:', error)
                })
        }
    }
    const fetchDataClassOfSchool = (schoolId, grade) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(url + `api/Class/GetListClassOfSchoolByGrade/${schoolId}/${grade}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setDataClass(response.data)
                        setClassSession(response.data[0])
                    }
                })
                .catch((error) => {
                    // Handle error
                    setDataClass([])
                    setClassSession(null)
                    console.error('Error:', error)
                })
        }
    }

    const fetchDataWeekOfSemester = (semesterId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(url + `api/Semester/GetListWeekOfSemester/${semesterId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        const currentWeek = getCurrentWeek();

                        let checkWeekSelect = true
                        response.data.forEach(week => {
                            const startDate = new Date(week.weekStartTime);
                            const endDate = new Date(week.weekEndTime);

                            const startDateWithoutTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                            const endDateWithoutTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

                            const selectedWeek = {
                                start: new Date(startDateWithoutTime),
                                end: new Date(endDateWithoutTime)
                            };

                            const comparisonResult = checkWeek(currentWeek, selectedWeek);

                            if (comparisonResult === '3') {
                                checkWeekSelect = false
                                setWeekSemesterSelect(week)
                                return
                            }
                        });

                        if (checkWeekSelect === true) {
                            setWeekSemesterSelect(response.data[0])
                        }

                        setSemesterWeekData(response.data)
                    }
                })
                .catch((error) => {
                    // Handle error
                    console.error('Error:', error)
                })
        }
    }

    function checkWeek(currentWeek, selectedWeek) {
        if (isBefore(currentWeek.end, selectedWeek.start)) {
            return '1';
        } else if (isAfter(currentWeek.start, selectedWeek.end)) {
            return '2';
        } else {
            return '3';
        }
    }

    function getCurrentWeek() {
        const today = new Date();
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
        return {
            start: format(startOfCurrentWeek, 'yyyy-MM-dd'),
            end: format(endOfCurrentWeek, 'yyyy-MM-dd')
        };
    }

    const handleSaveTeachingInformation = (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/TeachingInfor/AssignTeacherToSubjectOfClassInSemester'
            axios
                .post(apiUrl, requestData, config)
                .then((response) => {
                    setMsgSuccess('Lưu thành công')
                    setShowSuccess(true)
                    fetchDataTeachingInformation(classSession.id, semesterSelect)
                    fetchTimeTable(classSession.id)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                    }, 1000)

                    return () => {
                        fetchDataTeachingInformation(classSession.id, semesterSelect)
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    try {
                        setErrorMsg(error.response.data)
                        setShowPopupError(true)
                    } catch (error) {
                        setErrorMsg('Phân công bị lỗi')
                        setShowPopupError(true)
                    }

                    fetchDataTeachingInformation(classSession.id, semesterSelect)
                    fetchTimeTable(classSession.id)
                    console.error('Error:', error)
                })
        }
    }
    const handleSaveTimeTable = (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/Session/ModifyTimeTableSession'
            axios
                .post(apiUrl, requestData, config)
                .then((response) => {
                    setMsgSuccess('Lưu thành công')
                    setTimeTableModify([])
                    setShowSuccess(true)
                    fetchDataTeachingInformation(classSession.id, semesterSelect)
                    fetchTimeTable(classSession.id)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                    }, 1300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    setTimeTableModify([])
                    setErrorMsg(error.response.data)
                    setShowPopupError(true)
                    fetchDataTeachingInformation(classSession.id, semesterSelect)
                    fetchTimeTable(classSession.id)
                    console.error('Error:', error.response.data)
                })
        }
    }

    const navigate = useNavigate()

    const handleShowMenu = (data) => {
        setIsShowSideBar(data)
    }

    const getDeleteObject = (data) => {
        setDeleteShow(true)
        setDeleteObject(data)
    }

    const getChildrenPage = (data, id) => {
        if (!checkChangeSideBar) {
            setPageName(data)
            setTimetableGrade(id)
            setTimeTableModify([])
        } else {
            setShowErrorEdit(true)
            setErrorMsgNotSave('Bạn đang chỉnh sửa. Vui lòng lưu trước khi chuyển trang!')
        }
    }

    const getDataDelete = async (data) => {
        if (data === 'cancel') {
            setDeleteShow(false)
        } else if (data === 'delete') {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .delete(url + deleteObject.path, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        setMsgSuccess('Xoá thành công')
                        // console.log(res)
                        if (deleteObject.hasOwnProperty('loadNewObjects')) {
                            deleteObject.loadNewObjects()
                            if (userLoginData.schoolId) {
                                fetchDataSemester(userLoginData.schoolId)
                            }
                        }
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                            setDeleteShow(false)
                        }, 2300)

                        return () => {
                            clearTimeout(timeout)
                        }
                    })
                    .catch((err) => {
                        // console.error(err)
                        setErrorMsg(err.response.data)
                        setShowPopupError(true)
                    })
            }
        }
    }
    const getDataDeleteSession = async (data, objectDelete, repeatDelete) => {
        if (data === 'cancel') {
            setDeleteShowSession(false)
        } else if (data === 'delete') {
            if (objectDelete.data.id === 0) {
                timeTable.forEach((dataTimetable) => {
                    if (dataTimetable.dayOfWeek === objectDelete.dow) {
                        dataTimetable.data.forEach((timtableElement) => {
                            if (timtableElement.session === objectDelete.data.session) {
                                timtableElement.subject = null
                                timtableElement.teacher = null
                                timtableElement.subjectId = null
                                timtableElement.teacherId = null
                            }
                        })
                    }
                })

                const dayOfWeekToRemove = objectDelete.dow; // dayOfWeek mà bạn muốn xoá
                const sessionToRemove = objectDelete.data.session;   // session mà bạn muốn xoá

                // Sử dụng map để lặp qua mỗi phần tử trong mảng
                const newArray = timeTableModify.map(item => {
                    // Kiểm tra xem dayOfWeek của phần tử hiện tại có trùng với dayOfWeekToRemove không
                    if (item.dayOfWeek === dayOfWeekToRemove) {
                        // Nếu có, sử dụng filter để loại bỏ các đối tượng có session là sessionToRemove
                        return {
                            ...item,
                            data: item.data.filter(session => session.session !== sessionToRemove)
                        };
                    }
                    // Nếu không trùng, trả về phần tử nguyên vẹn
                    return item;
                });
                setTimeTableModify(newArray)
            } else if (objectDelete.data.id !== 0) {
                const dataNew = {
                    id: objectDelete.data.id,
                    session: objectDelete.data.session,
                    subject: objectDelete.data.subjectId,
                    teacherId: objectDelete.data.teacherId,
                    repeat: repeatDelete,
                    isNew: 0,
                    isDelete: 1,
                }
                const dataModify = {
                    dayOfWeek: objectDelete.dow,
                    schoolId: userLoginData.schoolId,
                    semesterId: semesterSelect,
                    startTime: weekSemesterSelect.weekStartTime,
                    endTime: weekSemesterSelect.weekEndTime,
                    classId: classSession.id,
                    data: [],
                }
                dataModify.data.push(dataNew)
                setTimeTableModify((prevValue) => [...prevValue, dataModify])

                timeTable.forEach((dataTimetable) => {
                    if (dataTimetable.dayOfWeek === objectDelete.dow) {
                        dataTimetable.data.forEach((timtableElement) => {
                            if (timtableElement.session === objectDelete.data.session) {
                                timtableElement.subject = null
                                timtableElement.teacher = null
                                timtableElement.subjectId = null
                                timtableElement.teacherId = null
                            }
                        })
                    }
                })
            }
            setDeleteShowSession(false)
        }
    }

    const getDataModify = (type, data) => {
        if (type === '1') {
            const dataTimetableCheck = JSON.parse(JSON.stringify(timeTableTemp))
            let itemSessionExistRoot = false

            dataTimetableCheck.forEach(itemTimetableCheck => {
                if (itemTimetableCheck.dayOfWeek === data.dow) {
                    itemTimetableCheck.data.forEach(itemListSession => {
                        if (itemListSession.session === data.session) {
                            if (itemListSession.subjectId === data.subjectId &&
                                itemListSession.teacherId === data.teacherId) {
                                if (itemListSession.repeat === data.repeat) {
                                    itemSessionExistRoot = true
                                }
                            }
                        }
                    })
                    return
                }
            })

            if (!itemSessionExistRoot) {
                timeTable.forEach(itemTimetableCheck => {
                    if (itemTimetableCheck.dayOfWeek === data.dow) {
                        itemTimetableCheck.data.forEach(itemListSession => {
                            if (itemListSession.session === data.session) {
                                if (itemListSession.id) {
                                    itemListSession.subject = data.subject
                                    itemListSession.teacher = data.teacher
                                    itemListSession.subjectId = data.subjectId
                                    itemListSession.teacherId = data.teacherId

                                    let isExistDataDow = false
                                    timeTableModify.forEach((elementValue) => {
                                        if (elementValue.dayOfWeek === data.dow) {
                                            let isExistData = false
                                            elementValue.data.forEach((elementData) => {
                                                if (elementData.session === data.session) {
                                                    elementData.subject = itemListSession.subjectId
                                                    elementData.teacherId = itemListSession.teacherId
                                                    elementData.repeat = data.repeat
                                                    elementData.isDelete = 0
                                                    isExistData = true
                                                }
                                            })
                                            if (!isExistData) {
                                                const dataNew = {
                                                    id: data.sessionId,
                                                    session: data.session,
                                                    subject: data.subjectId,
                                                    teacherId: data.teacherId,
                                                    repeat: data.repeat,
                                                    isDelete: 0
                                                }
                                                elementValue.data.push(dataNew)
                                            }
                                            isExistDataDow = true
                                        }
                                    })
                                    if (!isExistDataDow) {
                                        const dataNew = {
                                            id: data.sessionId,
                                            session: data.session,
                                            subject: data.subjectId,
                                            teacherId: data.teacherId,
                                            repeat: data.repeat,
                                            isDelete: 0
                                        }
                                        const dataModify = {
                                            dayOfWeek: data.dow,
                                            schoolId: userLoginData.schoolId,
                                            semesterId: semesterSelect,
                                            startTime: weekSemesterSelect.weekStartTime,
                                            endTime: weekSemesterSelect.weekEndTime,
                                            classId: data.classSession,
                                            data: [],
                                        }
                                        dataModify.data.push(dataNew)
                                        setTimeTableModify((prevValue) => [...prevValue, dataModify])
                                    }
                                } else {
                                    timeTable.forEach((timetable) => {
                                        if (timetable.dayOfWeek === data.dow) {
                                            timetable.data.forEach((timtableElement) => {
                                                if (timtableElement.session === data.session) {
                                                    timtableElement.subject = data.subject
                                                    timtableElement.teacher = data.teacher
                                                    timtableElement.subjectId = data.subjectId
                                                    timtableElement.teacherId = data.teacherId

                                                    //add temp list
                                                    let isExistDataDow = false
                                                    timeTableModify.forEach((elementValue) => {
                                                        if (elementValue.dayOfWeek === data.dow) {
                                                            let isExistData = false
                                                            elementValue.data.forEach((elementData) => {
                                                                if (elementData.session === data.session) {
                                                                    elementData.subject = timtableElement.subjectId
                                                                    elementData.teacherId = timtableElement.teacherId
                                                                    elementData.repeat = data.repeat
                                                                    elementData.isNew = 1
                                                                    elementData.isDelete = 0
                                                                    isExistData = true
                                                                }
                                                            })
                                                            if (!isExistData) {
                                                                const dataNew = {
                                                                    id: data.sessionId,
                                                                    session: data.session,
                                                                    subject: data.subjectId,
                                                                    teacherId: data.teacherId,
                                                                    repeat: data.repeat,
                                                                    isNew: 1,
                                                                    isDelete: 0,
                                                                }
                                                                elementValue.data.push(dataNew)
                                                            }
                                                            isExistDataDow = true
                                                        }
                                                    })
                                                    if (!isExistDataDow) {
                                                        const dataNew = {
                                                            id: data.sessionId,
                                                            session: data.session,
                                                            subject: data.subjectId,
                                                            teacherId: data.teacherId,
                                                            repeat: data.repeat,
                                                            isNew: 1,
                                                            isDelete: 0,
                                                        }
                                                        const dataModify = {
                                                            dayOfWeek: data.dow,
                                                            schoolId: userLoginData.schoolId,
                                                            semesterId: semesterSelect,
                                                            startTime: weekSemesterSelect.weekStartTime,
                                                            endTime: weekSemesterSelect.weekEndTime,
                                                            classId: data.classSession,
                                                            data: [],
                                                        }
                                                        dataModify.data.push(dataNew)
                                                        setTimeTableModify((prevValue) => [...prevValue, dataModify])
                                                    }
                                                    setModifyShow(false)
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            } else {
                timeTable.forEach(itemTimetableCheck => {
                    if (itemTimetableCheck.dayOfWeek === data.dow) {
                        itemTimetableCheck.data.forEach(itemListSession => {
                            if (itemListSession.session === data.session) {
                                itemListSession.subject = data.subject
                                itemListSession.teacher = data.teacher
                                itemListSession.subjectId = data.subjectId
                                itemListSession.teacherId = data.teacherId
                            }
                        })
                        return
                    }
                })

                const dayOfWeekToRemove = data.dow; // dayOfWeek mà bạn muốn xoá
                const sessionToRemove = data.session;   // session mà bạn muốn xoá

                // Sử dụng map để lặp qua mỗi phần tử trong mảng
                const newArray = timeTableModify.map(item => {
                    // Kiểm tra xem dayOfWeek của phần tử hiện tại có trùng với dayOfWeekToRemove không
                    if (item.dayOfWeek === dayOfWeekToRemove) {
                        // Nếu có, sử dụng filter để loại bỏ các đối tượng có session là sessionToRemove
                        return {
                            ...item,
                            data: item.data.filter(session => session.session !== sessionToRemove)
                        };
                    }
                    // Nếu không trùng, trả về phần tử nguyên vẹn
                    return item;
                });
                setTimeTableModify(newArray)
            }

            setModifyShow(false)
        } else if (type === '0') {
            setModifyShow(false)
        }
    }

    const getDataAdd = (type, data) => {
        if (type === '1') {
            const dataTimetableCheck = JSON.parse(JSON.stringify(timeTableTemp))
            let itemSessionExistRoot = false

            dataTimetableCheck.forEach(itemTimetableCheck => {
                if (itemTimetableCheck.dayOfWeek === data.dow) {
                    itemTimetableCheck.data.forEach(itemListSession => {
                        if (itemListSession.session === data.session) {
                            if (itemListSession.subjectId === data.subjectId &&
                                itemListSession.teacherId === data.teacherId) {
                                // if (itemListSession.repeat === data.repeat) {
                                itemSessionExistRoot = true
                                // }
                            }
                        }
                    })
                    return
                }
            })

            if (!itemSessionExistRoot) {
                timeTable.forEach(itemTimetableCheck => {
                    if (itemTimetableCheck.dayOfWeek === data.dow) {
                        itemTimetableCheck.data.forEach(itemListSession => {
                            if (itemListSession.session === data.session) {
                                if (itemListSession.id) {
                                    itemListSession.subject = data.subject
                                    itemListSession.teacher = data.teacher
                                    itemListSession.subjectId = data.subjectId
                                    itemListSession.teacherId = data.teacherId

                                    let isExistDataDow = false
                                    timeTableModify.forEach((elementValue) => {
                                        if (elementValue.dayOfWeek === data.dow) {
                                            let isExistData = false
                                            elementValue.data.forEach((elementData) => {
                                                if (elementData.session === data.session) {
                                                    elementData.subject = itemListSession.subjectId
                                                    elementData.teacherId = itemListSession.teacherId
                                                    elementData.repeat = data.repeat
                                                    elementData.isDelete = 0
                                                    isExistData = true
                                                }
                                            })
                                            if (!isExistData) {
                                                const dataNew = {
                                                    id: data.sessionId,
                                                    session: data.session,
                                                    subject: data.subjectId,
                                                    teacherId: data.teacherId,
                                                    repeat: data.repeat,
                                                    isDelete: 0,
                                                }
                                                elementValue.data.push(dataNew)
                                            }
                                            isExistDataDow = true
                                        }
                                    })
                                    if (!isExistDataDow) {
                                        const dataNew = {
                                            id: data.sessionId,
                                            session: data.session,
                                            subject: data.subjectId,
                                            teacherId: data.teacherId,
                                            repeat: data.repeat,
                                            isDelete: 0,
                                        }
                                        const dataModify = {
                                            dayOfWeek: data.dow,
                                            schoolId: userLoginData.schoolId,
                                            semesterId: semesterSelect,
                                            startTime: weekSemesterSelect.weekStartTime,
                                            endTime: weekSemesterSelect.weekEndTime,
                                            classId: data.classSession,
                                            data: [],
                                        }
                                        dataModify.data.push(dataNew)
                                        setTimeTableModify((prevValue) => [...prevValue, dataModify])
                                    }
                                } else {
                                    timeTable.forEach((timetable) => {
                                        if (timetable.dayOfWeek === data.dow) {
                                            timetable.data.forEach((timtableElement) => {
                                                if (timtableElement.session === data.session) {
                                                    timtableElement.subject = data.subject
                                                    timtableElement.teacher = data.teacher
                                                    timtableElement.subjectId = data.subjectId
                                                    timtableElement.teacherId = data.teacherId

                                                    //add temp list
                                                    let isExistDataDow = false
                                                    timeTableModify.forEach((elementValue) => {
                                                        if (elementValue.dayOfWeek === data.dow) {
                                                            let isExistData = false
                                                            elementValue.data.forEach((elementData) => {
                                                                if (elementData.session === data.session) {
                                                                    elementData.subject = timtableElement.subjectId
                                                                    elementData.teacherId = timtableElement.teacherId
                                                                    elementData.repeat = data.repeat
                                                                    elementData.isNew = 1
                                                                    elementData.isDelete = 0
                                                                    isExistData = true
                                                                }
                                                            })
                                                            if (!isExistData) {
                                                                const dataNew = {
                                                                    id: data.sessionId,
                                                                    session: data.session,
                                                                    subject: data.subjectId,
                                                                    teacherId: data.teacherId,
                                                                    repeat: data.repeat,
                                                                    isNew: 1,
                                                                    isDelete: 0,
                                                                }
                                                                elementValue.data.push(dataNew)
                                                            }
                                                            isExistDataDow = true
                                                        }
                                                    })
                                                    if (!isExistDataDow) {
                                                        const dataNew = {
                                                            id: data.sessionId,
                                                            session: data.session,
                                                            subject: data.subjectId,
                                                            teacherId: data.teacherId,
                                                            repeat: data.repeat,
                                                            isNew: 1,
                                                            isDelete: 0,
                                                        }
                                                        const dataModify = {
                                                            dayOfWeek: data.dow,
                                                            schoolId: userLoginData.schoolId,
                                                            semesterId: semesterSelect,
                                                            startTime: weekSemesterSelect.weekStartTime,
                                                            endTime: weekSemesterSelect.weekEndTime,
                                                            classId: data.classSession,
                                                            data: [],
                                                        }
                                                        dataModify.data.push(dataNew)
                                                        setTimeTableModify((prevValue) => [...prevValue, dataModify])
                                                    }
                                                    setAddSessionShow(false)
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            } else {
                timeTable.forEach(itemTimetableCheck => {
                    if (itemTimetableCheck.dayOfWeek === data.dow) {
                        itemTimetableCheck.data.forEach(itemListSession => {
                            if (itemListSession.session === data.session) {
                                itemListSession.subject = data.subject
                                itemListSession.teacher = data.teacher
                                itemListSession.subjectId = data.subjectId
                                itemListSession.teacherId = data.teacherId
                            }
                        })
                        return
                    }
                })

                const dayOfWeekToRemove = data.dow; // dayOfWeek mà bạn muốn xoá
                const sessionToRemove = data.session;   // session mà bạn muốn xoá

                // Sử dụng map để lặp qua mỗi phần tử trong mảng
                const newArray = timeTableModify.map(item => {
                    // Kiểm tra xem dayOfWeek của phần tử hiện tại có trùng với dayOfWeekToRemove không
                    if (item.dayOfWeek === dayOfWeekToRemove) {
                        // Nếu có, sử dụng filter để loại bỏ các đối tượng có session là sessionToRemove
                        return {
                            ...item,
                            data: item.data.filter(session => session.session !== sessionToRemove)
                        };
                    }
                    // Nếu không trùng, trả về phần tử nguyên vẹn
                    return item;
                });
                setTimeTableModify(newArray)
            }

            setAddSessionShow(false)
        } else if (type === '0') {
            setAddSessionShow(false)
        }
    }

    const handleClose = (type) => {
        if (type === '0') {
            setModifyShow(false)
        }
    }
    const handleCloseAdd = (type) => {
        if (type === '0') {
            setAddSessionShow(false)
        }
    }

    const handleActionClass = (type, date) => {
        if (type === '0') {
            setShowViewDoc(true)
        }
    }

    const handleGetDataEdit = (data) => {
        setCheckChangeSideBar(data)
    }

    const handleGetDataFromChild = (type, data) => {
        if (type === '1') {
            data.classSession = classSession.id
            data.classNameSession = classSession.className
            setDataModifySession(data)
            setModifyShow(true)
        } else if (type === '') {
            setModifyShow(false)
        } else if (type === '2') {
            setShowAddSemester(true)
        } else if (type === '3') {
            setClassSession(data)
        } else if (type === '4') {
            data.classSession = classSession.id
            data.classNameSession = classSession.className
            setDataModifySession(data)
            setAddSessionShow(true)
        } else if (type === '6') {
            setSemesterSelect(data)
        } else if (type === '7') {
            setWeekSemesterSelect(data)
        } else if (type === '8') {
            if (data.length > 0) {
                data.forEach((item) => {
                    item.classId = classSession.id
                    item.semesterId = semesterSelect
                })
                handleSaveTeachingInformation(data) //save teaching information
            }
        } else if (type === '5') {
            if (timeTableModify.length > 0) {
                handleSaveTimeTable(timeTableModify) //save timetable
            }
        } else if (type === '9') {
            if (timeTableModify.length > 0) {
                setTimeTable(JSON.parse(JSON.stringify(timeTableTemp)))
                setTimeTableModify([])
            }
        } else if (type === '0') {
            const dataSession = data.data
            const dataDow = data.dow
            setDeleteObject({
                idObject: 1,
                title: 'Xoá tiết học',
                content: `Bạn có muốn xoá tiết ${dataSession.session} vào thứ ${dataDow} không?`,
                objectDelete: data,
                path: 'api/department/delete/',
            })
            setDeleteShowSession(true)
        }
    }

    const handleAddSemester = (data) => { }

    const handleCloseAddSemester = (data) => {
        if (data === '0') {
            setShowAddSemester(false)
        }
    }
    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowViewDoc(false)
        }
    }

    const handleCloseError = (data) => {
        if (data === 'cancel') {
            setShowPopupError(false)
        }
    }

    const handleClosePopupNotSve = (data) => {
        if (data === '0') {
            setShowErrorEdit(false)
        }
    }

    useEffect(() => {
        handleAccessPage(navigate, 1)
    }, [])

    const propsForTimetable = {
        dataClass: dataClass,
        dataTimeTable: timeTable,
        dataTeacher: dataTeacher,
        dataSemester: semesterData,
        dataWeek: semesterWeekData,
        getDataFromChild: handleGetDataFromChild,
        getDataEdit: handleGetDataEdit,
        timetableGrade: timetableGrade
    }

    return (
        <div id="principal-wrapper">
            <Header showMenuRole={'1'} getDataFromChild={handleShowMenu} />
            <div className="body d-flex">
                <SideBar
                    stateShow={isShowSideBar}
                    children={<SideBarPrincipal getChildrenPage={getChildrenPage} checkChangeSideBar={checkChangeSideBar} />}
                />
                <div
                    style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}
                    className="p-4 w-100 h-100"
                >
                    {pageName === 'review-lesson-plans' && (
                        <PrincipalReviewLessonPlans userLoginData={userLoginData} />
                    )}
                    {pageName === 'lesson-plans' && (
                        <PrincipalViewLessonPlans userLoginData={userLoginData} />
                    )}
                    {pageName === 'subjects' && (
                        <PrincipalViewSubjects
                            userLoginData={userLoginData}
                            getDeleteObject={getDeleteObject}
                        />
                    )}
                    {pageName === 'school-detail' && <SchoolDetail userLoginData={userLoginData} />}
                    {pageName === 'school-year' && (
                        <SchoolYear
                            userLoginData={userLoginData}
                            getDeleteObject={getDeleteObject}
                        />
                    )}
                    {pageName === 'departments' && (
                        <PrincipalViewDepartments
                            userLoginData={userLoginData}
                            getDeleteObject={getDeleteObject}
                        />
                    )}
                    {pageName === 'teachers' && (
                        <PrincipalViewTeachers
                            userLoginData={userLoginData}
                            getDeleteObject={getDeleteObject}
                        />
                    )}
                    {pageName === 'syllabus' && (
                        <PrincipalViewSyllabus userLoginData={userLoginData} />
                    )}

                    {pageName === 'classes' && (
                        <Suspense
                            fallback={
                                <div className="loading">
                                    <div
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            }
                        >
                            <ListClass
                                getDataFromChild={handleActionClass}
                                userLoginData={userLoginData}
                            />
                        </Suspense>
                    )}

                    {pageName === 'timeTable' && (
                        <Suspense
                            fallback={
                                <div className="loading">
                                    <div
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            }
                        >
                            <TimeTable
                                {...propsForTimetable}
                            />
                        </Suspense>
                    )}
                </div>
            </div>
            {deleteShow && (
                <DeleteConfirm
                    getDataFromChild={getDataDelete}
                    messageDelete={deleteObject}
                />
            )}

            {deleteShowSession && (
                <DeleteSessionConfirm
                    getDataFromChild={getDataDeleteSession}
                    messageDelete={deleteObject}
                />
            )}
            {showSuccess && <Success message={msgSuccess} />}

            {modifyShow && (
                <ModifySession
                    dataTeacher={dataTeacher}
                    getDataFromChild={getDataModify}
                    dataModifySession={dataModifySession}
                    handleClose={handleClose}
                />
            )}
            {addSessionShow && (
                <AddSession
                    dataTeacher={dataTeacher}
                    getDataFromChild={getDataAdd}
                    dataModifySession={dataModifySession}
                    handleClose={handleCloseAdd}
                />
            )}
            {showAddSemester && (
                <AddSemester
                    getDataFromChild={handleAddSemester}
                    handleClose={handleCloseAddSemester}
                />
            )}
            {showApplyTimeTable && <ApplyTimetable />}
            {showPopupError && <ErrorPopup handleClose={handleCloseError} errorMsg={errorMsg} />}
            {showErrorEdit && <ErrorPopupNotSave getDataFromChild={handleClosePopupNotSve} errorMsg={errorMsgNotSave} />}
        </div>
    )
}

export default PrincipalPage
