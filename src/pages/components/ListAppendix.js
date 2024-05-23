import { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import axios from "axios"
import { loadEffect } from "./Ultility"
import { url } from "../../Config/config"
import { handleDecrypt } from "./Ultilities/CommonFunction"


const ListAppendix = ({ getDataFromChild, title, userLoginValue, loadAppendix4 }) => {
    const selectAppendix = useContext(indexAppendix)

    const widthValue = ['17%', '13%', '55%', '10%', '5%']

    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [userLoginData, setUserLoginData] = useState(null)
    const [chooseSubject, setChooseSubject] = useState(0)
    const [chooseGrade, setChooseGrade] = useState(0)
    const [nameLesson, setNameLesson] = useState([])
    const [nameGrade, setNameGrade] = useState([])
    const [nameSubjects, setNameSubjects] = useState([])
    const [subjectSelect, setSubjectSelect] = useState(null)
    const [gradeSelect, setGradeSelect] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const [loadAppendix, setLoadAppendix] = useState('');

    const [showPopUp, setShowPopUp] = useState(false)

    useEffect(() => {
        if (userLoginValue) {
            setUserLoginData(userLoginValue)
            fetchDataListSubjectOfTeacher(userLoginValue.schoolId, userLoginValue.userId)
        }
    }, [userLoginValue])

    useEffect(() => {
        if (loadAppendix) {
            if (loadAppendix === 'load') {
                if (gradeSelect) {
                    fetchDataListLessonSubjectOfTeacher()
                    setLoadAppendix('')
                }
            } else if (loadAppendix === 'upload') {
                if (gradeSelect) {
                    fetchDataListLessonSubjectOfTeacher()
                    setLoadAppendix('')
                }
            }
        }
    }, [loadAppendix])

    useEffect(() => {
        if (loadAppendix4) {
            setLoadAppendix(loadAppendix4)
        }
    }, [loadAppendix4])

    useEffect(() => {
        if (userLoginValue) {
            fetchDataListSubjectOfTeacher(userLoginValue.schoolId, userLoginValue.userId)
        }
    }, [])

    const fetchDataListSubjectOfTeacher = (schoolId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Subject/TeacherGetListSubject/${schoolId}/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        setNameSubjects(response.data)
                        setSubjectSelect(response.data[0].subjectName)
                        setChooseSubject(response.data[0].subjectName)
                        const timeout = setTimeout(() => {
                            setIsLoading(false);
                        }, 500)

                        return () => {
                            clearTimeout(timeout)
                        }
                    }
                })
                .catch(error => {
                    // Handle error
                    setIsLoading(false);
                    setNameLesson([])
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        if (subjectSelect) {
            fetchDataListGradeSubjectOfTeacher()
        }
    }, [subjectSelect])

    useEffect(() => {
        if (gradeSelect && userLoginValue.userId) {
            setIsLoading(true)
            setIsLoading(false);
            fetchDataListLessonSubjectOfTeacher()
        }
    }, [gradeSelect])

    const handleSubjectSelected = (index, data) => {
        setChooseSubject(data)
        setSubjectSelect(data)
    }
    const handleGradeSelected = (index, data) => {
        setChooseGrade(data.id)
        setGradeSelect(data)
    }

    const handelShowPopUp = (data, id) => {
        if (data) {
            getDataFromChild('1', true, id, '4')
        } else {
            getDataFromChild('0', true, id, '4')
        }
    }

    const fetchDataListGradeSubjectOfTeacher = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Subject/TeacherGetListGradeOfSubject/${userLoginValue.schoolId}/${userLoginValue.userId}/${subjectSelect}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        setNameGrade(response.data)
                        setGradeSelect(response.data[0])
                        setChooseGrade(response.data[0].id)
                        setNameLesson([])
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameGrade([])
                    setGradeSelect(null)
                    setNameLesson([])
                    console.error('Error:', error);
                });
        }
    }

    const fetchDataListLessonSubjectOfTeacher = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Lesson/TeacherGetListLessonOfSubject/${gradeSelect.id}/${userLoginValue.userId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        dataTemp.map(item => {
                            if (item.lessonPlanLastUpdate) {
                                const date = new Date(item.lessonPlanLastUpdate);
                                const month = date.getMonth() + 1;
                                const day = date.getDate();
                                const year = date.getFullYear();
                                item.lessonPlanLastUpdate = `${day}/${month}/${year}`;
                            }
                        })
                        setNameLesson(dataTemp)
                        const timeout = setTimeout(() => {
                            setIsLoading(false);
                        }, 500)

                        return () => {
                            clearTimeout(timeout)
                        }
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameLesson([])
                    console.error('Error:', error);
                });
        }
    }

    return (
        <div>
            <div id="listAppendix-wrapper">
                <div className="topTitle" style={selectAppendix === 3 ? { borderRadius: '20px 20px 0 0' } : {}}>
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        <p>{title[0]}</p>
                    </div>
                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                        <p>{title[1]}</p>
                    </div>
                    <div style={{ width: `calc(${widthValue[2]} + ${widthValue[3]} + ${widthValue[4]})` }}
                        className="borderLessonList borderLessonListTitle">
                        <div className="topTitleAlignLesson" style={{ width: '80%' }}>
                            <p>{title[2]}</p>
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '12%' }}>
                            <p>{title[3]}</p>
                        </div>
                        <div className="" style={{ width: '7%', backgroundColor: 'transparent' }}>
                            <p>{title[4]}</p>
                        </div>
                    </div>
                </div>

                <div className="contentAppendix">
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        {nameSubjects.map((subject, index) => (
                            <div key={index} onClick={() => handleSubjectSelected(index, subject.subjectName)} className={chooseSubject === subject.subjectName ? "subjectSelected" : "subjectSelect"} >
                                <p>{subject.subjectName}</p>
                            </div>
                        ))}
                    </div>

                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                        {nameGrade.map((grade, index) => (
                            <div key={index} onClick={() => handleGradeSelected(index, grade)} className={chooseGrade === grade.id ? "subjectSelected" : "gradeSelect"} >
                                <p>Khối {grade.grade}</p>
                            </div>
                        ))}
                    </div>

                    {isLoading && (
                        <>
                            <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                <div
                                    style={{ left: '60%' }}
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        </>
                    )}

                    {!isLoading && nameLesson.length > 0 ? (<div style={{ width: `calc(${widthValue[2]} + ${widthValue[3]} + ${widthValue[4]})` }}
                        className="borderLessonList">
                        <div className="topTitleAlignLesson" style={{ width: '80%' }}>
                            {nameLesson.map((subject, index) => (
                                <div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => {
                                        handelShowPopUp(subject.lessonPlanLastUpdate, subject.id)
                                    }}
                                    style={{
                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                    }}>
                                    {subject.lessonName
                                        ?
                                        <p key={index}>{subject.lessonName ? subject.lessonName : ''}</p>
                                        :
                                        <Icon icon="nonicons:not-found-16" style={{ backgroundColor: 'transparent', color: 'transparent' }} />
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '12%' }}>
                            {nameLesson.map((subject, index) => (
                                <div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => {
                                        handelShowPopUp(subject.lessonPlanLastUpdate, subject.id)
                                    }}
                                    style={{
                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                    }}>
                                    {subject.lessonPlanLastUpdate
                                        ?
                                        <p key={index}>{subject.lessonPlanLastUpdate ? subject.lessonPlanLastUpdate : ''}</p>
                                        :
                                        <Icon icon="nonicons:not-found-16" style={{ backgroundColor: 'transparent', color: 'transparent' }} />
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '7%', border: 'none' }}>
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
                                        handelShowPopUp(subject.lessonPlanLastUpdate, subject.id)
                                    }}>
                                        <p>
                                            {subject.lessonPlanLastUpdate ?
                                                <Icon icon="mdi:folder-eye-outline" width={'18px'} height={'18px'} />
                                                :
                                                <Icon icon="tabler:upload" width={'18px'} height={'18px'} />
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>)
                        :
                        (
                            (<div style={{ width: `calc(${widthValue[2]} + ${widthValue[3]} + ${widthValue[4]})` }}
                                className="borderLessonList">
                                <div className="topTitleAlignLesson" style={{ width: '80%' }}>
                                    <div className='noContent'>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>
                                </div>
                                <div className="topTitleAlignLesson" style={{ width: '12%' }}>
                                </div>
                                <div className="topTitleAlignLesson" style={{ width: '7%', border: 'none' }}>
                                </div>
                            </div>)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ListAppendix