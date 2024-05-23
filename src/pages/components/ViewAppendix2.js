import { useContext, useEffect, useRef, useState } from "react"
import { Icon, calculateSize } from "@iconify/react"
import { indexAppendix } from "./Appendix"
import { url } from "../../Config/config"
import axios from "axios"
import ViewDocumentHod from "./popUp/ViewDocumentHod"
import ViewDoc from "./popUp/ViewDoc"
import Success from "./popUp/Success"
import { loadEffect } from "./Ultility"
import { handleDecrypt } from "./Ultilities/CommonFunction"


const ViewAppendix2 = ({ getDataFromChild, title, userLoginData }) => {
    const selectAppendix = useContext(indexAppendix)
    const [userLoginvalue, setUserLoginValue] = useState(null)
    const [nameDepartment, setNameDepartment] = useState(null)
    const [nameFileDepartment, setNameFileDepartment] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)
    const [deleteItemList, setDeleteItemList] = useState([])
    const widthValue = ['17%', '83%']

    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const [msgSuccess, setMsgSuccess] = useState(null)

    const [showPopUp, setShowPopUp] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)

    const [isLoadingDepartment, setIsLoadingDepartment] = useState(true)
    const [isLoadingLesson, setIsLoadingLesson] = useState(true)

    const fileInputRef = useRef(null);



    const handelShowPopUp = (id) => {
        setShowPopUp(true)
    }

    const handleUploadFileDoc = (data) => {
        setShowPopUp(true)
        // getDataFromChild('0', true, [], '3', gradeSelect)
    }

    const handleViewDocumentHod = (data, dataSend) => {
        if (data === 'close') {
            setShowPopUp(false)
        } else if (data === '7') {
            // handleUploadItem(data.dataDeleteItem, data.appendixType)
            deleteLessonPLan(dataSend.lessonSelectedId, 2, dataSend.dataDeleteItem)
        } else if (data === '5') {
            handleUploadFile(dataSend)
        } else {
            if (data.fileExtension === '.docx') {
                fetDataDocUrl(data.id, 2)
                setNameLessonPlan(data.name)
                setShowPopUpDoc(true)
                setShowPopUp(false)
            } else {
                fetDataDocUrl(data.id, 2)
                setNameLessonPlan(data.name)
                setShowPopUpDoc(true)
                setShowPopUp(false)
            }
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
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token

                axios.post(url + `api/Plan/UploadPlanFile/${userLoginvalue.userId}/${nameDepartment.id}/2`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                    .then(response => {
                        setMsgSuccess('Tải lên thành công')
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            fetchDataFileDepartment(nameDepartment.id)
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

    const handleViewDoc = (type) => {
        if (type === '0') {
            setShowPopUp(true)
            setShowPopUpDoc(false)
        }
    }

    useEffect(() => {
        if (userLoginData) {
            setUserLoginValue(userLoginData)
            fetchDataDepartmentName(userLoginData.userId)
        }
    }, [userLoginData])


    useEffect(() => {
        if (userLoginvalue) {

        }
    }, [])

    useEffect(() => {
        if (nameDepartment) {
            setIsLoadingLesson(true)
            fetchDataFileDepartment(nameDepartment.id)
        }
    }, [nameDepartment])

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
                    if (userLoginvalue.userId && nameDepartment && formData) {
                        uploadFileData(userLoginvalue.userId, nameDepartment.id, 2, formData)
                    }
                }
            }
        } catch (error) {

        }
    }

    const uploadFileData = async (userId, id, typeLesson, formData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios.post(url + `api/Plan/UploadPlanFile/${userId}/${id}/${typeLesson}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    fetchDataFileDepartment(nameDepartment.id)
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
            const urldata = url + `api/Plan/DeletePlan/${planId}/${typeId}`;

            await axios.delete(urldata, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    let updatedItems = []
                    updatedItems.push(nameDepartment)
                    setDeleteItemList(updatedItems)

                    if (nameDepartment) {
                        fetchDataFileDepartment(nameDepartment.id)
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
                        setIsLoadingDepartment(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameDepartment(null)
                    setIsLoadingDepartment(false)
                    console.error('Error:', error);
                });
        }
    }

    const fetchDataFileDepartment = (departmentId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetDepartmentPlan/${departmentId}`, {
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
                        setNameFileDepartment(dataTemp)
                        setIsLoadingLesson(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setNameFileDepartment(null)
                    setIsLoadingLesson(false)
                    console.error('Error:', error);
                });
        }
    }

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
                <div className="topTitle" style={selectAppendix === 3 ? { borderRadius: '20px 20px 0 0' } : {}}>
                    <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                        <p>{title[0]}</p>
                    </div>
                    <div style={{ width: `${widthValue[1]}` }}
                        className="borderLessonList borderLessonListTitle">
                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                            <p>{title[1]}</p>
                        </div>
                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                            <p>{title[2]}</p>
                        </div>
                        <div className="" style={{ width: '10%', backgroundColor: 'transparent' }}>
                            <p>{title[3]}</p>
                        </div>
                    </div>
                </div>

                {!isLoadingDepartment
                    ?
                    (nameDepartment
                        ?
                        (<div className="contentAppendix">
                            <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                <div className="subjectSelected" >
                                    <p>{nameDepartment.departmentName ? nameDepartment.departmentName : ''}</p>
                                </div>
                            </div>

                            {!isLoadingLesson
                                ?
                                (nameFileDepartment ?
                                    (<div style={{ width: `${widthValue[1]}` }}
                                        className="borderLessonList">
                                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                            <div className='lessonSelect even-row'
                                                onMouseEnter={() => setHoveredIndex(nameFileDepartment.id)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                onClick={() => {
                                                    handelShowPopUp(nameFileDepartment)
                                                }}
                                                style={{
                                                    backgroundColor: hoveredIndex === nameFileDepartment.id ? '#fad5c4' : '',
                                                }}>
                                                <p style={{ paddingLeft: '.5rem' }}>{nameFileDepartment.name}</p>
                                            </div>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                                            <div className='lessonSelect even-row'
                                                onMouseEnter={() => setHoveredIndex(nameFileDepartment.id)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                onClick={() => {
                                                    handelShowPopUp(nameFileDepartment)
                                                }}
                                                style={{
                                                    display: 'flex', justifyContent: 'center',
                                                    backgroundColor: hoveredIndex === nameFileDepartment.id ? '#fad5c4' : '',
                                                }}>
                                                <p style={{ paddingLeft: '.5rem' }}>{nameFileDepartment.createAt}</p>
                                            </div>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>
                                            <div className='lessonSelect even-row'
                                                onMouseEnter={() => setHoveredIndex(nameFileDepartment.id)}
                                                onMouseLeave={() => setHoveredIndex(null)}
                                                onClick={() => {
                                                    handelShowPopUp(nameFileDepartment)
                                                }}
                                                style={{
                                                    display: 'flex', justifyContent: 'center',
                                                    backgroundColor: hoveredIndex === nameFileDepartment.id ? '#fad5c4' : '',
                                                }}>
                                                <div style={nameFileDepartment.status === 0 ? { backgroundColor: '#f76b59', borderRadius: '10px' }
                                                    :
                                                    nameFileDepartment.status === 1 ? { backgroundColor: '#2dcc7f', borderRadius: '10px' }
                                                        :
                                                        {}
                                                } onClick={() => {
                                                    handelShowPopUp(nameFileDepartment)
                                                }}>
                                                    <p style={{ padding: '0 1rem', height: '90%' }}>
                                                        {nameFileDepartment.createAt ?
                                                            <Icon icon="mdi:folder-eye-outline" width={'18px'} height={'18px'} />
                                                            :
                                                            <Icon icon="tabler:upload" width={'18px'} height={'18px'} />
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                    :
                                    ((<div style={{ width: `${widthValue[1]}` }}
                                        className="borderLessonList">
                                        <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                            <div className={`lessonSelect`}>
                                                <div className="uploadLesson3Btn" style={{ textAlign: 'center' }}>
                                                    {/* <div onClick={() => fileInputRef.current.click()} className="button">Tải lên tài liệu</div> */}
                                                    <div onClick={() => handleUploadFileDoc()} className="button">Tải lên tài liệu</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '20%' }}>
                                            <div style={{ textAlign: 'center' }} className={`lessonSelect`}>
                                                <p>
                                                    <Icon icon="tabler:upload" width={'18px'} height={'18px'} style={{ color: 'transparent' }} />
                                                </p>
                                            </div>
                                        </div>
                                        <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>
                                            <div className={'lessonSelectAction'}>
                                                {/* <div style={{ textAlign: 'center' }} className="action" onClick={() => fileInputRef.current.click()}>
                                                    <p >
                                                        <Icon icon="tabler:upload" width={'18px'} height={'18px'} />
                                                    </p>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>))
                                )
                                :
                                (<div style={{ width: `${widthValue[1]}` }}
                                    className="borderLessonList">
                                    <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                        <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                            <div
                                                style={{ left: '55%' }}
                                                className="loader"
                                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                                            />
                                        </div>
                                    </div>
                                    <div className="topTitleAlignLesson" style={{ width: '20%' }}>

                                    </div>
                                    <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>

                                    </div>
                                </div>)
                            }

                        </div>)
                        :
                        (<div className="contentAppendix">
                            <div className="topTitleAlign" style={{ width: widthValue[0] }}>
                                <div className='noContent'>
                                    <i className="iconNoContent fa-solid fa-ban"></i>
                                    <p>Không có dữ liệu</p>
                                </div>
                            </div>

                            <div style={{ width: `${widthValue[1]}` }}
                                className="borderLessonList">
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
                            </div>
                        </div>)
                    )
                    :
                    (<div className="contentAppendix">
                        <div className="topTitleAlign" style={{ width: widthValue[0] }}>

                        </div>

                        <div style={{ width: `${widthValue[1]}` }}
                            className="borderLessonList">
                            <div className="topTitleAlignLesson" style={{ width: '70%' }}>
                                <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                    <div
                                        style={{ left: '55%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            </div>
                            <div className="topTitleAlignLesson" style={{ width: '20%' }}>

                            </div>
                            <div className="topTitleAlignLesson" style={{ width: '10%', border: 'none' }}>

                            </div>
                        </div>
                    </div>)
                }


            </div>
            {showPopUp && <ViewDocumentHod isShowUpload={true} getDataFromChild={handleViewDocumentHod} lessonPlan={nameFileDepartment ? [nameFileDepartment] : []} loadingStatus={nameFileDepartment ? false : 'no'} appendix={'2'} userLoginValue={userLoginvalue} subjectSelect={nameFileDepartment} deleteItemList={deleteItemList} />}
            {showPopUpDoc && <ViewDoc getDataFromChild={handleViewDoc} urlDoc={urlDoc} nameLessonPlan={nameLessonPlan} />}
            {showSuccess && <Success message={msgSuccess} />}
        </div>
    )
}

export default ViewAppendix2