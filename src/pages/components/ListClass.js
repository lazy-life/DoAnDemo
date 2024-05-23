import React, { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import SelectDropdown from "./SelectDropdown"
import axios from "axios"
import { url } from "../../Config/config"
import { Alert } from "antd"
import ErrorPopup from "./popUp/ErrorPopUp"
import Success from "./popUp/Success"
import DeleteConfirm from "./popUp/DeleteConfirm"
import { handleDecrypt } from "./Ultilities/CommonFunction"


const ListClass = ({ getDataFromChild, userLoginData }) => {

    const titleData = ['Khối', 'Tên lớp', 'Giáo viên chủ nhiệm', 'Giáo viên giảng dạy']
    const titleWidthData = ['20%', '25%', '25%', '30%']

    const [userLoginValue, setUserLoginValue] = useState(null)
    const [levelSchool, setLevelSchool] = useState(null)
    const [activeOption, setActiveOption] = useState(null)
    const [activeClass, setActiveClass] = useState(null)
    const [showAddNewClass, setShowAddNewClass] = useState(false)
    const [showAddNewButton, setShowAddNewButton] = useState(true)
    const [showEditClass, setShowEditClass] = useState(false)
    const [showPopupError, setShowPopupError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [deleteShow, setDeleteShow] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [inputValueModify, setInputValueModify] = useState('');

    const [loadClass, setLoadClass] = useState(true)
    const [loadHomeroomTeacher, setLoadHomeroomTeacher] = useState(true)
    const [loadTeaching, setLoadTeaching] = useState(true)

    const [nameClass, setNameClass] = useState('')
    const [teacherSelect, setTeacherSelect] = useState('')
    const [gradeData, setGradeData] = useState([])
    const [classData, setClassData] = useState([])
    const [teacherOfClassData, setTeacherOfClassData] = useState([])
    const [notHomeroomTeacher, setNotHomeroomTeacher] = useState([])
    const [notHomeroomTeacherTemp, setNotHomeroomTeacherTemp] = useState([])
    const [homeRoomTeacherData, setHomeRoomTeacherData] = useState({})
    const [selectedTeacherClass, setSelectedTeacherClass] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [deleteObject, setDeleteObject] = useState({})
    const [classSelectedChoosen, setClassSelectedChoosen] = useState(null)

    const inputRef = useRef(null)

    const gradeDataList = [
        {
            id: 6,
            level: 2,
            gradeKey: 'grade6',
            name: 'Khối 6'
        },
        {
            id: 7,
            level: 2,
            gradeKey: 'grade7',
            name: 'Khối 7'
        },
        {
            id: 8,
            level: 2,
            gradeKey: 'grade8',
            name: 'Khối 8'
        },
        {
            id: 9,
            level: 2,
            gradeKey: 'grade9',
            name: 'Khối 9'
        },
        {
            id: 10,
            level: 3,
            gradeKey: 'grade10',
            name: 'Khối 10'
        },
        {
            id: 11,
            level: 3,
            gradeKey: 'grade11',
            name: 'Khối 11'
        },
        {
            id: 12,
            level: 3,
            gradeKey: 'grade12',
            name: 'Khối 12'
        }
    ]


    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value in state
    };

    const handleInputChangeModify = (event) => {
        setInputValueModify(event.target.value); // Update input value in state
    };

    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
            setLevelSchool(userLoginData.schoolLevel)
            const dataGrade = []
            gradeDataList.forEach(item => {
                if (item.level === userLoginData.schoolLevel) {
                    dataGrade.push(item)
                }
            })

            setGradeData(dataGrade)
            setActiveOption(dataGrade[0].id)
            if (userLoginData.schoolId && dataGrade[0].id) {
                fetchDataClass(userLoginData.schoolId, dataGrade[0].id)
                fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
            }
        }
    }, [userLoginData])

    useEffect(() => {
        if (activeClass) {
            setLoadTeaching(true)
            fetchDataTeacherOfClass(activeClass)
        }
    }, [activeClass])


    const chooseOption = (id) => {
        setInputValue('')
        setInputValueModify('')
        setSelectedTeacherClass(null)
        setActiveOption(id)
        setClassData([])
        setHomeRoomTeacherData(null)
        setLoadClass(true)
        setLoadTeaching(true)
        fetchDataClass(userLoginData.schoolId, id)
    }

    const chooseClass = (classItem) => {
        setInputValue('')
        setSelectedTeacherClass(null)
        setShowAddNewButton(true)
        setShowEditClass(false)
        setShowAddNewClass(false)

        setShowAddNewButton(true)
        setShowEditClass(false)
        setShowAddNewClass(false)

        setClassSelectedChoosen(classItem)
        setActiveClass(classItem.id)
        setHomeRoomTeacherData(classItem.homeroomTeacher)
    }

    const chooseEdit = (data) => {
        setClassSelectedChoosen(data)
        setHomeRoomTeacherData(data.homeroomTeacher)
        setActiveClass(data.id)
        setInputValueModify(data.className)
        setTeacherSelect(data.homeroomTeacher)
        setNotHomeroomTeacherTemp([])
        const foundObject = notHomeroomTeacher.find(item => item.id === data.homeroomTeacher.id);
        if (!foundObject) {
            notHomeroomTeacher.forEach(item => {
                setNotHomeroomTeacherTemp(prev => [item, ...prev])
            })
            setNotHomeroomTeacherTemp(prev => [data.homeroomTeacher, ...prev])
        }
        setShowEditClass(true)
        setShowAddNewButton(false)
        setShowAddNewClass(false)
        setActiveClass(data.id)
    }

    const chooseDelete = (data) => {
        setActiveClass(data.id)
        setDeleteShow(true)
        setDeleteObject({
            idObject: 1,
            title: 'Xoá lớp',
            content: `Bạn có muốn xoá lớp ${data.className} không?`,
            path: ''
        })
    }
    const handleDataSelectedTeacher = (data) => {
        setSelectedTeacherClass(data)
    }

    const handleDataSelectedTeacherModify = (data) => {
        setTeacherSelect(data)
    }

    const handleCloseError = (data) => {
        if (data === 'cancel') {
            setShowPopupError(false)
        }
    }

    const getDataDelete = (data) => {
        if (data === 'delete') {
            if (activeClass) {
                deleteClassData(activeClass)
            }
        } else if (data === 'cancel') {
            setDeleteShow(false)
        }
    }

    const closeEditClass = () => {
        setNotHomeroomTeacherTemp([])
        setShowAddNewButton(true)
        setShowEditClass(false)
        setShowAddNewClass(false)
    }

    const addNewClass = () => {
        setShowAddNewClass(true)
        setShowAddNewButton(false)
        setShowEditClass(false)
    }
    const closeNewClass = () => {
        setInputValue('')
        setSelectedTeacherClass(null)
        setNotHomeroomTeacherTemp([])
        setShowAddNewButton(true)
        setShowEditClass(false)
        setShowAddNewClass(false)
    }

    const saveEditClass = () => {
        if (!teacherSelect) {
            setErrorMsg('Vui lòng chọn giáo viên chủ nhiệm')
            setShowPopupError(true)
        } else if (!inputValueModify) {
            setErrorMsg('Vui lòng nhập tên lớp')
            setShowPopupError(true)
        } else {
            if (classSelectedChoosen) {
                if (classSelectedChoosen.className.toUpperCase().trim() === inputValueModify.toUpperCase().trim()) {
                    const dataRequest = {
                        "id": activeClass,
                        "className": inputValueModify.toUpperCase(),
                        "grade": activeOption,
                        "schoolId": userLoginData.schoolId,
                        "homeroomTeacher": teacherSelect
                    }
                    updateClassData(dataRequest)
                    setNotHomeroomTeacherTemp([])
                } else {
                    const foundObject = classData.find(item => item.className.toUpperCase().trim() === inputValueModify.toUpperCase().trim());
                    if (foundObject) {
                        setErrorMsg(`Lớp ${inputValueModify.toUpperCase()} đã tồn tại. Vui lòng đặt tên lớp khác`)
                        setShowPopupError(true)
                    } else {
                        const dataRequest = {
                            "id": activeClass,
                            "className": inputValueModify.toUpperCase(),
                            "grade": activeOption,
                            "schoolId": userLoginData.schoolId,
                            "homeroomTeacher": teacherSelect
                        }
                        updateClassData(dataRequest)
                    }
                }
            }
        }
    }

    const handleSaveClass = () => {
        if (!selectedTeacherClass) {
            setErrorMsg('Vui lòng chọn giáo viên chủ nhiệm')
            setShowPopupError(true)
        } else if (!inputValue) {
            setErrorMsg('Vui lòng nhập tên lớp')
            setShowPopupError(true)
        } else {
            const foundObject = classData.find(item => item.className.toUpperCase().trim() === inputValue.toUpperCase().trim());
            if (foundObject) {
                setErrorMsg(`Lớp ${inputValue.toUpperCase()} đã tồn tại. Vui lòng đặt tên lớp khác`)
                setShowPopupError(true)
            } else {
                const dataRequest = {
                    "id": 0,
                    "className": inputValue.toUpperCase(),
                    "grade": activeOption,
                    "schoolId": userLoginData.schoolId,
                    "homeroomTeacher": selectedTeacherClass
                }
                addClassData(dataRequest)
            }
        }
    }

    const defaultAddNewClass = () => {
        setShowAddNewButton(true)
        setShowEditClass(false)
        setShowAddNewClass(false)
    }

    useEffect(() => {
        defaultAddNewClass()
    }, [activeOption])

    useEffect(() => {
        if (showAddNewClass) {
            inputRef.current.focus();
        }
    }, [showAddNewClass]);

    const fetchDataClass = (schoolId, grade) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(
                    url + `api/Class/GetListClassOfSchoolByGrade/${schoolId}/${grade}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setClassData(response.data)
                        setActiveClass(response.data[0].id)
                        setHomeRoomTeacherData(response.data[0].homeroomTeacher)
                        setLoadClass(false)
                    }
                })
                .catch((error) => {
                    // Handle error
                    setClassData([])
                    setActiveClass([])
                    setHomeRoomTeacherData(null)
                    setLoadClass(false)
                    console.error('Error:', error)
                })
        }
    }

    const addClassData = (requestData) => {
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
            const apiUrl = url + 'api/Class/CreateClass'
            axios
                .post(apiUrl, requestData, config)
                .then((response) => {
                    setMsgSuccess('Lưu thành công')
                    setShowSuccess(true)
                    fetchDataClass(userLoginData.schoolId, activeOption)
                    fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                    closeNewClass()

                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                    }, 1300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    setErrorMsg(error.response.data)
                    setShowPopupError(true)
                    fetchDataClass(userLoginData.schoolId, activeOption)
                    fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                    closeNewClass()
                    console.error('Error:', error.response.data)
                })
        }
    }

    const updateClassData = (requestData) => {
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
            const apiUrl = url + 'api/Class/UpdateClass'
            axios
                .put(apiUrl, requestData, config)
                .then((response) => {
                    setMsgSuccess('Lưu thành công')
                    setShowSuccess(true)
                    fetchDataClass(userLoginData.schoolId, activeOption)
                    fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                    closeNewClass()

                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                    }, 1300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    setErrorMsg(error.response.data)
                    setShowPopupError(true)
                    fetchDataClass(userLoginData.schoolId, activeOption)
                    fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                    closeNewClass()
                    console.error('Error:', error.response.data)
                })
        }
    }

    const fetchDataTeacherOfClass = (classId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(
                    url + `api/TeachingInfor/GetListTeacherTeachingByCLassId/${classId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setTeacherOfClassData(response.data)
                        setLoadTeaching(false)

                    }
                })
                .catch((error) => {
                    // Handle error
                    setTeacherOfClassData([])
                    setLoadTeaching(false)
                    console.error('Error:', error)
                })
        }
    }

    const fetchDataNotHoomeroomTeacher = (schoolId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(
                    url + `api/User/GetNotHomeRoomTeachersOfSchoolToSelect/${schoolId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setNotHomeroomTeacher(response.data)

                    }
                })
                .catch((error) => {
                    // Handle error
                    setNotHomeroomTeacher([])
                    console.error('Error:', error)
                })
        }
    }

    const deleteClassData = (classId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .delete(
                    url + `api/Class/DeleteClass/${classId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                }
                )
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setMsgSuccess('Xoá thành công')
                        setShowSuccess(true)
                        fetchDataClass(userLoginData.schoolId, activeOption)
                        fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                        closeNewClass()

                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                            setDeleteShow(false)
                        }, 1300)

                        return () => {
                            clearTimeout(timeout)
                        }
                    }
                })
                .catch((error) => {
                    // Handle error
                    setErrorMsg(error.response.data)
                    setShowPopupError(true)
                    fetchDataClass(userLoginData.schoolId, activeOption)
                    fetchDataNotHoomeroomTeacher(userLoginData.schoolId)
                    closeNewClass()
                    console.error('Error:', error)
                })
        }
    }

    return (
        <div id="listClass-wrapper">
            <div className="listClassBorder">
                <div className="topContent">
                    <div style={{ width: titleWidthData[0] }} className="gradeTopContent titleContent">
                        <p>{titleData[0]}</p>
                    </div>
                    <div style={{ width: titleWidthData[1] }} className="classNameTopContent titleContent">
                        <p>{titleData[1]}</p>
                    </div>
                    <div style={{ width: titleWidthData[2] }} className="homeroomTeacherTopContent titleContent">
                        <p>{titleData[2]}</p>
                    </div>
                    <div style={{ width: titleWidthData[3], borderRight: 'none' }} className="modifyClassTopContent titleContent">
                        <p>{!showAddNewClass && !showEditClass && titleData[3]}</p>
                    </div>
                </div>
                <div className="content">
                    <div style={{ width: titleWidthData[0] }} className="gradeContent">
                        {gradeData.map((grade, index) => (
                            grade.level === levelSchool && (
                                <div
                                    onClick={() => chooseOption(grade.id)}
                                    className={`gradeAction ${activeOption === grade.id ? 'active' : ''}`}
                                >
                                    <p>{grade.name}</p>
                                </div>
                            )
                        ))}
                    </div>
                    <div style={{ width: titleWidthData[1] }}>
                        <div className="classNameContent">
                            {!loadClass
                                ? (<>
                                    {classData.length > 0
                                        ? (
                                            <>
                                                {classData.map((classItem, index) => (
                                                    classItem.grade === activeOption && (

                                                        <div className={`classAction ${activeClass === classItem.id ? 'active' : ''}`}>
                                                            <p onClick={() => chooseClass(classItem)}>Lớp {classItem.className}</p>
                                                            <div className="iconAction" onClick={() => chooseEdit(classItem)}>
                                                                <Icon icon="iconamoon:edit-light" />
                                                            </div>
                                                            <div className="iconAction" onClick={() => chooseDelete(classItem)} >
                                                                <Icon icon="fluent:delete-24-regular" />
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                            </>
                                        )
                                        : (
                                            <>
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                                    <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                                    <p style={{ fontSize: '18px' }}>Không có dữ liệu</p>
                                                </div>
                                            </>
                                        )
                                    }
                                </>)
                                :
                                (<>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '40px', marginTop: '1rem' }} className='noContent'>
                                        <Icon icon="eos-icons:loading" style={{ color: '#FF4F00' }} />
                                    </div>
                                </>)}

                        </div>
                        <div className="addClassBtn">
                            <div className="addBtn">
                                <button onClick={() => addNewClass()}>Thêm lớp mới</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: titleWidthData[2] }} className="homeroomTeacherContent">
                        {!loadClass
                            ? (<>
                                {homeRoomTeacherData ?
                                    <div className={'teacherAction'}>
                                        <p>{homeRoomTeacherData.fullname}</p>
                                    </div>
                                    :
                                    (<>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                            <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                            <p style={{ fontSize: '18px' }}>Không có dữ liệu</p>
                                        </div>
                                    </>)}
                            </>)
                            : (<>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '40px', marginTop: '1rem' }} className='noContent'>
                                    <Icon icon="eos-icons:loading" style={{ color: '#FF4F00' }} />
                                </div>
                            </>)}
                    </div>
                    <div style={{ width: titleWidthData[3] }} className={showAddNewButton ? 'showTeacherTeaching' : 'modifyClassContent'}>
                        {!showAddNewClass && !showEditClass
                            ? (<>
                                {!loadTeaching
                                    ? (<>
                                        {showAddNewButton ?
                                            (teacherOfClassData.length > 0
                                                ? (<>
                                                    <div className="teacherinClass" style={{ textAlign: 'left' }}>
                                                        {teacherOfClassData.map((teacher, index) => (

                                                            <div
                                                                className={`gradeAction`}
                                                            >
                                                                <p>{teacher.fullname}</p>
                                                            </div>
                                                        )
                                                        )}
                                                    </div>
                                                </>)
                                                : (<>
                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                                        <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                                        <p style={{ fontSize: '18px' }}>Không có dữ liệu</p>
                                                    </div>
                                                </>))
                                            :
                                            (<></>)
                                        }
                                    </>)
                                    : (<>
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', fontSize: '40px', marginTop: '1rem' }} className='noContent'>
                                            <Icon icon="eos-icons:loading" style={{ color: '#FF4F00' }} />
                                        </div>
                                    </>)}
                            </>)
                            : (<>

                            </>)}





                        {showAddNewClass && <div className="modifyClass">
                            <div className="titleModify">
                                <p>Thêm lớp mới</p>
                            </div>

                            <div className="contentModify">
                                <div className="topContentModify">
                                    <p className="txtTitle">Tên khối</p>
                                    <input type="text" value={activeOption} readOnly />
                                </div>
                                <div style={{ marginTop: '1rem' }} className="topContentModify">
                                    <p className="txtTitle">Tên lớp</p>
                                    <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} placeholder="Nhập tên lớp" required />
                                </div>
                                <div className="bottonContentModify">
                                    <p className="txtTitle">Giáo viên chủ nhiệm</p>
                                    <div className="selectTeacher">
                                        <SelectDropdown label={'Chọn giáo viên'} optionList={notHomeroomTeacher} getDataFromChild={handleDataSelectedTeacher} />
                                    </div>
                                </div>
                            </div>

                            <div className="btnAcion">
                                <button onClick={() => closeNewClass()} className="cancel">Huỷ</button>
                                <button className="save" onClick={() => handleSaveClass()}>Lưu</button>
                            </div>
                        </div>
                        }

                        {showEditClass && <div className="modifyClass">
                            <div className="titleModify">
                                <p>Chỉnh sửa lớp</p>
                            </div>

                            <div className="contentModify">
                                <div className="topContentModify">
                                    <p className="txtTitle">Tên khối</p>
                                    <input type="text" value={activeOption} readOnly />
                                </div>
                                <div style={{ marginTop: '1rem' }} className="topContentModify">
                                    <p className="txtTitle">Tên lớp</p>
                                    <input ref={inputRef} type="text" value={inputValueModify} onChange={handleInputChangeModify} placeholder="Nhập tên lớp" required />
                                </div>
                                <div className="bottonContentModify">
                                    <p className="txtTitle">Giáo viên chủ nhiệm</p>
                                    <div className="selectTeacher">
                                        <SelectDropdown label={'Chọn giáo viên'} optionList={notHomeroomTeacherTemp} getDataFromChild={handleDataSelectedTeacherModify} dataUpdate={teacherSelect} />
                                    </div>
                                </div>
                            </div>

                            <div className="btnAcion">
                                <button onClick={() => closeEditClass()} className="cancel">Huỷ</button>
                                <button onClick={() => saveEditClass()} className="save">Lưu</button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
            {showPopupError && <ErrorPopup handleClose={handleCloseError} errorMsg={errorMsg} />}
            {showSuccess && <Success message={msgSuccess} />}
            {deleteShow && (
                <DeleteConfirm getDataFromChild={getDataDelete} messageDelete={deleteObject} />
            )}
        </div>
    )
}

export default ListClass