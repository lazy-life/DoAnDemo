import { useState, useEffect, useContext, useRef } from 'react';
import fileDownload from 'js-file-download'
import { Icon } from '@iconify/react'
import { indexAppendix } from "./Appendix"
import MenuViewDocument from './popUp/MenuViewDocument';
import UploadPopUpAdmin from './popUp/UploadPopUpAdmin';
import DeleteConfirm from './popUp/DeleteConfirm';
import ViewDoc from './popUp/ViewDoc';
import axios from 'axios';


const ListShool = ({ getDataFromChild, listFileData, listDataUpload, listDataDelete }) => {

    const selectAppendix = useContext(indexAppendix)
    const fileInputRef = useRef(null)

    const [showViewUpload, setShowViewUpload] = useState(false)
    const [deleteShow, setDeleteShow] = useState(false)
    const [showPopUpDoc, setShowPopUpDoc] = useState(false)
    const [deleteObject, setDeleteObject] = useState({})
    const [chooseFile, setChooseFile] = useState(null)
    const [urlDoc, setUrlDoc] = useState(null)
    const [nameLessonPlan, setNameLessonPlan] = useState(null)

    const [listRecentFile, setListRecentFile] = useState([])
    const [listFilePattern, setListFilePattern] = useState([])
    const [deleteItem, setDeleteItem] = useState([])


    const titleRecent = ['Tên tài liệu mẫu', '', '']
    const widthTitleRecent = ['95%', '5%']

    useEffect(() => {
        if (listFileData.length > 0) {
            let dataTemp = []
            for (let i = 0; i < listFileData.length; i++) {
                const file = listFileData[i];
                const fileExtension = file.name.split('.');
                dataTemp.push({
                    file: file,
                    extension: fileExtension[1]
                });
            }

            setListFilePattern(dataTemp)
        } else {
            setListFilePattern([])
        }
    }, [listFileData])

    useEffect(() => {
        if (listDataDelete.length > 0) {
            setDeleteItem(listDataDelete)
        } else {
            setDeleteItem([])
        }
    }, [listDataDelete])

    useEffect(() => {
        if (listDataUpload.length > 0) {
            setListRecentFile(listDataUpload)
        } else {
            setListRecentFile([])
        }
    }, [listDataUpload])

    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowPopUpDoc(false)
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Perform upload operation for each file
        }
    }

    const handleChooseFile = (data) => {
        setChooseFile(data)
    }

    const getDataDelete = (data) => {
        if (data === 'delete') {
            setDeleteShow(false)
            getDataFromChild('2', chooseFile.file.name)
        } else if (data === 'cancel') {
            setDeleteShow(false)
        }
    }

    const handleViewFile = (name, url) => {
        if (url) {
            setUrlDoc(url)
            setNameLessonPlan(name)
            setShowPopUpDoc(true)
        }
    }

    const handleActionPopUp = (data) => {
        try {
            if (data === 2) {
                setDeleteObject({
                    idObject: 1,
                    title: 'Xoá tài liệu',
                    content: `Bạn có muốn xoá tài liệu ${chooseFile.file.name} không?`,
                    path: ''
                })
                setDeleteShow(true)
            } else if (data === 3) {
                setNameLessonPlan(chooseFile.file.name)
                setUrlDoc(chooseFile.file.url)
                setShowPopUpDoc(true)
            } else if (data === 4) {
                axios
                .get(chooseFile.file.url, {
                    responseType: 'blob'
                })
                .then((response) => {
                    fileDownload(response.data, chooseFile.file.name)
                })
            }
        } catch (error) {
            // alert(error)
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

    const handleUploadAppendixPattern = (data) => {
        if (data === 'close') {
            setShowViewUpload(false)
        } else {
            setShowViewUpload(false)
            const dataUpdated = addNewFiles(data, listFilePattern)
            // setListRecentFile(dataUpdated)
            if (dataUpdated.length > 0) {
                getDataFromChild('1', dataUpdated)
            }
        }
    }


    return (
        <div id="listLessonplan-wrapper">
            <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".docx, .doc, .pdf"
            />
            <div className='tableListSchool'>
                <div className='topListSchool'>
                    <p></p>
                    <button onClick={() => { setShowViewUpload(true) }}>
                        <div className='btnAddSchool'>
                            <Icon icon="fa6-solid:plus" />
                            <p>Thêm tài liệu mẫu</p>
                        </div>
                    </button>
                </div>

                <div className="contentAppendix">
                    <div className="topRecent">
                        <p style={{ width: widthTitleRecent[0] }}>{titleRecent[0]}</p>
                        <p style={{ width: widthTitleRecent[3] }}></p>
                    </div>

                    <div className="contentRecent">
                        {listRecentFile.length > 0 || listFilePattern.length > 0
                            ? (<>
                                {listRecentFile.length > 0 && listRecentFile.map((item) => (
                                    <div key={item.id} className="perScorm" style={{ opacity: '0.5' }}>
                                        <div className="fileName">
                                            <div className="recentFileName" style={{ width: widthTitleRecent[0] }}>
                                                {item.extension === 'pdf'
                                                    ?
                                                    <Icon icon="uiw:file-pdf" style={{ color: '#D82E18' }} />
                                                    :
                                                    (
                                                        item.extension === 'docx' || item.extension === 'doc'
                                                            ?
                                                            <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                                                            :
                                                            <Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />
                                                    )
                                                }
                                                <p>{item.file.name}</p>
                                            </div>

                                            <div style={{ width: widthTitleRecent[3] }} className="menu">
                                                <Icon icon="line-md:uploading-loop" width="1.5rem" height="1.5rem" style={{ color: '#c20000' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {listFilePattern.length > 0 && listFilePattern.map((file) => (
                                    deleteItem.includes(file.file.name)
                                        ?
                                        (<div key={file.id} className="perScorm" style={{ opacity: '0.5' }}>
                                            <div className="fileName" onClick={() => handleChooseFile(file)}>
                                                <div className="recentFileName" style={{ width: widthTitleRecent[0] }} onClick={() => handleViewFile(file.file.name, file.file.url)}>
                                                    {file.extension === 'pdf'
                                                        ?
                                                        <Icon icon="uiw:file-pdf" style={{ color: '#D82E18' }} />
                                                        :
                                                        (
                                                            file.extension === 'docx' || file.extension === 'doc'
                                                                ?
                                                                <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                                                                :
                                                                <Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />
                                                        )

                                                    }
                                                    <p style={{ textDecoration: 'line-through' }}>{file.file.name}</p>
                                                </div>

                                                <div style={{ width: widthTitleRecent[3] }} className="menu">
                                                    <Icon icon="eos-icons:loading" style={{ color: '#c20000' }} />
                                                </div>
                                            </div>
                                        </div>)
                                        :
                                        (<div key={file.id} className="perScorm">
                                            <div className="fileName" onClick={() => handleChooseFile(file)}>
                                                <div className="recentFileName" style={{ width: widthTitleRecent[0] }} onClick={() => handleViewFile(file.file.name, file.file.url)}>
                                                    {file.extension === 'pdf'
                                                        ?
                                                        <Icon icon="uiw:file-pdf" style={{ color: '#D82E18' }} />
                                                        :
                                                        (
                                                            file.extension === 'docx' || file.extension === 'doc'
                                                                ?
                                                                <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                                                                :
                                                                <Icon icon="ri:file-unknow-fill" style={{ color: '#6b6b6b' }} />
                                                        )

                                                    }
                                                    <p>{file.file.name}</p>
                                                </div>

                                                <div style={{ width: widthTitleRecent[3] }} className="menu">
                                                    <MenuViewDocument getDataFromChild={handleActionPopUp} />
                                                </div>
                                            </div>
                                        </div>)
                                ))}
                            </>)
                            : (
                                <div className="topTitleAlignLesson" style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left' }}>
                                    <div className='noContent' style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left', fontSize: '40px' }}>
                                        <i className="iconNoContent fa-solid fa-ban"></i>
                                        <p style={{ fontSize: '18px', marginTop: '.5rem' }}>Không có dữ liệu</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {showViewUpload && <UploadPopUpAdmin getDataFromChild={handleUploadAppendixPattern} />}
            {deleteShow && (
                <DeleteConfirm getDataFromChild={getDataDelete} messageDelete={deleteObject} />
            )}
            {showPopUpDoc && (
                <ViewDoc
                    getDataFromChild={handleViewDoc}
                    urlDoc={urlDoc}
                    nameLessonPlan={nameLessonPlan}
                />
            )}
        </div>
    )
}

export default ListShool