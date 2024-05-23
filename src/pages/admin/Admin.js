import React, { useRef, useState, useEffect, createContext, Suspense } from 'react'
import axios from 'axios'
import { url } from '../../Config/config'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import SideBarAdmin from '../components/SideBarAdmin'
import DeleteConfirm from '../components/popUp/DeleteConfirm'
import Success from '../components/popUp/Success'
import ModifySchool from '../components/popUp/ModifySchool'
import ViewSchool from '../components/popUp/ViewSchool'
import { loadEffect } from '../components/Ultility'
import { useNavigate } from 'react-router-dom'
import {
    findPriorityValue,
    handleAccess,
    handleAccessPage,
    handleDecrypt,
    roles,
} from '../components/Ultilities/CommonFunction'
// import OverallSubjects from '../components/OverallSubjects'
import ListDeletedSchools from '../components/ListDeletedSchools'
import UploadPopUpAdmin from '../components/popUp/UploadPopUpAdmin'

export const LoadingContext = createContext()
export const modifyContext = createContext()
const ListShool = React.lazy(() => {
    return import('../components/ListSchool').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})
const ListLessonPlan = React.lazy(() => {
    return import('../components/ListLessonPlan').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})

const OverallSubjects = React.lazy(() => {
    return import('../components/OverallSubjects').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})

function Admin() {
    const [isShowSideBar, setIsShowSideBar] = useState(true)
    const [isShowPopUpDelete, setIsShowPopUpDelete] = useState(false)
    const [isShowPopUpAdd, setIsShowPopUpAdd] = useState(false)
    const [isShowPopUpView, setIsShowPopUpView] = useState(false)
    const [isShowListSchool, setIsShowListSchool] = useState(true)
    const [isShowTemplate, setIsShowTemplate] = useState(false)
    const [isShowSubject, setIsShowSubject] = useState(false)
    const [isShowDeletedSchools, setIsShowDeletedSchools] = useState(false)
    const [isCheckCircle, setIsCheckCircle] = useState(false)
    const [typeModify, setTypeModify] = useState('')
    const [msg, setMsg] = useState('')
    const hidePopUp = useRef('')
    const [data, setData] = useState(-1)
    const [provinces, setProvinces] = useState([])
    const [dataModify, setDataModify] = useState()
    const [dataSearch, setDataSearch] = useState('')
    const [showDeleteOverallSubject, setShowDeleteOverallSubject] = useState(false)
    const [overallSubjectDelete, setOverallSubjectDelete] = useState()
    const [showSuccess, setShowSuccess] = useState(false)
    const [listFileData, setListFileData] = useState([])
    const [listFileDataTemp, setListFileDataTemp] = useState([])
    const [listDataUpload, setListDataUpload] = useState([])
    const [listDataDelete, setListDataDelete] = useState([])
    const [dataResetSearch, setDataResetSearch] = useState(null)

    const handleShowMenu = (data) => {
        setIsShowSideBar(data)
    }

    const handleKeySearch = (data) => {
        setDataSearch(data)
    }

    const [message, setMessage] = useState({})
    const [dataSchool, setDataSchool] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        handleAccessPage(navigate, 4)
    }, [])

    const fetchDataAppendixPattern = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Plan/GetSample`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        setListFileData(response.data)
                        setListFileDataTemp(JSON.parse(JSON.stringify(response.data)))

                    }
                })
                .catch((error) => {
                    // Handle error
                    setListFileData([])
                    console.error('Error:', error)
                })
        } else {
            setListFileData([])
        }

    }

    const fetchDataAppendixPatternUpload = async (data) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Plan/GetSample`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        if (data.length > 0) {
                            const data2 = response.data
                            const filteredList1 = data.filter(item1 => !data2.some(item2 => item2.name === item1.file.name));
                            setListDataUpload(filteredList1)
                        }
                        setListFileData(response.data)
                    }
                })
                .catch((error) => {
                    // Handle error
                    setListFileData([])
                    console.error('Error:', error)
                })
        }
    }
    const fetchDataAppendixPatternDelete = async (data) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + `api/Plan/GetSample`, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((response) => {
                    // Handle success
                    if (response.data) {
                        if (data.length > 0) {
                            const newArray = listDataDelete.filter(item => item !== data);
                            setListDataDelete(newArray)
                        }
                        setListFileData(response.data)
                    }
                })
                .catch((error) => {
                    // Handle error
                    setListFileData([])
                    console.error('Error:', error)
                })
        }
    }


    const getDataViewSchool = async (id) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            try {
                const response = await axios.get(url + 'api/School/GetSchoolById/' + id, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    },
                })
                setDataSchool(response.data)
            } catch (error) {
                setDataSchool([])
                console.error('Error fetching data2:', error)
            }
        } else {
            setDataSchool([])
        }
    }

    const fetchDataProvince = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            try {
                const response = await axios.get(url + 'api/Province/GetAllProvinces', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })

                const parsedData = response.data.map((item) => {
                    return {
                        provinceCode: item.provinceCode,
                        provinceName: item.provinceName,
                    }
                })

                setProvinces(parsedData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    }

    const handleDelete = (data) => {
        if (data === 'delete') {
            setMsg('Xoá thành công')
            setData(2)
        } else if (data === 'cancel') {
            setIsShowPopUpDelete(false)
        } else if (data === '5') {
            setIsShowPopUpDelete(false)
            setIsCheckCircle(true)
            const timeout = setTimeout(() => {
                setIsCheckCircle(false)
            }, 900)

            return () => {
                clearTimeout(timeout)
            }
        }
    }
    const handleAdd = (data, msg) => {
        if (msg === 'add') {
            setDataModify(data)
            setData(3)
            setDataSchool({})
        } else if (msg === 'edit') {
            setDataModify(data)
            setData(1)
            setDataSchool({})
        } else if (msg === '6') {
            setDataModify(null)
            setMsg('Cập nhật trường thành công')
            setIsShowPopUpAdd(false)
            setDataSchool({})
            setData(-1)
            setIsCheckCircle(true)
            const timeout = setTimeout(() => {
                setIsCheckCircle(false)
            }, 900)

            return () => {
                clearTimeout(timeout)
            }
        } else if (msg === '7') {
            setDataModify(null)
            setMsg('Thêm trường thành công')
            setIsShowPopUpAdd(false)
            setDataSchool({})
            setData(-1)
            setIsCheckCircle(true)
            const timeout = setTimeout(() => {
                setIsCheckCircle(false)
            }, 900)

            return () => {
                clearTimeout(timeout)
            }
        } else if (msg === 'cancel') {
            setIsShowPopUpAdd(false)
            setDataSchool({})
        }
    }
    const handleView = (data) => {
        if (data === 'cancel') {
            setIsShowPopUpView(false)
            setDataSchool({})
        }
    }
    const handleChangeTab = (data) => {
        if (data === '1') {
            setDataResetSearch(data)
            setIsShowTemplate(false)
            setIsShowSubject(false)
            setIsShowDeletedSchools(false)
            setIsShowListSchool(true)
        } else if (data === '2') {
            setDataResetSearch(data)
            setIsShowListSchool(false)
            setIsShowSubject(false)
            setIsShowDeletedSchools(false)
            fetchDataAppendixPattern()
            setIsShowTemplate(true)
        } else if (data === '3') {
            setDataResetSearch(data)
            setIsShowListSchool(false)
            setIsShowTemplate(false)
            setIsShowDeletedSchools(false)
            setIsShowSubject(true)
        } else if (data === '4') {
            setDataResetSearch(data)
            setIsShowListSchool(false)
            setIsShowTemplate(false)
            setIsShowSubject(false)
            setIsShowDeletedSchools(true)
        }
    }

    const handleMessageActionChange = (newMessageAction) => {
        setData(newMessageAction)
    }

    const handlePopupShow = (e) => {
        if (hidePopUp.current && !hidePopUp.current.contains(e.target)) {
            setIsShowPopUpView(false)
            setDataSchool({})
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handlePopupShow)
        return () => {
            document.removeEventListener('mousedown', handlePopupShow)
        }
    }, [])

    const handleDataRequest = (msg, data) => {
        if (msg === '2') {
            setMessage({
                title: 'Khoá trường học',
                content:
                    'Bạn có chắc chắn muốn khoá " ' +
                    Object.values(data)[1] +
                    ' " trong hệ thống không ?',
                button: 'Khoá',
            })
            setIsShowPopUpDelete(true)
        } else if (msg === '1') {
            fetchDataProvince()
            getDataViewSchool(Object.values(data)[0])
            setTypeModify(1)

            setMessage({
                title: 'Chỉnh sửa trường học',
                button: 'Lưu',
            })
            setIsShowPopUpAdd(true)
        } else if (msg === '0') {
            getDataViewSchool(Object.values(data)[0])
            setIsShowPopUpView(true)
        } else if (msg === '4') {
            setDataSchool(null)
            setIsShowPopUpAdd(true)
            setTypeModify(0)
            setMessage({
                title: 'Thêm Trường học mới',
                button: 'Tạo',
            })
        } else if (msg === '5') {
            handleDelete('5')
        } else if (msg === '6') {
            handleAdd({}, '6')
        } else if (msg === '7') {
            handleAdd({}, '7')
        } else if (msg === '-1') {
            setData(-1)
        }
    }
    const addNewFiles = (selectedFiles, savedFiles) => {
        if (savedFiles.length > 0) {
            // Lọc ra các tệp có tên không trùng lặp

            const newFiles = selectedFiles.filter(selectedFile => {
                return !savedFiles.some(savedFile => savedFile.file.name === selectedFile.file.name);
            });

            // Trả về mảng các tệp mới
            return newFiles;
        } else {
            // Nếu không có tệp nào đã lưu, trả về tất cả các tệp đã chọn
            return selectedFiles;
        }
    };

    const handleSaveDataUpload = (data) => {
        if (data.length > 0) {
            const dataTemp = []
            for (let i = 0; i < data.length; i++) {
                const file = data[i];
                dataTemp.push(file)
            }
            const dataUpdated = addNewFiles(dataTemp, listDataUpload)
            return dataUpdated
        }
    }

    const handleDataLessonPlanRequest = (type, data) => {
        if (type === '1') {
            if (data.length > 0) {
                const dataUpdated = handleSaveDataUpload(data)
                if (dataUpdated.length > 0 && listDataUpload.length > 0) {
                    setListDataUpload(prev => [...prev, dataUpdated])
                } else if (dataUpdated.length > 0 && listDataUpload.length === 0) {
                    setListDataUpload(dataUpdated)
                } else {
                    setListDataUpload([])
                }
                handleUploadData(data, dataUpdated)
            }
        } else if (type === '2') {
            setListDataDelete(data)
            deleteFilePattern(data)
        }
    }

    const handleUploadData = (data, dataUpdated) => {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const file = data[i];
                const formData = new FormData();

                // Update the formData object
                formData.append(
                    "file",
                    file.file,
                    file.file.name
                );
                uploadFileData(formData, file.file.name, dataUpdated)
            }
        }
    }


    const uploadFileData = async (formData, name, dataUpdated) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios.post(url + `api/Plan/UploadSample`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            })
                .then(response => {
                    fetchDataAppendixPatternUpload(dataUpdated)
                })
                .catch(error => {

                    console.error('Error uploading file:', error);
                });
        }
    }

    const deleteFilePattern = async (dataName) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios.delete(url + `api/Plan/DeleteSample?fileName=${dataName}`, {
                headers: {
                    'Authorization': `Bearer ${dataUserToken}`
                }

            })
                .then(response => {
                    fetchDataAppendixPatternDelete(dataName)
                })
                .catch(error => {
                    console.error('Lỗi khi xóa tài nguyên:', error);
                });
        }
    }

    const propsForListSchool = {
        getDataFromChild: handleDataRequest,
        handleMessageActionChange: handleMessageActionChange,
        keySearch: dataSearch,
    }

    useEffect(() => {
        if (dataSearch) {
            if (dataSearch.trim()) {
                if (isShowTemplate) {
                    const dataTemp = JSON.parse(JSON.stringify(listFileDataTemp))
                    if (dataTemp.length > 0) {
                        const results = dataTemp.filter(item => item.name.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()));
                        setListFileData(results)
                    }
                }
            } else {
                setListFileData(JSON.parse(JSON.stringify(listFileDataTemp)))
                //them code reset lai du lieu khi search trong
            }
        } else {
            setListFileData(JSON.parse(JSON.stringify(listFileDataTemp)))
            //them code reset lai du lieu khi search trong
        }
    }, [dataSearch])

    const propsForListLessonplan = {
        getDataFromChild: handleDataLessonPlanRequest,
        handleMessageActionChange: handleMessageActionChange,
        keySearch: dataSearch,
        listFileData: listFileData,
        listDataUpload: listDataUpload,
        listDataDelete: listDataDelete
    }

    const handleDeleteOverallSubject = async (data) => {
        if (data === 'cancel') {
            setShowDeleteOverallSubject(false)
        } else if (data === 'delete') {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .delete(url + overallSubjectDelete.path, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        // console.log(res)
                        if (overallSubjectDelete.hasOwnProperty('loadNewObjects')) {
                            overallSubjectDelete.loadNewObjects()
                        }
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                            setShowDeleteOverallSubject(false)
                        }, 2300)

                        return () => {
                            clearTimeout(timeout)
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
        }
    }

    const getOverallSubjectDelete = (data) => {
        setShowDeleteOverallSubject(true)
        setOverallSubjectDelete(data)
    }

    return (
        <div>
            <Header
                showMenuRole={'4'}
                getDataFromChild={handleShowMenu}
                getKeySearchFromChild={handleKeySearch}
                dataResetSearch={dataResetSearch}
            />
            <div id="admin-wrapper">
                <div className="admin-content">
                    <SideBar
                        stateShow={isShowSideBar}
                        children={<SideBarAdmin getDataFromChild={handleChangeTab} />}
                    />
                    {isShowListSchool && (
                        <div style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}>
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
                                <LoadingContext.Provider value={{ data, dataModify }}>
                                    <ListShool {...propsForListSchool} />
                                </LoadingContext.Provider>
                            </Suspense>
                        </div>
                    )}

                    {isShowTemplate && (
                        <div style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}>
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
                                <ListLessonPlan {...propsForListLessonplan} />
                            </Suspense>
                        </div>
                    )}

                    {isShowSubject && (
                        <div style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}>
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
                                <OverallSubjects getDeleteObject={getOverallSubjectDelete} dataSearch={dataSearch} />
                            </Suspense>
                        </div>
                    )}

                    {isShowDeletedSchools && (
                        <div style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}>
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
                                <ListDeletedSchools dataSearch={dataSearch} />
                            </Suspense>
                        </div>
                    )}

                    {isShowPopUpDelete && (
                        <DeleteConfirm getDataFromChild={handleDelete} messageDelete={message} />
                    )}
                    {showDeleteOverallSubject && (
                        <DeleteConfirm
                            getDataFromChild={handleDeleteOverallSubject}
                            messageDelete={overallSubjectDelete}
                        />
                    )}
                    {showSuccess && <Success message={'Xóa thành công'} />}
                </div>
                {isCheckCircle && <Success message={msg} />}

                {isShowPopUpAdd && (
                    <ModifySchool
                        getDataFromChild={handleAdd}
                        dataSchool={dataSchool}
                        dataProvinces={provinces}
                        message={message}
                        typeModify={typeModify}
                    />
                )}
                {isShowPopUpView && (
                    <ViewSchool
                        getDataFromChild={handleView}
                        dataSchool={dataSchool}
                        ref={hidePopUp}
                    />
                )}
            </div>
        </div>
    )
}

export default Admin
