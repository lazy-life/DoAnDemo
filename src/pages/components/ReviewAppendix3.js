import { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import axios from "axios"
import { url } from "../../Config/config"
import ApproveDoc from "./ApproveDoc"
import Success from "./popUp/Success"
import { loadEffect } from "./Ultility"
import { handleDecrypt } from "./Ultilities/CommonFunction"

const ReviewAppendix3 = ({ getDataFromChild, title, userLoginData }) => {
    const selectAppendix = useContext(indexAppendix)
    const [userLoginvalue, setUserLoginValue] = useState(null)

    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [chooseSubject, setChooseSubject] = useState(null)
    const [chooseGrade, setChooseGrade] = useState(null)
    const [chooseTeacher, setChooseTeacher] = useState(null)

    const [nameSubjects, setNameSubjects] = useState([])
    const [nameGrade, setNameGrade] = useState([])
    const [teacherName, setTeacherName] = useState([])
    const [nameLesson, setNameLesson] = useState([])
    const [nameLessonOfSubject, setNameLessonOfSubject] = useState([])
    const [loadingStatus, setLoadingStatus] = useState(null)
    const [webInfor, setWebInfor] = useState(null)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)

    const widthValue = ['17%', '13%', '23%', '32%', '10%', '5%']

    const [showPopUp, setShowPopUp] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [commentContent, setCommentContent] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [msgSuccess, setMsgSuccess] = useState(null)

    const [isLoadingSubject, setIsLoadingSubject] = useState(true)
    const [isLoadingLesson, setIsLoadingLesson] = useState(true)


    const appendix = '3'

    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
            fetchDataSubjectName(userLoginData.userId)
        }
    }, [userLoginData])


    useEffect(() => {
        if (chooseSubject) {
            setIsLoadingLesson(true)
            setNameGrade(chooseSubject.grades)
            setChooseGrade(chooseSubject.grades[0])
        } else {
            setNameGrade([])
            setTeacherName([])
            setNameLesson([])
            setChooseGrade(null)
            setChooseTeacher(null)
            setIsLoadingLesson(false)
        }
    }, [chooseSubject])

    useEffect(() => {
        if (chooseGrade) {
            setIsLoadingLesson(true)
            fetchDataTeacherName(userLoginData.schoolId, chooseSubject.subjectName, chooseGrade.grade)
        } else {
            setTeacherName([])
            setChooseTeacher(null)
            setIsLoadingLesson(false)
        }
    }, [chooseGrade])

    useEffect(() => {
        if (chooseTeacher) {
            setIsLoadingLesson(true)
            fetchDataLessonName(chooseGrade.subjectId, chooseTeacher.id)
        } else {
            setNameLesson([])
            setIsLoadingLesson(false)
        }
    }, [chooseTeacher])

    const handleApproveDoc = (data, dataSend) => {
        if (data === '0') {
            setShowPopUpDoc(false)
        } else if (data === '1') {
            if (selectedFile) {
                dataSend.PlanId = selectedFile.id
                if (chooseGrade) {
                    fetchApproveFile(dataSend, chooseGrade.subjectId, chooseTeacher.id)
                }
            }
        }
    }

    const handelShowPopUp = (data, id) => {
        if (data) {
            setCommentContent(id.comment)
            fetDataDocUrl(id.id, appendix)
            setNameLessonPlan(id.name)
            setSelectedFile(id)
            setShowPopUpDoc(true)
        }
    }

    const fetchApproveFile = async (requestData, gradeId, usId) => {
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
            const apiUrl = url + 'api/Plan/UpdatePlan'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    fetchDataLessonName(gradeId, usId)
                    if (requestData.Status === 1) {
                        setMsgSuccess('Đã phê duyệt')
                    } else if (requestData.Status === 0) {
                        setMsgSuccess('Đã từ chối')
                    }

                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        setShowPopUpDoc(false)
                    }, 1000)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
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

    const fetchDataSubjectName = async (hodId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Department/GetSubjectsOfDepartmentByHodId/${hodId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setNameSubjects(res.data)
                    setChooseSubject(res.data[0])
                    setIsLoadingSubject(false)
                })
                .catch((err) => {
                    setNameSubjects([])
                    setNameGrade([])
                    setTeacherName([])
                    setNameLesson([])
                    setChooseSubject(null)
                    setChooseGrade(null)
                    setChooseTeacher(null)
                    setIsLoadingSubject(false)
                    console.error(err)
                })
        }
    }

    const fetchDataTeacherName = async (schoolId, subjectName, grade) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/User/GetTeachersBySubjectNameAndGrade/${schoolId}/${subjectName}/${grade}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    if (res.data.length > 0) {
                        setTeacherName(res.data)
                        setChooseTeacher(res.data[0])
                        setIsLoadingSubject(false)
                    } else {
                        setTeacherName([])
                        setChooseTeacher(null)
                        setIsLoadingSubject(false)
                        setIsLoadingLesson(false)
                    }
                })
                .catch((err) => {
                    setTeacherName([])
                    setChooseTeacher(null)
                    setIsLoadingSubject(false)
                    setIsLoadingLesson(false)
                    console.error(err)
                })
        }
    }
    const fetchDataLessonName = async (gradeId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Plan/GetSubjectPlan/${userId}/${gradeId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        dataTemp.map(item => {
                            if (item.createAt) {
                                const date = new Date(item.createAt);
                                const month = date.getMonth() + 1;
                                const day = date.getDate();
                                const year = date.getFullYear();
                                item.createAt = `${day}/${month}/${year}`;
                            }
                        })
                        setNameLesson(dataTemp)
                        setIsLoadingLesson(false)
                    }
                })
                .catch((err) => {
                    setNameLesson([])
                    setIsLoadingLesson(false)
                    console.error(err)
                })
        }
    }

    const handleSubjectSelected = (index) => {
        setChooseSubject(index)
    }
    const handleGradeSelected = (index) => {
        setChooseGrade(index)
    }
    const handleTeacherSelected = (index) => {
        setChooseTeacher(index)
    }

    return (
        <div>
            <div id="listAppendix4-wrapper">
                <div className="topTitle3" style={selectAppendix === 3 ? { borderRadius: '20px 20px 0 0' } : {}}>
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        <p>{title[0]}</p>
                    </div>
                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                        <p>{title[1]}</p>
                    </div>
                    <div className="topTitleAlign" style={{ width: widthValue[2] }}>
                        <p>{title[2]}</p>
                    </div>
                    <div style={{ width: `calc(${widthValue[3]} + ${widthValue[4]} + ${widthValue[5]})` }}
                        className="borderLessonList borderLessonListTitle">
                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                            <p>{title[3]}</p>
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                            <p>{title[4]}</p>
                        </div>
                        <div className="" style={{ width: '10%', backgroundColor: 'transparent' }}>
                            <p>{title[5]}</p>
                        </div>
                    </div>
                </div>

                <div className="contentAppendix">
                    {!isLoadingSubject
                        ? (<>
                            <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                {nameSubjects.length > 0
                                    ? (nameSubjects.map((subject, index) => (
                                        <div key={index} onClick={() => handleSubjectSelected(subject)} className={chooseSubject.subjectName === subject.subjectName ? "subjectSelected" : "subjectSelect"} >
                                            <p>{subject.subjectName}</p>
                                        </div>
                                    )))
                                    : (<div className='noContent'>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>)}
                            </div>

                            <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                                {nameGrade.length > 0
                                    ? (nameGrade.map((grade, index) => (
                                        <div key={index} onClick={() => handleGradeSelected(grade)} className={chooseGrade.grade === grade.grade ? "subjectSelected" : "gradeSelect"} >
                                            <p>Khối {grade.grade}</p>
                                        </div>
                                    )))
                                    : (<div className='noContent'>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>)}
                            </div>
                            <div className="topTitleAlign" style={{ width: widthValue[2] }}>
                                {teacherName.length > 0
                                    ? (teacherName.map((teacher, index) => (
                                        <div key={index} onClick={() => handleTeacherSelected(teacher)} className={chooseTeacher.fullname === teacher.fullname ? "subjectSelected" : "gradeSelect"} >
                                            <p>{teacher.fullname}</p>
                                        </div>
                                    )))
                                    : (<div className='noContent'>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>)}
                            </div>


                            <div style={{ width: `calc(${widthValue[3]} + ${widthValue[4]} + ${widthValue[5]})` }}
                                className="borderLessonList">
                                {!isLoadingLesson
                                    ? (<>
                                        {nameLesson.length > 0
                                            ? (<>
                                                <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                                    {nameLesson.map((subject, index) => (
                                                        (<div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                                            onMouseEnter={() => setHoveredIndex(index)}
                                                            onMouseLeave={() => setHoveredIndex(null)}
                                                            onClick={() => {
                                                                handelShowPopUp(subject.createAt, subject)
                                                            }}
                                                            style={{
                                                                backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                                            }}>
                                                            {subject.name
                                                                ?
                                                                <p style={{ paddingLeft: '.5rem' }} key={index}>{subject.name ? subject.name : ''}</p>
                                                                :
                                                                <Icon icon="nonicons:not-found-16" style={{ backgroundColor: 'transparent', color: 'transparent' }} />
                                                            }
                                                        </div>)
                                                    ))}
                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                                                    {nameLesson.map((subject, index) => (
                                                        <div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                                            onMouseEnter={() => setHoveredIndex(index)}
                                                            onMouseLeave={() => setHoveredIndex(null)}
                                                            onClick={() => {
                                                                handelShowPopUp(subject.createAt, subject)
                                                            }}
                                                            style={{
                                                                backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                                            }}>
                                                            {subject.createAt
                                                                ?
                                                                <p key={index}>{subject.createAt ? subject.createAt : ''}</p>
                                                                :
                                                                <Icon icon="nonicons:not-found-16" style={{ backgroundColor: 'transparent', color: 'transparent' }} />
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>
                                                    {nameLesson.map((subject, index) => (
                                                        <div key={index} className={`lessonSelectAction ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                                            onMouseEnter={() => setHoveredIndex(index)}
                                                            onMouseLeave={() => setHoveredIndex(null)}
                                                            style={{
                                                                backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                                            }}>
                                                            <div style={subject.status === 0 ? { backgroundColor: '#f76b59', borderRadius: '10px' }
                                                                :
                                                                subject.status === 1 ? { backgroundColor: '#2dcc7f', borderRadius: '10px' }
                                                                    :
                                                                    {}
                                                            } className="action" onClick={() => {
                                                                handelShowPopUp(subject.createAt, subject)
                                                            }}>
                                                                <p>
                                                                    {subject.createAt ?
                                                                        <Icon icon="mdi:folder-eye-outline" width={'18px'} height={'18px'} />
                                                                        :
                                                                        <Icon icon="tabler:upload" width={'18px'} height={'18px'} style={{ backgroundColor: 'transparent', color: 'transparent' }} />
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>)
                                            : (<>
                                                <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                                    <div className='noContent'>
                                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                                        <p>Không có dữ liệu</p>
                                                    </div>
                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: '20%' }}>

                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>

                                                </div>
                                            </>)}
                                    </>)
                                    : (<>
                                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                            <>
                                                <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                                    <div
                                                        style={{ left: '73%' }}
                                                        className="loader"
                                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                                    />
                                                </div>
                                            </>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>

                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>

                                        </div>
                                    </>)}
                            </div>
                        </>)
                        : (<>
                            <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                <>
                                    <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                        <div
                                            style={{ left: '25%' }}
                                            className="loader"
                                            dangerouslySetInnerHTML={{ __html: loadEffect }}
                                        />
                                    </div>
                                </>
                            </div>

                            <div className="topTitleAlign" style={{ width: widthValue[1] }}>

                            </div>
                            <div className="topTitleAlign" style={{ width: widthValue[2] }}>

                            </div>


                            <div style={{ width: `calc(${widthValue[3]} + ${widthValue[4]} + ${widthValue[5]})` }}
                                className="borderLessonList">

                                <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                    <>
                                        <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                            <div
                                                style={{ left: '73%' }}
                                                className="loader"
                                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                                            />
                                        </div>
                                    </>
                                </div>
                                <div className="topTitleAlignLesson" style={{ width: '20%' }}>

                                </div>
                                <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>

                                </div>
                            </div>
                        </>)}

                </div>
            </div>
            {showPopUpDoc && <ApproveDoc getDataFromChild={handleApproveDoc} urlDoc={urlDoc} nameLessonPlan={nameLessonPlan} commentContent={commentContent} />}
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default ReviewAppendix3