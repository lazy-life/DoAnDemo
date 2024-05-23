import { useEffect, createContext, useRef, useState } from "react"
import { Link } from 'react-router-dom';
import { Icon } from "@iconify/react"
import ListAppendix from "./ListAppendix"
import AppendixPattern from "./AppendixPattern"
import ScormPlayer from "./ScormPlayer"
import ViewDocument from "./popUp/ViewDocument"
import ListAppendix3 from "./ListAppendix3"
import { handleDecrypt } from "./Ultilities/CommonFunction";
import axios from "axios";
import ViewDoc from "./popUp/ViewDoc";
import UploadWait from "./popUp/uploadWait";
import Success from "./popUp/Success";
import { url } from "../../Config/config";
import ErrorPopup from "./popUp/ErrorPopUp";

export const indexAppendix = createContext()
const Appendix = () => {
    const [selectTitle, setSelectTitle] = useState(4)
    const [showPopUp, setShowPopUp] = useState(false)
    const [showPopUpScorm, setShowPopUpScorm] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [uploadWait, setUploadWait] = useState(false)
    const [isUpload, setIsUpload] = useState('')
    const hidePopUp = useRef('')
    const [userLoginValue, setUserLoginValue] = useState(null)
    const [lessonPlan, setLessonPlan] = useState([])
    const [webInfor, setWebInfor] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)
    const [appendix, setAppendix] = useState(null)
    const [subjectSelect, setSubjectSelect] = useState(null)
    const [loadingStatus, setLoadingStatus] = useState(null)
    const [loadingAppendix3, setLoadingAppendix3] = useState(null)
    const [loadAppendix4, setLoadingAppendix4] = useState(null)
    const [subjectId, setSubjectId] = useState(null)
    const [dataUpload, setDataUpload] = useState([])
    const [checkDataUploadSucess, setCheckDataUploadSucess] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [indentityNumber, setIndentityNumber] = useState(0)
    const [msgSuccess, setMsgSuccess] = useState(null)
    const [showPopupError, setShowPopupError] = useState(false)
    const [deleteItemList, setDeleteItemList] = useState([])
    const [checkChangeAppendix4, setCheckChangeAppendix4] = useState('')
    const [checkChangeAppendix3, setCheckChangeAppendix3] = useState('')

    const handleSelectedTitle = (index) => {
        setSelectTitle(index)
    }

    const handleView = (id, data, subjectIdData, appendix) => {
        setCheckChangeAppendix4('noChange')
        setLoadingAppendix4('noload')
        handleViewLessonPlan()
        setLoadingStatus(true)
        setShowPopUp(data)
        setIsUpload(id)
        setAppendix(appendix)
        setSubjectSelect({ 'id': subjectIdData })
        setSubjectId(subjectIdData)
        fetchDataViewListScorm(subjectIdData, userLoginValue.userId)
    }

    const handleView3 = (id, data, dataPlan, appendix, subjectSelect) => {
        setCheckChangeAppendix3('noChange')
        setLoadingAppendix3('noload')
        handleViewLessonPlan()
        setLoadingStatus(true)
        setShowPopUp(data)
        setIsUpload(id)
        setAppendix(appendix)
        setSubjectSelect(subjectSelect)
        setSubjectId(subjectSelect.id)
        fetchDataViewListPlan3(subjectSelect.id, userLoginValue.userId);

    }

    const handleViewLessonPlan = () => {
        setLessonPlan([])
    }

    const handleIdentityNumberFile = () => {
        setIndentityNumber(indentityNumber + 1)
    }
    const handleViewScorm = (id, data) => {
        if (id === 'close') {
            if (!showPopUpDoc && !showPopUpScorm) {
                setLoadingStatus(false)
            }
            setShowPopUp(false)
        } else if (id === '3') {
            setLoadingAppendix3('load')
        } else if (id === '4') {
            setLoadingAppendix3('upload')
        } else if (id === '5') {
            handleIdentityNumberFile()
            handleUploadFile(data)
        } else if (id === '6') {
            setLoadingAppendix4('load')
        } else if (id === '7') {
            handleUploadItem(data.dataDeleteItem, data.appendixType)
            deleteLessonPLan(data.subjectSelectedId, data.userDataId, data.lessonSelectedId, data.appendixType, data.dataDeleteItem)
        } else {
            if (id.fileExtension === '.zip') {
                setWebInfor({
                    'name': id.name,
                    'staticSiteUrl': id.staticSiteUrl
                })
                setShowPopUpScorm(data)
                setShowPopUp(false)
            } else if (id.fileExtension === '.docx' || id.fileExtension === '.pdf') {
                fetDataDocUrl(id.id, appendix)
                setNameLessonPlan(id.name)
                setShowPopUpDoc(true)
                setShowPopUp(false)
            }
        }
    }

    const handleUploadItem = (itemId, appendixData) => {
        const dataItem = {
            id: itemId,
            appendixType: appendixData
        }
        setDeleteItemList(prev => [...prev, dataItem])
    }
    const UploadWaitSendData = (id, appendixType, fileName, status, number) => {
        const dataUploading = {
            'id': id,
            'appendix': appendixType,
            'name': fileName,
            'status': status,
            'number': number
        }
        setDataUpload(prev => [...prev, dataUploading])
    }

    const handleUploadSuccess = (typeLesson, id, number) => {
        if (typeLesson && id) {
            dataUpload.forEach(item => {
                if (item.appendix === typeLesson && item.id === id && item.number === number) {
                    item.status = '1'
                    item.appendix = 'a'
                }
            })
        }
    }

    const handleUploadError = (typeLesson, id, number) => {
        if (typeLesson && id) {
            dataUpload.forEach(item => {
                if (item.appendix === typeLesson && item.id === id && item.number === number) {
                    item.status = '2'
                    item.appendix = 'b'
                }
            })
        }
    }

    useEffect(() => {
        if (checkDataUploadSucess) {
            if (checkDataUploadSucess.status) {
                handleUploadSuccess(checkDataUploadSucess.appendixType, checkDataUploadSucess.id, checkDataUploadSucess.number)
            } else if (!checkDataUploadSucess.status) {
                setErrorMsg(`Tài liệu ${checkDataUploadSucess.nameFile} của bạn chứa tệp tin không an toàn!`)
                setShowPopupError(true)
                handleUploadError(checkDataUploadSucess.appendixType, checkDataUploadSucess.id, checkDataUploadSucess.number)
            }
            setCheckDataUploadSucess(null)
        }
    }, [checkDataUploadSucess])

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

            if (appendix === '4') {
                if (fileExtensionSplit === 'zip') {
                    if (userLoginValue) {
                        setUploadWait(true)
                        if (userLoginValue.userId && subjectId && appendix && formData) {
                            UploadWaitSendData(subjectId, appendix, fileData.name, '0', indentityNumber)
                            uploadScromData(userLoginValue.userId, subjectId, appendix, formData, indentityNumber)
                        }
                    }
                } else {
                    if (userLoginValue) {
                        setUploadWait(true)
                        if (userLoginValue.userId && subjectId && appendix && formData) {
                            UploadWaitSendData(subjectId, appendix, fileData.name, '0', indentityNumber)
                            uploadFileData(userLoginValue.userId, subjectId, appendix, formData, indentityNumber)
                        }

                    }
                }
            } else if (appendix === '3') {
                if (fileExtensionSplit === 'zip') {

                } else {
                    if (userLoginValue) {
                        setUploadWait(true)
                        if (userLoginValue.userId && subjectId && appendix && formData) {
                            UploadWaitSendData(subjectId, appendix, fileData.name, '0', indentityNumber)
                            uploadFileData(userLoginValue.userId, subjectId, appendix, formData, indentityNumber)
                        }
                    }
                }
            }
        } catch (error) {

        }

    }

    const uploadFileData = async (userId, id, typeLesson, formData, number) => {
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
                    // Xử lý kết quả trả về từ API
                    // Đảm bảo rằng phần này chỉ được thực hiện sau khi axios.post đã hoàn thành

                    if (appendix === '4') {
                        fetchDataChangeStatusScorm((id, userLoginValue.userId))
                        setUploadWait(true);
                        setCheckDataUploadSucess({ 'id': id, 'appendixType': typeLesson, 'number': number, 'status': true, 'nameFile': formData.get("file").name })
                        setLoadingAppendix4('upload');
                        setCheckChangeAppendix4('change')
                        // fetchDataViewListScormUploadSucess(subjectId, userLoginValue.userId)
                    } else if (appendix === '3') {
                        setUploadWait(true);
                        setCheckDataUploadSucess({ 'id': id, 'appendixType': typeLesson, 'number': number, 'status': true, 'nameFile': formData.get("file").name })
                        setLoadingAppendix3('upload');
                        setCheckChangeAppendix3('change')
                        // fetchDataListLessonSubjectOfTeacher(userLoginValue.userId, id);
                    }
                })
                .catch(error => {
                    setCheckDataUploadSucess({ 'id': id, 'appendixType': typeLesson, 'number': number, 'status': false, 'nameFile': formData.get("file").name })
                    console.error('Error uploading file:', error);
                    // Handle error
                });
        }
    }

    const uploadScromData = async (userId, id, typeLesson, formData, number) => {

        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios.post(url + `api/Plan/UploadZipLessonPlanFile/${userId}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    fetchDataChangeStatusScorm((id, userLoginValue.userId))
                    setCheckDataUploadSucess({ 'id': id, 'appendixType': typeLesson, 'number': number, 'status': true, 'nameFile': formData.get("file").name })
                    setLoadingAppendix4('upload');
                    setCheckChangeAppendix4('change')
                    // fetchDataViewListScormUploadSucess(subjectId, userLoginValue.userId)
                })
                .catch(error => {
                    setCheckDataUploadSucess({ 'id': id, 'appendixType': typeLesson, 'number': number, 'status': false, 'nameFile': formData.get("file").name })
                    console.error('Error uploading file:', error);
                    // Handle error

                });
        }
    }

    const fetchDataViewListScormUploadSucess = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetLessonPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setLessonPlan(dataTemp)
                        setLoadingStatus(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLoadingStatus('noLoad')
                    console.error('Error:', error);
                });
        } else {
            setLoadingStatus('noLoad')
        }
    }

    const fetchDataListLessonSubjectOfTeacher = (userId, id) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetSubjectPlan/${userId}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setLessonPlan(dataTemp)
                        setLoadingStatus(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLoadingStatus('noLoad')
                });
        }
    }

    useEffect(() => {
        if (checkChangeAppendix4 === 'change' && selectTitle === 4) {
            fetchDataViewListScormUploadSucess(subjectId, userLoginValue.userId)
            setCheckChangeAppendix4('noChange')
        }
    }, [checkChangeAppendix4])

    useEffect(() => {
        if (checkChangeAppendix3 === 'change' && selectTitle === 3) {
            fetchDataListLessonSubjectOfTeacher(userLoginValue.userId, subjectId);
            setCheckChangeAppendix3('noChange')
        }
    }, [checkChangeAppendix3])

    const deleteLessonPLan = async (id, userId, planId, typeId, itemId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const urlT = url + `api/Plan/DeletePlan/${planId}/${typeId}`;

            await axios.delete(urlT, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    if (appendix === '4') {
                        let updatedItems = []
                        deleteItemList.forEach(x => {
                            if (x.id !== itemId && x.appendixType !== typeId) {
                                updatedItems.push(x)
                            }
                        })
                        setDeleteItemList(updatedItems)

                        setLoadingAppendix4('load')
                        setCheckChangeAppendix4('change')
                        // fetchDataViewListScormUploadSucess(subjectId, userLoginValue.userId)


                        setMsgSuccess('Xoá thành công')
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                        }, 1000)

                        return () => {
                            clearTimeout(timeout)
                        }
                    } else if (appendix === '3') {
                        let updatedItems = []
                        deleteItemList.forEach(x => {
                            if (x.id !== itemId && x.appendixType !== typeId) {
                                updatedItems.push(x)
                            }
                        })
                        setDeleteItemList(updatedItems)

                        setLoadingAppendix3('load')
                        setCheckChangeAppendix3('change')
                        // fetchDataListLessonSubjectOfTeacher(userLoginValue.userId, subjectId);


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
    const handlePlayScorm = (id, data) => {
        if (id === 'close') {
            setShowPopUp(true)
            setShowPopUpScorm(false)
        }
    }

    const handleCloseError = (data) => {
        if (data === 'cancel') {
            setShowPopupError(false)
        }
    }

    const handleLoadUploadFile = (data) => {
        if (data === 'close') {
            setUploadWait(false)
        }
    }

    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowPopUp(true)
            setShowPopUpDoc(false)
        }
    }

    const handlePopupShow = (e) => {
        if (hidePopUp.current && !hidePopUp.current.contains(e.target)) {
            setShowPopUp(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handlePopupShow);
        return () => {
            document.removeEventListener('mousedown', handlePopupShow);
        }
    }, [])

    const fetchDataViewListScorm = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetLessonPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setLessonPlan(dataTemp)
                        setLoadingStatus(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLessonPlan([])
                    setLoadingStatus(null)
                    console.error('Error:', error);
                });
        }
    }
    const fetchDataViewListPlan3 = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetSubjectPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        setLessonPlan(dataTemp)
                        setLoadingStatus(false)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLessonPlan([])
                    setLoadingStatus(null)
                    console.error('Error:', error);
                });
        }
    }

    const fetchDataChangeStatusScorm = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetLessonPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        const dataListChange = []

                        let lessonIdData = null

                        dataTemp.forEach(item => {
                            lessonIdData = item.lessonId
                            const dataChange = {
                                "planId": item.id,
                                "typeId": 4,
                                "status": 2,
                                "comment": null
                            }
                            dataListChange.push(dataChange)
                        })

                        fetchApproveListFile(dataListChange, lessonIdData)
                    }
                })
                .catch(error => {
                    // Handle error
                    setLessonPlan([])
                    setLoadingStatus(null)
                    console.error('Error:', error);
                });
        }
    }

    const fetchDataChangeStatusPlan3 = (lessonId, userId) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios.get(url + `api/Plan/GetSubjectPlan/${userId}/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    // Handle success
                    if (response.data) {
                        const dataTemp = response.data
                        const dataListChange = []
                        dataTemp.forEach(item => {
                            const dataChange = {
                                "planId": item.id,
                                "typeId": 3,
                                "status": 2,
                                "comment": null
                            }
                            dataListChange.push(dataChange)
                        })


                        fetchApproveFile(dataListChange, dataTemp.subjectId)

                    }
                })
                .catch(error => {
                    // Handle error
                    setLessonPlan([])
                    setLoadingStatus(null)
                    console.error('Error:', error);
                });
        }
    }

    const fetchApproveFile = async (requestData, subjectIdData) => {
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
            const apiUrl = url + 'api/Plan/UpdateGroupPlan'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    fetchDataViewListPlan3(subjectIdData, userLoginValue.userId);
                    if (requestData.status === 1) {
                        setMsgSuccess('Đã phê duyệt')
                    } else if (requestData.status === 0) {
                        setMsgSuccess('Đã từ chối')
                    }

                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        setShowPopUp(false)
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

    const fetchApproveListFile = async (requestData, lessonIdData) => {
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
            const apiUrl = url + 'api/Plan/UpdateGroupPlan'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    fetchDataViewListScorm(lessonIdData, userLoginValue.userId);
                    if (requestData.status === 1) {
                        setMsgSuccess('Đã phê duyệt')
                    } else if (requestData.status === 0) {
                        setMsgSuccess('Đã từ chối')
                    }

                    setShowSuccess(true)
                    const timeout = setTimeout(() => {
                        setShowSuccess(false)
                        setShowPopUp(false)
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

    const titleAppendix4 = ['Tên môn học', 'Tên khối', 'Tên bài học', 'Ngày nộp', '']
    const titleAppendix3 = ['Tên môn học', 'Tên khối', 'Tên tài liệu', 'Ngày nộp', '']

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'));

        if (value !== null) {
            const dataUser = handleDecrypt(value)
            setUserLoginValue(dataUser)
        }
    }, [])

    return (
        <div>
            <div id="appendix-wrapper">
                <div id="appendixBorder">
                    <div className="titleAppendix">
                        <div className="leftTitleAppendix">
                            <div
                                className={selectTitle === 4 ? 'selectTitle' : 'titleName'}
                                onClick={() => handleSelectedTitle(4)}
                            >
                                <Icon
                                    icon="heroicons-outline:document-text"
                                    width={'22px'}
                                    height={'22px'}
                                />
                                <p>Kế hoạch bài dạy</p>
                            </div>
                            <div
                                className={selectTitle === 3 ? 'selectTitle' : 'titleName'}
                                onClick={() => handleSelectedTitle(3)}
                            >
                                <Icon
                                    icon="heroicons-outline:document-text"
                                    width={'22px'}
                                    height={'22px'}
                                />
                                <p>Kế hoạch giáo dục của giáo viên</p>
                            </div>
                            <div
                                className={selectTitle === 1 ? 'selectTitle' : 'titleName'}
                                onClick={() => handleSelectedTitle(1)}
                            >
                                <Icon icon="bi:eye" width={'22px'} height={'22px'} />
                                <p>Tài liệu mẫu</p>
                            </div>
                        </div>
                        <div className="rightTitleAppendix">
                            <Link to="/hompageTeacher">
                                <button>
                                    <p>Giảng dạy</p>
                                </button>
                            </Link>
                        </div>
                    </div>

                    <indexAppendix.Provider value={selectTitle}>
                        <div className="appendix-4">
                            {selectTitle === 4 && (
                                <ListAppendix
                                    title={titleAppendix4}
                                    getDataFromChild={handleView}
                                    userLoginValue={userLoginValue}
                                    loadAppendix4={loadAppendix4}
                                />
                            )}
                            {selectTitle === 3 && (
                                <ListAppendix3
                                    title={titleAppendix3}
                                    getDataFromChild={handleView3}
                                    userLoginValue={userLoginValue}
                                    loadingAppendix3={loadingAppendix3}
                                />
                            )}
                            {selectTitle === 1 && <AppendixPattern title={titleAppendix3} />}
                        </div>
                    </indexAppendix.Provider>
                </div>
            </div>

            {showPopUp && (
                <div style={{ position: 'fixed', zIndex: 12, margin: 0 }}>
                    <ViewDocument
                        isShowUpload={isUpload}
                        getDataFromChild={handleViewScorm}
                        lessonPlan={lessonPlan}
                        loadingStatus={loadingStatus}
                        appendix={appendix}
                        userLoginValue={userLoginValue}
                        subjectSelect={subjectSelect}
                        deleteItemList={deleteItemList}
                    />
                </div>
            )}
            {showPopUpScorm && (
                <ScormPlayer getDataFromChild={handlePlayScorm} webInfor={webInfor} />
            )}
            {showPopUpDoc && (
                <ViewDoc
                    getDataFromChild={handleViewDoc}
                    urlDoc={urlDoc}
                    nameLessonPlan={nameLessonPlan}
                />
            )}
            {uploadWait && (
                <UploadWait getDataFromChild={handleLoadUploadFile} dataUpload={dataUpload} />
            )}
            {showSuccess && <Success message={msgSuccess} />}
            {showPopupError && <ErrorPopup handleClose={handleCloseError} errorMsg={errorMsg} />}
        </div>
    )
}

export default Appendix