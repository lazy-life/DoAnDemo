import { useContext, useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import axios from "axios"
import { url } from "../../Config/config"
import ViewDocumentHod from "./popUp/ViewDocumentHod"
import ViewDoc from "./popUp/ViewDoc"
import Success from "./popUp/Success"
import { loadEffect } from "./Ultility"
import { handleDecrypt } from "./Ultilities/CommonFunction"

const ViewAppendix1 = ({ getDataFromChild, title, userLoginData }) => {
    const selectAppendix = useContext(indexAppendix)
    const [userLoginvalue, setUserLoginValue] = useState(null)
    const fileInputRef = useRef(null);

    const widthValue = ['17%', '13%', '55%', '10%', '5%']

    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [chooseSubject, setChooseSubject] = useState(0)
    const [chooseGrade, setChooseGrade] = useState(0)
    const [nameSubjects, setNameSubjects] = useState([])
    const [nameGrade, setNameGrade] = useState([])
    const [deleteItemList, setDeleteItemList] = useState([])

    const [nameLesson, setNameLesson] = useState(null)
    const [nameDepartment, setNameDepartment] = useState(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)

    const [isLoadingSubject, setIsLoadingSubject] = useState(true)
    const [isLoadingLesson, setIsLoadingLesson] = useState(true)

    const [showPopUp, setShowPopUp] = useState(false)

    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)

    const handleSubjectSelected = (index) => {
        setChooseSubject(index)
    }
    const handleGradeSelected = (index) => {
        setChooseGrade(index)
    }

    const handelShowPopUp = (id) => {
        setShowPopUp(true)
    }

    const handleViewDoc = (type) => {
        if (type === '0') {
            setShowPopUp(true)
            setShowPopUpDoc(false)
        }
    }

    const handleViewDocumentHod = (data, dataSend) => {
        if (data === 'close') {
            setShowPopUp(false)
        } else if (data === '7') {
            // handleUploadItem(data.dataDeleteItem, data.appendixType)
            deleteLessonPLan(dataSend.lessonSelectedId, 1, dataSend.dataDeleteItem)
        } else if (data === '5') {
            handleUploadFile(dataSend)
        } else {
            if (data.fileExtension === '.docx') {
                fetDataDocUrl(data.id, 1)
                setNameLessonPlan(data.name)
                setShowPopUpDoc(true)
                setShowPopUp(false)
            } else {
                fetDataDocUrl(data.id, 1)
                setNameLessonPlan(data.name)
                setShowPopUpDoc(true)
                setShowPopUp(false)
            }
        }
    }

    const handleUploadFile = (fileData) => {
        try {
            const formData = new FormData();

            // Update the formData object
            formData.append(
                "file",
                fileData,
                fileData.name
            );
            // Send formData object
            const dataFileExtension = fileData.name.split('.')
            const fileExtensionSplit = dataFileExtension[dataFileExtension.length - 1]

            if (fileExtensionSplit === 'zip') {

            } else {
                if (userLoginvalue) {
                    if (userLoginvalue.userId && chooseGrade && nameDepartment && formData) {
                        uploadFileData(userLoginvalue.userId, nameDepartment.id, chooseGrade.subjectId, 1, formData)
                    }
                }
            }
        } catch (error) {

        }
    }

    const handleUploadFileDoc = (data) => {
        setShowPopUp(true)
        // getDataFromChild('0', true, [], '3', gradeSelect)
    }



    useEffect(() => {
        if (chooseGrade && nameDepartment) {
            setIsLoadingLesson(true)
            fetchDataLessonName(nameDepartment.id, chooseGrade.subjectId)
        } else {
            setNameLesson(null)
        }
    }, [chooseGrade])

    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
            fetchDataDepartmentName(userLoginData.userId)
            fetchDataSubjectName(userLoginData.userId)
        }
    }, [userLoginData])

    useEffect(() => {
        if (chooseSubject) {
            setNameGrade(chooseSubject.grades)
            setChooseGrade(chooseSubject.grades[0])
            setIsLoadingLesson(true)
        } else {
            setNameGrade([])
            setNameLesson(null)
            setChooseGrade(null)
        }
    }, [chooseSubject])

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

    const uploadFileData = async (userId, unitId, subjectId, typeId, formData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios.post(url + `api/Plan/UploadPlanFile/${userId}/${unitId}/${subjectId}/${typeId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    fetchDataLessonName(nameDepartment.id, chooseGrade.subjectId)
                    setMsgSuccess('Tải lên thành công')
                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                    }, 1000)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch(error => {

                    console.error('Error uploading file:', error);
                    // Handle error
                });
        }
    }

    const deleteLessonPLan = async (planId, typeId, itemId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const urlData = url + `api/Plan/DeletePlan/${planId}/${typeId}`;

            await axios.delete(urlData, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    let updatedItems = []
                    updatedItems.push(nameDepartment)
                    setDeleteItemList(updatedItems)

                    if (nameDepartment) {
                        fetchDataLessonName(nameDepartment.id, chooseGrade.subjectId)
                        setMsgSuccess('Xoá thành công')
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                        }, 1000)

                        return () => {
                            clearTimeout(timeout)
                        }
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi xóa tài nguyên:', error);
                });
        }
    }

    const fetchDataLessonName = async (departmentId, subjectId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Plan/GetDepartmentSubjectPlan/${departmentId}/${subjectId}`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        if (dataTemp.createAt) {
                            const date = new Date(dataTemp.createAt);
                            const month = date.getMonth() + 1;
                            const day = date.getDate();
                            const year = date.getFullYear();
                            dataTemp.createAt = `${day}/${month}/${year}`;
                        }
                        setNameLesson(dataTemp)
                        setIsLoadingLesson(false)
                    }
                })
                .catch((err) => {
                    setNameLesson(null)
                    setIsLoadingLesson(false)
                    console.error(err)
                })
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
                    setNameLesson(null)
                    setChooseSubject(null)
                    setChooseGrade(null)
                    setIsLoadingSubject(false)
                    console.error(err)
                })
        }
    }

    const fetchDataDepartmentName = (usId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Department/GetSelectDepartmentByHodId/${usId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setNameDepartment(dataTemp)
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameDepartment(null)
                    console.error('Error:', error);
                });
        }
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
            if (userLoginvalue) {
                if (userLoginvalue.userId && chooseGrade && nameDepartment && formData) {
                    uploadFileData(userLoginvalue.userId, nameDepartment.id, chooseGrade.subjectId, 1, formData)
                }
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
            <div id="listAppendix4-wrapper">
                <div className="topTitle3" style={selectAppendix === 3 ? { borderRadius: '20px 20px 0 0' } : {}}>
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
                    {!isLoadingSubject
                        ?
                        (nameSubjects.length > 0
                            ?
                            (<>
                                <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                    {nameSubjects.map((subject, index) => (
                                        <div key={index} onClick={() => handleSubjectSelected(subject)} className={chooseSubject.subjectName === subject.subjectName ? "subjectSelected" : "subjectSelect"} >
                                            <p>{subject.subjectName}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                                    {nameGrade.map((grade, index) => (
                                        <div key={index} onClick={() => handleGradeSelected(grade)} className={chooseGrade.grade === grade.grade ? "subjectSelected" : "gradeSelect"} >
                                            <p>Khối {grade.grade}</p>
                                        </div>
                                    ))}
                                </div>

                                {!isLoadingLesson
                                    ?
                                    (nameLesson
                                        ?
                                        (
                                            <>
                                                <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                                    <div className={'lessonSelect even-row'}
                                                        onMouseEnter={() => setHoveredIndex(nameLesson.id)}
                                                        onMouseLeave={() => setHoveredIndex(null)}
                                                        onClick={() => {
                                                            handelShowPopUp(nameLesson)
                                                        }}
                                                        style={{
                                                            backgroundColor: hoveredIndex === nameLesson.id ? '#fad5c4' : '',
                                                        }}>
                                                        <p>{nameLesson.name}</p>
                                                    </div>
                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>
                                                    <div className={'lessonSelect even-row'}
                                                        onMouseEnter={() => setHoveredIndex(nameLesson.id)}
                                                        onMouseLeave={() => setHoveredIndex(null)}
                                                        onClick={() => {
                                                            handelShowPopUp(nameLesson)
                                                        }}
                                                        style={{
                                                            backgroundColor: hoveredIndex === nameLesson.id ? '#fad5c4' : '',
                                                        }}>
                                                        <p>{nameLesson.createAt}</p>
                                                    </div>
                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>
                                                    <div className={'lessonSelectAction even-row'}
                                                        onMouseEnter={() => setHoveredIndex(nameLesson.id)}
                                                        onMouseLeave={() => setHoveredIndex(null)}
                                                        style={{
                                                            backgroundColor: hoveredIndex === nameLesson.id ? '#fad5c4' : '',
                                                        }}>
                                                        <div className="action" onClick={() => {
                                                            handelShowPopUp(nameLesson)
                                                        }}>
                                                            <div style={nameLesson.status === 0 ? { backgroundColor: '#f76b59', borderRadius: '10px' }
                                                                :
                                                                nameLesson.status === 1 ? { backgroundColor: '#2dcc7f', borderRadius: '10px' }
                                                                    :
                                                                    {}
                                                            } onClick={() => {
                                                                handelShowPopUp(nameLesson)
                                                            }}>
                                                                <p style={{ padding: '0 1rem', height: '90%' }}>
                                                                    {nameLesson.createAt ?
                                                                        <Icon icon="mdi:folder-eye-outline" width={'18px'} height={'18px'} />
                                                                        :
                                                                        <Icon icon="tabler:upload" width={'18px'} height={'18px'} />
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
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

                                                </div>
                                                <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>
                                                    <div className={'lessonSelectAction'}>
                                                        {/* <div style={{ textAlign: 'center' }} className="action" onClick={() => fileInputRef.current.click()}>
                                                            <p >
                                                                <Icon icon="tabler:upload" width={'18px'} height={'18px'} />
                                                            </p>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    )
                                    :
                                    (<>
                                        <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                            <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                                <div
                                                    style={{ left: '60%' }}
                                                    className="loader"
                                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                                />
                                            </div>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>

                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>

                                        </div>
                                    </>)
                                }

                            </>
                            )
                            :
                            (
                                <>
                                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                        <div className='noContent'>
                                            <i className="iconNoContent fa-solid fa-ban"></i>
                                            <p>Không có dữ liệu</p>
                                        </div>
                                    </div>

                                    <div className="topTitleAlign" style={{ width: widthValue[1] }}>
                                        <div className='noContent'>
                                            <i className="iconNoContent fa-solid fa-ban"></i>
                                            <p>Không có dữ liệu</p>
                                        </div>
                                    </div>

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
                        )
                        :
                        (<>
                            <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                    <div
                                        style={{ left: '60%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            </div>

                            <div className="topTitleAlign" style={{ width: widthValue[1] }}>

                            </div>

                            <div className="topTitleAlignLesson" style={{ width: widthValue[2] }}>
                                <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                    <div
                                        style={{ left: '60%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            </div>
                            <div className="topTitleAlignLesson" style={{ width: widthValue[3] }}>

                            </div>
                            <div className="topTitleAlignLesson" style={{ width: widthValue[4], border: 'none' }}>

                            </div>
                        </>)
                    }

                </div>
            </div>

            {showPopUp && <ViewDocumentHod isShowUpload={true} getDataFromChild={handleViewDocumentHod} lessonPlan={nameLesson ? [nameLesson] : []} loadingStatus={nameLesson ? false : 'no'} appendix={'1'} userLoginValue={userLoginvalue} subjectSelect={nameLesson} deleteItemList={deleteItemList} />}
            {showPopUpDoc && <ViewDoc getDataFromChild={handleViewDoc} urlDoc={urlDoc} nameLessonPlan={nameLessonPlan} />}
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default ViewAppendix1