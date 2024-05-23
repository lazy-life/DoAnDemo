import { useContext, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import axios from "axios"
import { url } from "../../Config/config"
import { handleDecrypt } from "./Ultilities/CommonFunction"

const HistoryAppendix = ({ getDataFromChild, title, userLoginData }) => {
    const selectAppendix = useContext(indexAppendix)
    const [nameSubjects, setNameSubjects] = useState([])
    const [chooseSubject, setChooseSubject] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [chooseAppendix, setChooseAppendix] = useState(4)
    const [chooseStatus, setChooseStatus] = useState(1)
    const [chooseTeacher, setChooseTeacher] = useState(0)
    const [showPopUp, setShowPopUp] = useState(false)
    const [userLoginvalue, setUserLoginValue] = useState(null)
    // const [nameLesson, setNameLesson] = useState([])


    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
            setChooseStatus(1)
        }
    }, [userLoginData])

    useEffect(() => {
        setChooseAppendix(4)
    }, [])

    const jsonData = {
        typeId: 4,
        status: 1,
        subjects: [
            1, 2, 3, 4
        ]
    }
    const nameAppendix = [
        {
            id: 4,
            name: 'Kế hoạch bài dạy'
        },
        {
            id: 3,
            name: 'Kế hoạch giáo dục môn'
        }
    ]

    const nameStatus = [
        {
            id: 1,
            name: 'Phê duyệt'
        },
        {
            id: 0,
            name: 'Từ chối'
        }
    ]

    const nameLesson = [
        {
            id: 1,
            submitDate: '11/09/2024',
            name: 'Khung giáo dục môn Lịch sử khối 6.doc',
            type: '1'
        },
        {
            id: 2,
            submitDate: '11/09/2024',
            name: 'Khung giáo dục môn Lịch sử khối 6.doc',
            type: '1'
        }
    ]

    const widthValue = ['17%', '13%', '23%', '32%', '10%', '5%']



    const handleSubjectSelected = (index) => {
        setChooseSubject(index)
    }
    const handleGradeSelected = (index) => {
        // setChooseGrade(index)
    }

    const handleTeacherSelected = (index) => {
        setChooseTeacher(index)
    }

    const handelShowPopUp = (id) => {
        getDataFromChild(id, true)
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
                })
                .catch((err) => {
                    setNameSubjects([])
                    setChooseSubject(null)
                    console.error(err)
                })
        }
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
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        {nameAppendix.map((subject, index) => (
                            <div key={index} onClick={() => handleSubjectSelected(index)} className={chooseAppendix === index ? "subjectSelected" : "subjectSelect"} >
                                <p>{subject.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                        {nameStatus.map((subject, index) => (
                            <div key={index} onClick={() => handleGradeSelected(index)} className={chooseStatus === index ? "subjectSelected" : "gradeSelect"} >
                                <p>{subject.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="topTitleAlign" style={{ width: widthValue[2] }}>
                        {nameSubjects.map((subject, index) => (
                            <div key={index} onClick={() => handleTeacherSelected(index)} className={chooseSubject === index ? "subjectSelected" : "gradeSelect"} >
                                <p>{subject.subjectName}</p>
                            </div>
                        ))}
                    </div>


                    <div style={{ width: `calc(${widthValue[3]} + ${widthValue[4]} + ${widthValue[5]})` }}
                        className="borderLessonList">
                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                            {nameLesson.map((subject, index) => (
                                <div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => {
                                        handelShowPopUp({ id: subject.type })
                                    }}
                                    style={{
                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                    }}>
                                    <p style={{ paddingLeft: '.5rem' }} key={index}>{subject.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                            {nameLesson.map((subject, index) => (
                                <div key={index} className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => {
                                        handelShowPopUp({ id: subject.type })
                                    }}
                                    style={{
                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                    }}>
                                    <p key={index}>{subject.submitDate}</p>
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
                                    <div className="action" onClick={() => {
                                        handelShowPopUp({ id: subject.type })
                                    }}>
                                        <p>
                                            <Icon icon="mdi:folder-eye-outline" width={'18px'} height={'18px'} />
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistoryAppendix