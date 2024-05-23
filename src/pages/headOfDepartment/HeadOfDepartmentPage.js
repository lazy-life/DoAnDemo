import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import '../../sass/main.scss'
import SideBar from '../components/SideBar'
import SideBarPrincipal from '../components/SideBarPrincipal'
import DeleteConfirm from '../components/popUp/DeleteConfirm'
import axios from 'axios'
import { url } from '../../Config/config'
import Success from '../components/popUp/Success'
import ModifySession from '../components/popUp/ModifySession'
import AddSemester from '../components/popUp/AddSemester'
import ApplyTimetable from '../components/popUp/ApplyTimetable'
import ViewDoc from '../components/popUp/ViewDoc'
import ApproveDoc from '../components/ApproveDoc'
import SideBarHeadOfDepartment from '../components/SideBarHeadOfDepartment'
import ReviewAppendix4 from '../components/ReviewAppendix'
import ReviewAppendix from '../components/ReviewAppendix'
import ViewAppendix from '../components/MakeAppendix'
import MakeAppendix from '../components/MakeAppendix'
import { findPriorityValue, handleAccess, handleAccessPage, handleDecrypt, roles } from '../components/Ultilities/CommonFunction'
import { useNavigate } from 'react-router-dom'
import ApproveScorm from '../components/popUp/ApproveScorm'
import DepartmentInformation from './DepartmentInformation'
import Syllabus from './Syllabus'

function HeadOfDepartmentPage() {
    const [isShowSideBar, setIsShowSideBar] = useState(true)
    const [deleteShow, setDeleteShow] = useState(false)
    const [modifyShow, setModifyShow] = useState(false)
    const [showApplyTimeTable, setShowApplyTimeTable] = useState(false)
    const [deleteObject, setDeleteObject] = useState({})
    const [pageName, setPageName] = useState('review-lesson-plans')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showAddSemester, setShowAddSemester] = useState(false)
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [approveScorm, seApproveScorm] = useState(false)
    const [userLoginData, setUserLoginData] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'))

        if (value !== null) {
            const dataUser = handleDecrypt(value)
            setUserLoginData(dataUser)
        }
    }, [])

    useEffect(() => {
        handleAccessPage(navigate, 2)
    }, [])

    const handleShowMenu = (data) => {
        setIsShowSideBar(data)
    }

    const getDeleteObject = (data) => {
        setDeleteShow(true)
        setDeleteObject(data)
    }

    const getChildrenPage = (data) => {
        setPageName(data)
    }

    const getDataDelete = async (data) => {
        if (data === 'cancel') {
            setDeleteShow(false)
        } else if (data === 'delete') {
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .delete(url + deleteObject.path, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }
                    })
                    .then((res) => {
                        setShowSuccess(true)
                        if (deleteObject.hasOwnProperty('loadNewObjects')) {
                            deleteObject.loadNewObjects()
                        }
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                            setDeleteShow(false)
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
    const getDataModify = (type, data) => {
        if (type === '1') {
            setShowSuccess(true)
            const timeout = setTimeout(() => {
                setShowSuccess(false)
                setModifyShow(false)
            }, 1500)

            return () => {
                clearTimeout(timeout)
            }
        } else if (type === '0') {
            setModifyShow(false)
        }
    }
    const handleClose = (type) => {
        if (type === '0') {
            setModifyShow(false)
        }
    }

    const handleActionClass = (type, date) => {
        if (type === '0') {
            setShowViewDoc(true)
        }
    }

    const handleGetDataFromChild = (type, data) => {
        if (type === '1') {
            setModifyShow(true)
        } else if (type === '') {
            setModifyShow(false)
        } else if (type === '2') {
            setShowAddSemester(true)
        } else if (type === '0') {
            setDeleteObject({
                idObject: 1,
                title: 'Xoá tiết học',
                content: 'Bạn có muốn xoá tiết 1 vào thứ 2 không?',
                path: 'api/department/delete/'
            })
            setDeleteShow(true)
        }
    }

    const handleAddSemester = (data) => {

    }

    const handleCloseAddSemester = (data) => {
        if (data === '0') {
            setShowAddSemester(false)
        }
    }
    const handleViewDoc = (type, data) => {
        if (type === '0') {
            setShowViewDoc(false)
        }
    }





    const urldoc = 'https://storage.googleapis.com/lessonplan/dfe?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=elp-capstone%40elp-capstone.iam.gserviceaccount.com%2F20240315%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240315T055643Z&X-Goog-Expires=10800&X-Goog-SignedHeaders=host&X-Goog-Signature=a3d16846c008b00494cf4c08af88fd21fdd3674ff0896beaf69eef7970c7d42fc37157d7e750746954955f0a91d1ee32845f472a774fcdd6c433ba4ae61abef4ed9e81e5e72ddda5a8adc0971a19bec1ede0848873752e20e5e25eaa0d524b0214383df7c1df3732a229ed65f1c1f82b6490622444ea2be5a329e8aeafc9ba63e44835509bb106db3c8dde795f864dc1cc58b39c420d798b0a1460c1715926b18cdb9462d139be207d7267e43108872c57291191a058b1ed2b2d3a78b3eed3422a1cf68deca00e97d86e6576cfd2f7dd58d1eb37cfdfd25391a6b68df5982e8b3e55a09757334fb8f5d031f94063b451abc192b5dab7fc77844f95f3db7db175'

    return (
        <div id="headOfDepartment-wrapper">
            <Header showMenuRole={'1'} getDataFromChild={handleShowMenu} />
            <div className="body d-flex">
                <SideBar
                    stateShow={isShowSideBar}
                    children={<SideBarHeadOfDepartment getChildrenPage={getChildrenPage} />}
                />
                <div
                    style={{ flex: isShowSideBar ? '1 0 80%' : '1 0 100%' }}
                    className="p-3 w-100 h-100"
                >
                    {pageName === 'review-lesson-plans' && <ReviewAppendix userLoginData={userLoginData} />}
                    {pageName === 'make-lesson-plans' && <MakeAppendix userLoginData={userLoginData} />}
                    {pageName === 'groupInfor' && <DepartmentInformation userLoginData={userLoginData} />}
                    {pageName === 'subjects' && <Syllabus userLoginData={userLoginData} getDeleteObject={getDeleteObject} />}
                </div>
            </div>
            {deleteShow && (
                <DeleteConfirm getDataFromChild={getDataDelete} messageDelete={deleteObject} />
            )}
            {showSuccess && <Success message={'Xóa thành công'} />}

            {modifyShow && <ModifySession getDataFromChild={getDataModify} handleClose={handleClose} />}
            {showAddSemester && <AddSemester getDataFromChild={handleAddSemester} handleClose={handleCloseAddSemester} />}
            {showApplyTimeTable && <ApplyTimetable />}
            {showViewDoc && <ApproveDoc getDataFromChild={handleViewDoc} urlDoc={urldoc} />}
            {approveScorm && <ApproveScorm />}
        </div>
    )
}

export default HeadOfDepartmentPage
