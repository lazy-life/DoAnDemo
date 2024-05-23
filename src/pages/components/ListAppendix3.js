import { useContext, useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import axios from "axios"
import Success from "./popUp/Success"
import { loadEffect } from "./Ultility"
import { url } from "../../Config/config"
import { handleDecrypt } from "./Ultilities/CommonFunction"

const ListAppendix3 = ({ getDataFromChild, title, userLoginValue, loadingAppendix3 }) => {
    const selectAppendix = useContext(indexAppendix)
    const widthValue = ['17%', '13%', '55%', '10%', '5%']

    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [userLoginData, setUserLoginData] = useState(null)
    const [nameSubjects, setNameSubjects] = useState([])
    const [subjectSelect, setSubjectSelect] = useState(null)
    const [chooseSubject, setChooseSubject] = useState(0)
    const [chooseGrade, setChooseGrade] = useState(0)
    const [nameGrade, setNameGrade] = useState([])
    const [nameLesson, setNameLesson] = useState([])
    const [gradeSelect, setGradeSelect] = useState(null)
    const fileInputRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (userLoginValue) {
            setUserLoginData(userLoginValue)
            fetchDataListSubjectOfTeacher(userLoginValue.schoolId, userLoginValue.userId)
        }
    }, [userLoginValue])
    useEffect(() => {
        if (loadingAppendix3 === 'load' && gradeSelect) {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                setIsLoading(true)
                axios.get(url + `api/Plan/GetSubjectPlan/${userLoginValue.userId}/${gradeSelect.id}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                    .then(response => {
                        // Handle success
                        if (response.data) {
                            const dataTemp = response.data

                            dataTemp.map(item => {
                                const date = new Date(item.createAt);
                                const month = date.getMonth() + 1;
                                const day = date.getDate();
                                const year = date.getFullYear();
                                item.createAt = `${day}/${month}/${year}`;
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
                        setIsLoading(false);
                        console.error('Error fail plan 3:', error);
                    });
            }
        } else if (loadingAppendix3 === 'upload' && gradeSelect) {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                setIsLoading(true)
                axios.get(url + `api/Plan/GetSubjectPlan/${userLoginValue.userId}/${gradeSelect.id}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                    .then(response => {
                        // Handle success
                        if (response.data) {
                            const dataTemp = response.data

                            dataTemp.map(item => {
                                const date = new Date(item.createAt);
                                const month = date.getMonth() + 1;
                                const day = date.getDate();
                                const year = date.getFullYear();
                                item.createAt = `${day}/${month}/${year}`;
                            })
                            setNameLesson(dataTemp)
                            getDataFromChild('1', true, dataTemp, '3', gradeSelect)
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
                        setIsLoading(false);
                        console.error('Error fail plan 3:', error);
                    });
            }
        }
    }, [loadingAppendix3])

    useEffect(() => {
        if (userLoginValue) {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                axios.get(url + `api/Subject/TeacherGetListSubject/${userLoginValue.schoolId}/${userLoginValue.userId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                    .then(response => {
                        // Handle success
                        if (response.data) {
                            setNameSubjects(response.data)
                            setSubjectSelect(response.data[0].subjectName)
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
                        console.error('Error:', error);
                    });
            }
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
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameSubjects([])
                    setSubjectSelect(null)
                    setChooseSubject(null)
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
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
                        }
                    })
                    .catch(error => {
                        // Handle error
                        setNameGrade([])
                        setGradeSelect(null)
                        setChooseGrade(null)
                        console.error('Error:', error);
                    });
            }
        }
        if (subjectSelect) {
            fetchDataListGradeSubjectOfTeacher()
        }
    }, [subjectSelect])

    useEffect(() => {
        if (gradeSelect) {
            fetchDataListLessonSubjectOfTeacher()
        }
    }, [gradeSelect])

    const fetchDataListLessonSubjectOfTeacher = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetSubjectPlan/${userLoginValue.userId}/${gradeSelect.id}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data

                        dataTemp.map(item => {
                            const date = new Date(item.createAt);
                            const month = date.getMonth() + 1;
                            const day = date.getDate();
                            const year = date.getFullYear();
                            item.createAt = `${day}/${month}/${year}`;
                        })
                        setNameLesson(dataTemp)
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameLesson([])
                    console.error('Error fail plan 3:', error);
                });
        }
    }


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
            getDataFromChild('1', true, [id], '3', gradeSelect)
        } else {
            getDataFromChild('0', true, [id], '3', gradeSelect)
        }
    }
    const handleUploadFileDoc = (data) => {
        getDataFromChild('0', true, [], '3', gradeSelect)
    }

    const handleFileInputChange = (e) => {
        try {
            const fileData = e.target.files[0];
            const formData = new FormData();
            // Update the formData object
            formData.append(
                "file",
                fileData,
                fileData.name
            );
            // Details of the uploaded file
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token

                axios.post(url + `api/Plan/UploadPlanFile/${userLoginValue.userId}/${gradeSelect.id}/3`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                    .then(response => {
                        setMsgSuccess('Tải lên thành công')
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            if (gradeSelect) {
                                fetchDataListLessonSubjectOfTeacher()
                            }
                            setShowSuccess(false)
                        }, 1300)

                        return () => {
                            clearTimeout(timeout)
                        }
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                        // Handle error
                    });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                accept=".docx"
            />
            <div id="listAppendix-wrapper">
                <div className="topTitle" style={selectAppendix === 3 ? { borderRadius: '20px 20px 0 0' } : {}}>
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        <p>{title[0]}</p>
                    </div>
                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                        <p>{title[1]}</p>
                    </div>
                    <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                        <p>{title[2]}</p>
                    </div>
                    <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>
                        <p>{title[3]}</p>
                    </div>
                    <div className="" style={{ width: widthValue[4] }}>
                        <p>{title[4]}</p>
                    </div>
                </div>

                <div className="contentAppendix">
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        {nameSubjects.map((subject, index) => (
                            <div onClick={() => handleSubjectSelected(index, subject.subjectName)} className={chooseSubject === subject.subjectName ? "subjectSelected" : "subjectSelect"} >
                                <p key={index}>{subject.subjectName}</p>
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

                    {nameSubjects.length > 0
                        ? (
                            <>
                                {nameLesson.length > 0 && !isLoading ? (
                                    <>
                                        <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                            {nameLesson.map((subject, index) => (
                                                <div className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                                    onMouseEnter={() => setHoveredIndex(index)}
                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                    onClick={() => {
                                                        handelShowPopUp(subject.createAt, subject)
                                                    }}
                                                    style={{
                                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                                    }}>
                                                    <p key={index}>{subject.name ? subject.name : 'A/A/A'}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>
                                            {nameLesson.map((subject, index) => (
                                                <div className={`lessonSelect ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
                                                    onMouseEnter={() => setHoveredIndex(index)}
                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                    onClick={() => {
                                                        handelShowPopUp(subject.createAt, subject)
                                                    }}
                                                    style={{
                                                        backgroundColor: hoveredIndex === index ? '#fad5c4' : '',
                                                    }}>
                                                    <p key={index}>{subject.createAt ? subject.createAt : '0/0/0'}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>
                                            {nameLesson.map((subject, index) => (
                                                <div className={`lessonSelectAction ${(index) % 2 === 0 ? 'even-row' : 'odd-row'}`}
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
                                                                <Icon icon="tabler:upload" width={'18px'} height={'18px'} style={{ color: 'transparent' }} />
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )
                                    : (
                                        (nameSubjects.length > 0 && nameGrade.length > 0 && !isLoading) &&
                                        <>
                                            <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                                <div className={`lessonSelect`}>
                                                    <div className="uploadLesson3Btn" style={{ textAlign: 'center' }}>
                                                        {/* <div onClick={() => fileInputRef.current.click()} className="button">Tải lên tài liệu</div> */}
                                                        <div onClick={() => handleUploadFileDoc()} className="button">Tải lên tài liệu</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>

                                                <div style={{ textAlign: 'center' }} className={`lessonSelect`}
                                                    onClick={() => fileInputRef.current.click()}>
                                                    <p>
                                                    </p>
                                                </div>

                                            </div>
                                            <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>

                                                <div className={`lessonSelectAction`}>
                                                    {/* <div style={{ textAlign: 'center' }} className="action" onClick={() => fileInputRef.current.click()}>
                                                        <p>
                                                            <Icon icon="tabler:upload" width={'18px'} height={'18px'} style={{ color: 'transparent' }} />
                                                        </p>
                                                    </div> */}
                                                </div>

                                            </div>
                                        </>
                                    )}
                            </>
                        )
                        : (
                            <>
                                <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                    <div className='noContent'>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p>Không có dữ liệu</p>
                                    </div>
                                </div>
                                <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>

                                </div>

                                <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>

                                </div>
                            </>
                        )
                    }

                </div>
            </div>
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default ListAppendix3

