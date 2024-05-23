import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { format, startOfWeek, endOfWeek, addWeeks, isBefore, isAfter, isWithinInterval, parseISO } from 'date-fns';
import SelectDropdown from "./SelectDropdown"
import { dataTimeTableEmpty } from "./Ultilities/CommonFunction"
import ErrorPopup from "./popUp/ErrorPopUp"
import ErrorPopupChange from "./popUp/ErrorPopupChange"
import ErrorPopupNotSave from "./popUp/ErrorPopupNotSave";

const TimeTable = ({ dataTeacher, dataClass, dataTimeTable, dataWeek, dataSemester, getDataFromChild, timetableGrade, getDataEdit }) => {

    const [gradeKey, setGradeKey] = useState(null)
    const [teacherData, setTeacherData] = useState([])
    const [teacherDataTemp, setTeacherDataTemp] = useState([])
    const [timeTableData, setTimeTableData] = useState([])
    const [classData, setClassData] = useState([])
    const [semesterData, setSemesterData] = useState([])
    const [weekData, setWeekData] = useState([])
    const [activeClass, setActiveClass] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [weekDataSelected, setWeekDataSelected] = useState(null)
    const [teachingInformationEdit, setTeachingInformationEdit] = useState([])

    const [heightTop, setHeightTop] = useState('30%')
    const [heightContent, setHeightContent] = useState('68%')
    const widthDataTopTimeTable = ['10%', '40%', '50%']
    const widthDataContentTimeTable = ['30%', '40%', '30%']
    const widthDataTimeTable = ['7%', '15.5%', '15.5%', '15.5%', '15.5%', '15.5%', '15.5%']


    // const [semesterSelect, setSemesterSelect] = useState()
    const [hideHeightTop, setHideHeightTop] = useState(true)
    const [hideHeightContent, setHideHeightContent] = useState(true)
    const [showEditTop, setShowEditTop] = useState(true)
    const [showEditChoose, setShowEditChoose] = useState(true)
    const [showEditTimeTable, setShowEditTimeTable] = useState(false)
    const [showErrorPopup, setShowErrorPopup] = useState(false)
    const [showErrorPopupClass, setShowErrorPopupClass] = useState(false)
    const [showEditBtn, setShowEditBtn] = useState(true)
    const [loadClass, setLoadClass] = useState(true)
    const [loadAssign, setLoadAssign] = useState(true)
    const [semesterSelect, setSemesterSelect] = useState(null)
    const [dataActiveClassChoose, setDataActiveClassChoose] = useState(null)

    useEffect(() => {
        if (dataTeacher.length > 0) {
            setTeacherData(dataTeacher)
            setTeacherDataTemp(JSON.parse(JSON.stringify(dataTeacher)))

            setLoadAssign(false)

        } else {
            setTeacherData([])
            setLoadAssign(false)
        }
    }, [dataTeacher])

    useEffect(() => {
        if (timetableGrade) {
            setGradeKey(timetableGrade)
            setHeightContent('68%')
            setHeightTop('30%')
            setShowEditChoose(true)
            setShowEditTimeTable(false)
            setHideHeightTop(true)

            setHeightTop('30%')
            setHeightContent('68%')
            setShowEditChoose(true)
            setShowEditTop(true)
            setHideHeightContent(true)
            setTeacherData([])
        }
    }, [timetableGrade])

    useEffect(() => {
        // if (dataTimeTable.length > 0) {
        setTimeTableData(dataTimeTable)
        // }
    }, [dataTimeTable])

    useEffect(() => {
        if (dataClass.length > 0) {
            setClassData(dataClass)
            if (gradeKey) {
                const filteredClasses = getClassesByGradeKey(dataClass, gradeKey);
                if (filteredClasses.length > 0) {
                    setActiveClass(filteredClasses[0])
                    setLoadClass(false)
                } else {
                    // setActiveClass(null)
                    setLoadClass(false)
                }
            }
        } else {
            setTimeTableData(dataTimeTableEmpty)
            setTeacherData([])
            setLoadClass(false)
        }
    }, [dataClass, gradeKey])

    useEffect(() => {
        if (dataSemester.length > 0) {
            setSemesterData(dataSemester)
            const currentDate = new Date();
            let checkSemesterYear = false
            dataSemester.forEach(item => {
                const startTime = parseISO(item.startTime); // Thời gian bắt đầu
                const endTime = parseISO(item.endTime); // Thời gian kết thúc


                const isInInterval = isWithinInterval(currentDate, { start: startTime, end: endTime });
                if (isInInterval) {
                    setSemesterSelect(item)
                    checkSemesterYear = true
                    return
                }
            })

            if (!checkSemesterYear) {
                setSemesterSelect(dataSemester[0])
            }
        } else {
            setLoadAssign(false)
        }
    }, [dataSemester])

    useEffect(() => {
        if (dataWeek.length > 0) {
            setWeekData(dataWeek)
        }
    }, [dataWeek])

    useEffect(() => {
        if (weekData.length > 0) {
            const currentWeek = getCurrentWeek();
            const index = weekData.findIndex(week => {

                const startDate = new Date(week.weekStartTime);
                const endDate = new Date(week.weekEndTime);

                const startDateWithoutTime = format(startDate, 'yyyy-MM-dd');;
                const endDateWithoutTime = format(endDate, 'yyyy-MM-dd');;

                const selectedWeek = {
                    start: new Date(startDateWithoutTime),
                    end: new Date(endDateWithoutTime)
                };

                const comparisonResult = checkWeek(currentWeek, selectedWeek);

                return comparisonResult === '3';
            });
            if (index !== -1) {
                setWeekDataSelected(weekData[index]);
            } else {
                setWeekDataSelected(weekData[0]);
                console.log("Không tìm thấy tuần phù hợp trong mảng.");
            }
        }
    }, [weekData])

    function getCurrentWeek() {
        const today = new Date();
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
        return {
            start: format(startOfCurrentWeek, 'yyyy-MM-dd'),
            end: format(endOfCurrentWeek, 'yyyy-MM-dd')
        };
    }

    const getClassesByGradeKey = (classData, gradeKey) => {
        const filteredClasses = [];
        classData.forEach(cls => {
            if (cls.grade === gradeKey) {
                filteredClasses.push(cls);
            }
        });
        return filteredClasses;
    }

    const chooseClass = (data) => {
        if (heightContent === '90%' || heightTop === '90%') {
            setErrorMsg('Bạn đang chỉnh sửa. Vui lòng lưu trước khi chuyển trang!')
            setShowErrorPopupClass(true)
            setDataActiveClassChoose(data)
        } else {
            setLoadAssign(true)
            setTimeTableData(dataTimeTableEmpty)
            getDataFromChild('3', data)
            getDataEdit(false)
            setActiveClass(data)
            if (dataSemester.length <= 0) {
                setLoadAssign(false)
            }
        }
    }

    const handleDataSelectedSemester = (data) => {
        setSemesterSelect(data)
        getDataFromChild('6', data.id)
    }

    const handleEditClick = (sessionInfor, dow) => {
        const data = {
            'classSession': '',
            'classNameSession': '',
            'dow': dow,
            'sessionId': sessionInfor.id,
            'session': sessionInfor.session,
            "subject": sessionInfor.subject,
            "teacher": sessionInfor.teacher,
            "subjectId": sessionInfor.subjectId,
            "teacherId": sessionInfor.teacherId,
            "repeat": 2
        }
        getDataFromChild('1', data)
    }

    const handleAddSession = (sessionInfor, dow) => {
        const data = {
            'classSession': '',
            'classNameSession': '',
            'dow': dow,
            'sessionId': sessionInfor.id,
            'session': sessionInfor.session,
            "subject": sessionInfor.subject,
            "teacher": sessionInfor.teacher,
            "subjectId": sessionInfor.subjectId,
            "teacherId": sessionInfor.teacherId,
            "repeat": 2
        }
        getDataFromChild('4', data)
    }

    const handleClearClick = (data, dowData) => {
        const dataClear = {
            data: data,
            dow: dowData
        }
        getDataFromChild('0', dataClear)
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

    const handleDataSelectedWeek = (data) => {
        setWeekDataSelected(data)
        const currentWeek = getCurrentWeek();
        const selectedWeek = {
            start: new Date(data.weekStartTime),
            end: new Date(data.weekEndTime)
        };

        const comparisonResult = checkWeek(currentWeek, selectedWeek);
        if (comparisonResult === '2') {
            setShowEditBtn(false)
        } else {
            setShowEditBtn(true)
        }

        getDataFromChild('7', data)
    }

    const handleChange = (data) => {
        if (data === '1') {
            if (heightContent === '90%') {
                getDataFromChild('5', '')

                setHeightContent('68%')
                setHeightTop('30%')
                setShowEditTimeTable(false)
                setHideHeightTop(true)

                setHeightTop('90%')
                setHeightContent('8%')
                setShowEditTop(false)
                setHideHeightContent(false)
                setTeachingInformationEdit([])
                setShowErrorPopup(false)
                getDataEdit(false)
            } else if (heightTop === '90%') {
                getDataFromChild('8', teachingInformationEdit)
                setHeightTop('30%')
                setHeightContent('68%')
                setShowEditTop(true)
                setHideHeightContent(true)
                setTeachingInformationEdit([])

                setHeightContent('90%')
                setHeightTop('8%')
                setShowEditTimeTable(true)
                setHideHeightTop(false)
                setShowErrorPopup(false)
                getDataEdit(false)

            }
        } else if (data === '0') {
            setShowErrorPopup(false)
        }
    }

    const handleChangeClass = (data) => {
        if (data === '1') {
            if (heightContent === '90%') {
                getDataFromChild('5', '')

                setHeightContent('68%')
                setHeightTop('30%')
                setShowEditTimeTable(false)
                setHideHeightTop(true)

                setShowErrorPopupClass(false)
                setActiveClass(dataActiveClassChoose)
                getDataEdit(false)
            } else if (heightTop === '90%') {
                getDataFromChild('8', teachingInformationEdit)

                setHeightTop('30%')
                setHeightContent('68%')
                setShowEditTop(true)
                setHideHeightContent(true)
                setTeachingInformationEdit([])

                setShowErrorPopupClass(false)
                setActiveClass(dataActiveClassChoose)
                getDataEdit(false)

            }
        } else if (data === '0') {
            setShowErrorPopupClass(false)
        }
    }

    const HandleEditAssignTeacher = () => {
        if (heightContent === '90%') {
            setErrorMsg('Bạn có thay đổi chưa lưu. Bạn có muốn lưu không?')
            setShowErrorPopup(true)
        } else {
            setHeightTop('90%')
            setHeightContent('8%')
            setShowEditTop(false)
            setHideHeightContent(false)
            setShowEditChoose(false)
            setTeachingInformationEdit([])
            getDataEdit(true)
        }
    }

    const HandleEditTimeTable = () => {
        if (heightTop === '90%') {
            setErrorMsg('Bạn có thay đổi chưa lưu. Bạn có muốn lưu không?')
            setShowErrorPopup(true)
        } else {
            setHeightContent('90%')
            setHeightTop('8%')
            setShowEditChoose(false)
            setShowEditTimeTable(true)
            setHideHeightTop(false)
            getDataEdit(true)
        }

    }

    const HandleSaveAssignTeacher = () => {
        const dataTemp = []
        teachingInformationEdit.forEach(item => {
            if (item.teacherId !== 0) {
                dataTemp.push(item)
            }
        })
        getDataFromChild('8', dataTemp)
        setHeightTop('30%')
        setHeightContent('68%')
        setShowEditChoose(true)
        setShowEditTop(true)
        setHideHeightContent(true)
        getDataEdit(false)
        setTeachingInformationEdit([])

    }
    const HandleCancelAssignTeacher = () => {
        setHeightTop('30%')
        setHeightContent('68%')
        setShowEditChoose(true)
        setShowEditTop(true)
        setHideHeightContent(true)
        getDataEdit(false)
        setTeacherData(JSON.parse(JSON.stringify(teacherDataTemp)))

    }

    const HandleSaveTimeTable = () => {
        setHeightContent('68%')
        setHeightTop('30%')
        setShowEditChoose(true)
        setShowEditTimeTable(false)
        setHideHeightTop(true)
        getDataFromChild('5', '')
        getDataEdit(false)

    }
    const HandleCancelTimeTable = () => {
        setHeightContent('68%')
        setHeightTop('30%')
        setShowEditChoose(true)
        setShowEditTimeTable(false)
        setHideHeightTop(true)
        getDataFromChild('9', '')
        getDataEdit(false)
    }

    const [currentSubjectCheck, setCurrentSubjectCheck] = useState(null)

    const handleClickTeachingInformation = (data) => {
        if (!currentSubjectCheck) {
            setCurrentSubjectCheck(data.subjectId)
        } else {
            if (currentSubjectCheck !== data.subjectId) {
                setCurrentSubjectCheck(data.subjectId)
            }
        }

        const exist = teachingInformationEdit.map(item => item.subjectId).includes(data.subjectId)
        if (!exist) {
            const dataTeaching = {
                "id": data.id,
                "classId": 0,
                "subjectId": data.subjectId,
                "semesterId": 0,
                "teacherId": 0,
                "weekStartDate": weekDataSelected.weekStartTime,
                "weekEndDate": weekDataSelected.weekEndTime
            }
            setTeachingInformationEdit(prev => [...prev, dataTeaching])
        }
    }

    const handelSelectTeacherUpdate = (data) => {
        if (currentSubjectCheck) {
            teacherData.forEach(itemTeacher => {
                if (itemTeacher.subjectId === currentSubjectCheck) {
                    itemTeacher.teacherId = data.id
                    itemTeacher.name = data.name
                }
            })

            teachingInformationEdit.forEach(item => {
                if (item.subjectId === currentSubjectCheck) {
                    item.teacherId = data.id
                }
            })
        }
    }


    return (
        <div id="timeTable-wrapper">
            <div className="timeTableBorder">
                <div className="leftTimeTable">
                    <div className="titleLeftTimeTable">
                        <p>Lớp</p>
                    </div>
                    <div className="contentLeftTimeTable">
                        {!loadClass
                            ? (<>
                                {(dataClass.length > 0)
                                    ?
                                    (classData.map((cls) => (
                                        cls.grade === gradeKey && (
                                            <div onClick={() => chooseClass(cls)}
                                                className={`className ${activeClass.id === cls.id ? 'active' : ''}`}>
                                                <p>{cls.className}</p>
                                            </div>
                                        )
                                    )))
                                    :
                                    (
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                            <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                        </div>
                                    )
                                }
                            </>)
                            : (<>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '40px', marginTop: '1rem' }} className='noContent'>
                                    <Icon icon="eos-icons:loading" style={{ color: '#FF4F00' }} />
                                </div>
                            </>)
                        }
                    </div>
                </div>

                <div className="rightTimeTable">
                    <div style={{ height: heightTop }} className="topRightTimeTable">
                        <div style={!hideHeightTop ? { height: '100%' } : {}} className="titleTopRightTimeTable">
                            <div className="leftHeader"></div>
                            <p>Phân công giảng dạy bộ môn</p>

                            {showEditTop ? (<div className="rightHeader">
                                {dataClass.length > 0 && dataSemester.length > 0 && showEditBtn ?
                                    <button onClick={() => HandleEditAssignTeacher()}>Chỉnh sửa</button>
                                    :
                                    <button style={{ backgroundColor: '#b66156' }}>Chỉnh sửa</button>
                                }

                            </div>)
                                :
                                (<div className="rightHeader">
                                    <button className="cancelBtn" onClick={() => HandleCancelAssignTeacher()}>Huỷ</button>
                                    <button className="saveBtn" onClick={() => HandleSaveAssignTeacher()}>Lưu</button>
                                </div>)
                            }

                        </div>
                        {!loadAssign
                            ? (<>
                                {hideHeightTop && <div className="contentTopRightTimeTable">
                                    {showEditTop ? <div className="borderTopRightTimeTable">
                                        {teacherData.length > 0
                                            ? (teacherData.map((teacher, index) => (
                                                <div className="teacherRow">
                                                    <div style={{ width: widthDataTopTimeTable[0] }} className="numberName">
                                                        <p>{index + 1}</p>
                                                    </div>
                                                    <div style={{ width: widthDataTopTimeTable[1] }} className="subjectName">
                                                        <p>{teacher.subject}</p>
                                                    </div>
                                                    <div style={{ width: widthDataTopTimeTable[2] }} className="teacherName">
                                                        <p>{teacher.name}</p>
                                                    </div>
                                                </div>
                                            )))

                                            : (
                                                <>{semesterData.length > 0
                                                    ? (<>
                                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                                            <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                                            <p style={{ fontSize: '18px' }}>Không có dữ liệu</p>
                                                        </div>
                                                    </>)
                                                    : (<>
                                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                                            <Icon icon="line-md:alert-circle" style={{ fontSize: '25px' }} />
                                                            <p style={{ fontSize: '18px' }}>Vui lòng chọn năm học</p>
                                                        </div>
                                                    </>)
                                                }
                                                </>
                                            )}
                                    </div>
                                        :
                                        <div className="borderTopRightTimeTable">
                                            {teacherData.map((teacher, index) => (
                                                <div className="teacherRow">
                                                    <div style={{ width: widthDataTopTimeTable[0] }} className="numberName">
                                                        <p>{index + 1}</p>
                                                    </div>
                                                    <div style={{ width: widthDataTopTimeTable[1] }} className="subjectName">
                                                        <p>{teacher.subject}</p>
                                                    </div>
                                                    <div style={{ width: widthDataTopTimeTable[2] }} className="teacherName">
                                                        <div className="selectTeacher" onClick={() => {
                                                            handleClickTeachingInformation(teacher)
                                                        }}>
                                                            <SelectDropdown color={'black'} label={'Chọn giáo viên'}
                                                                getDataFromChild={handelSelectTeacherUpdate} optionList={teacher.selectTeacherList}
                                                                dataUpdate={{ 'id': teacher.teacherId }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>}
                                </div>}
                            </>)
                            : (<>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '40px', marginTop: '1rem' }} className='noContent'>
                                    <Icon icon="eos-icons:loading" style={{ color: '#FF4F00' }} />
                                </div>
                            </>)
                        }

                    </div>

                    <div style={{ height: heightContent }} className="contentRightTimeTable">
                        <div style={!hideHeightContent ? { height: '100%' } : {}} className="titleContentRightTimeTable">
                            <div style={{ width: widthDataContentTimeTable[0] }} className="selectSemester">
                                {showEditChoose
                                    ? (
                                        <>
                                            <div className="borderSemesterSelect">
                                                <SelectDropdown label={'Chọn năm học'} optionList={semesterData}
                                                    getDataFromChild={handleDataSelectedSemester}
                                                    dataUpdate={semesterSelect}
                                                />
                                            </div>
                                            <div className="borderSemesterSelect weekSelect" >
                                                <SelectDropdown label={'Chọn tuần'} optionList={weekData}
                                                    getDataFromChild={handleDataSelectedWeek}
                                                    dataUpdate={weekDataSelected}
                                                />
                                            </div>
                                        </>
                                    )
                                    : (<>
                                        <div className="borderSemesterSelectFlase">
                                            <div>{semesterData[0].name}</div>
                                        </div>
                                        <div className="borderSemesterSelectFlase weekSelect" >
                                            <div>{weekDataSelected.name}</div>
                                        </div>
                                    </>)
                                }

                            </div>
                            <div style={{ width: widthDataContentTimeTable[1] }} className="titleCenterHeader">
                                {showEditTimeTable ?
                                    <p>Chỉnh sửa thời khoá biểu</p>
                                    :
                                    <p>Thời khoá biểu</p>
                                }
                            </div>
                            {showEditTimeTable ?
                                (<div style={{ width: widthDataContentTimeTable[2] }} className="btnEditHeader">
                                    <button className="cancelBtn" onClick={() => HandleCancelTimeTable()}>Huỷ</button>
                                    <button className="saveBtn" onClick={() => HandleSaveTimeTable()}>Lưu</button>

                                </div>)
                                :
                                (<div style={{ width: widthDataContentTimeTable[2] }} className="btnEditHeader">
                                    {dataClass.length > 0 && dataSemester.length > 0 && showEditBtn ?
                                        <button onClick={() => HandleEditTimeTable()}>Chỉnh sửa</button>
                                        :
                                        <button style={{ backgroundColor: '#b66156' }}>Chỉnh sửa</button>
                                    }
                                </div>)
                            }
                        </div>
                        {hideHeightContent && <div className="contentContentRightTimeTable">
                            <div className="borderContentRightTimeTable">
                                <div className="topTimeTable">
                                    <div style={{ width: widthDataTimeTable[0] }} className="slot">
                                        <p>Tiết</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[1] }} className="t2">
                                        <p>T2</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[2] }} className="t3">
                                        <p>T3</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[3] }} className="t4">
                                        <p>T4</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[4] }} className="t5">
                                        <p>T5</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[5] }} className="t6">
                                        <p>T6</p>
                                    </div>
                                    <div style={{ width: widthDataTimeTable[6] }} className="t7">
                                        <p>T7</p>
                                    </div>
                                </div>
                                <div className="contentTimeTable">
                                    {showEditTimeTable ?
                                        (<div className="borderTimeTable">
                                            <div style={{ width: widthDataTimeTable[0] }} className="slot borderSession session">
                                                {Array.from({ length: 5 }, (_, index) => index + 1).map(number => (
                                                    <div className={`dataSessionNumberSlot ${(number) % 2 === 0 ? 'odd-row' : 'even-row'} ${(number) === 5 ? 'dataSessionSlot' : ''}`}>
                                                        <div className="subjectName">
                                                            <p>{number}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {timeTableData.map((timetable, index) => (
                                                <>
                                                    {timetable.dayOfWeek === 2 && (
                                                        <div style={{ width: widthDataTimeTable[1] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <>
                                                                    <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>

                                                                        <div className="dataBinded">
                                                                            <div className="subjectName">
                                                                                <p>{timetableDow.subject}</p>
                                                                            </div>

                                                                            <div className="teacherName">
                                                                                <p>{timetableDow.teacher}</p>
                                                                            </div>
                                                                        </div>

                                                                        {timetableDow.subject ? (<div className="actionEditSession">
                                                                            <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                                <p>Chỉnh sửa</p>
                                                                            </div>

                                                                            <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                                <p>Xoá</p>
                                                                            </div>
                                                                        </div>)
                                                                            :
                                                                            (<div className="actionEditSession">
                                                                                <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                    <p>Thêm</p>
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 3 && (
                                                        <div style={{ width: widthDataTimeTable[2] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <>
                                                                    <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>

                                                                        <div className="dataBinded">
                                                                            <div className="subjectName">
                                                                                <p>{timetableDow.subject}</p>
                                                                            </div>

                                                                            <div className="teacherName">
                                                                                <p>{timetableDow.teacher}</p>
                                                                            </div>
                                                                        </div>

                                                                        {timetableDow.subject ? (<div className="actionEditSession">
                                                                            <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                                <p>Chỉnh sửa</p>
                                                                            </div>

                                                                            <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                                <p>Xoá</p>
                                                                            </div>
                                                                        </div>)
                                                                            :
                                                                            (<div className="actionEditSession">
                                                                                <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                    <p>Thêm</p>
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 4 && (
                                                        <div style={{ width: widthDataTimeTable[3] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <>
                                                                    <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>

                                                                        <div className="dataBinded">
                                                                            <div className="subjectName">
                                                                                <p>{timetableDow.subject}</p>
                                                                            </div>

                                                                            <div className="teacherName">
                                                                                <p>{timetableDow.teacher}</p>
                                                                            </div>
                                                                        </div>

                                                                        {timetableDow.subject ? (<div className="actionEditSession">
                                                                            <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                                <p>Chỉnh sửa</p>
                                                                            </div>

                                                                            <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                                <p>Xoá</p>
                                                                            </div>
                                                                        </div>)
                                                                            :
                                                                            (<div className="actionEditSession">
                                                                                <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                    <p>Thêm</p>
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 5 && (
                                                        <div style={{ width: widthDataTimeTable[4] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <>
                                                                    <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>

                                                                        <div className="dataBinded">
                                                                            <div className="subjectName">
                                                                                <p>{timetableDow.subject}</p>
                                                                            </div>

                                                                            <div className="teacherName">
                                                                                <p>{timetableDow.teacher}</p>
                                                                            </div>
                                                                        </div>

                                                                        {timetableDow.subject ? (<div className="actionEditSession">
                                                                            <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                                <p>Chỉnh sửa</p>
                                                                            </div>

                                                                            <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                                <p>Xoá</p>
                                                                            </div>
                                                                        </div>)
                                                                            :
                                                                            (<div className="actionEditSession">
                                                                                <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                    <p>Thêm</p>
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 6 && (
                                                        <div style={{ width: widthDataTimeTable[5] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <>
                                                                    <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>

                                                                        <div className="dataBinded">
                                                                            <div className="subjectName">
                                                                                <p>{timetableDow.subject}</p>
                                                                            </div>

                                                                            <div className="teacherName">
                                                                                <p>{timetableDow.teacher}</p>
                                                                            </div>
                                                                        </div>

                                                                        {timetableDow.subject ? (<div className="actionEditSession">
                                                                            <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                                <p>Chỉnh sửa</p>
                                                                            </div>

                                                                            <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                                <p>Xoá</p>
                                                                            </div>
                                                                        </div>)
                                                                            :
                                                                            (<div className="actionEditSession">
                                                                                <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                    <p>Thêm</p>
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 7 && (
                                                        <div style={{ width: widthDataTimeTable[6] }} className="borderSession">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSessionHover editSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'} ${innerIndex === 4 ? 'dataSessionT7' : ''}`} key={innerIndex}>
                                                                    <div className="dataBinded">
                                                                        <div className="subjectName">
                                                                            <p>{timetableDow.subject}</p>
                                                                        </div>

                                                                        <div className="teacherName">
                                                                            <p>{timetableDow.teacher}</p>
                                                                        </div>
                                                                    </div>

                                                                    {timetableDow.subject ? (<div className="actionEditSession">
                                                                        <div onClick={() => handleEditClick(timetableDow, timetable.dayOfWeek)} className="hoverEditSession">
                                                                            <p>Chỉnh sửa</p>
                                                                        </div>

                                                                        <div onClick={() => handleClearClick(timetableDow, timetable.dayOfWeek)} className="hoverDeleteSession">
                                                                            <p>Xoá</p>
                                                                        </div>
                                                                    </div>)
                                                                        :
                                                                        (<div className="actionEditSession">
                                                                            <div className="hoverAddSession" onClick={() => handleAddSession(timetableDow, timetable.dayOfWeek)}>
                                                                                <p>Thêm</p>
                                                                            </div>
                                                                        </div>)
                                                                    }
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </div>)
                                        :
                                        (<div className="borderTimeTable">
                                            <div style={{ width: widthDataTimeTable[0] }} className="slot borderSession session">
                                                {Array.from({ length: 5 }, (_, index) => index + 1).map(number => (
                                                    <div className={`dataSessionNumberSlot ${(number) % 2 === 0 ? 'odd-row' : 'even-row'} ${(number) === 5 ? 'dataSessionSlot' : ''}`}>
                                                        <div className="subjectName">
                                                            <p>{number}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {timeTableData.map((timetable, index) => (
                                                <>
                                                    {timetable.dayOfWeek === 2 && (
                                                        <div style={{ width: widthDataTimeTable[1] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 3 && (
                                                        <div style={{ width: widthDataTimeTable[2] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 4 && (
                                                        <div style={{ width: widthDataTimeTable[3] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 5 && (
                                                        <div style={{ width: widthDataTimeTable[4] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 6 && (
                                                        <div style={{ width: widthDataTimeTable[5] }} className="borderSession session">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {timetable.dayOfWeek === 7 && (
                                                        <div style={{ width: widthDataTimeTable[6] }} className="borderSession">
                                                            {timetable.data.map((timetableDow, innerIndex) => (
                                                                <div className={`dataSession ${(innerIndex) % 2 === 0 ? 'even-row' : 'odd-row'} ${innerIndex === 4 ? 'dataSessionT7' : ''}`} key={innerIndex}>
                                                                    <div className="subjectName">
                                                                        <p>{timetableDow.subject}</p>
                                                                    </div>

                                                                    <div className="teacherName">
                                                                        <p>{timetableDow.teacher}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </div>)
                                    }
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            {showErrorPopup && <ErrorPopupChange getDataFromChild={handleChange} errorMsg={errorMsg} />}
            {showErrorPopupClass && <ErrorPopupNotSave getDataFromChild={handleChangeClass} errorMsg={errorMsg} />}
        </div>
    )
}

export default TimeTable