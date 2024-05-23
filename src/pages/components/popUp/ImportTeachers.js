import React, { useState, useRef, useEffect } from 'react'
import Success from './Success'
import * as XLSX from 'xlsx'
import '../../../sass/main.scss'
import axios from 'axios'
import { url } from '../../../Config/config'
import ErrorPopup from './ErrorPopUp'
import { handleDecrypt } from '../Ultilities/CommonFunction'
import fileDownload from 'js-file-download'
import LoadingDataWait from '../LoadingDataWait'

function ImportTeachers({ userLoginData, loadNewTeachers, closePopUp }) {
    const fileInputRef = useRef(null)
    const [showSuccessImport, setShowSuccessImport] = useState(false)
    const [fileError, setFileError] = useState(null)
    const [showError, setShowError] = useState(false)
    const [loadingWait, setLoadingWait] = useState(false)

    const isValidEmail = (email) => {
        // Regular expression for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const reader = new FileReader()
    const readFileExcel = async (file) => {
        return new Promise((resolve, reject) => {
            let teachers = []
            let errorMessage = null
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json(sheet)
                rows.forEach((row, rowIndex) => {
                    if (Object.values(row).length === 9 && rowIndex !== 0) {
                        const rowValue = Object.values(row)

                        let teacherName = rowValue[1]
                        let dob = XLSX.SSF.format('yyyy-MM-dd', rowValue[2])
                        const age = new Date().getFullYear() - new Date(dob).getFullYear()
                        if (age < 18) {
                            errorMessage = `Tuổi chưa đủ 18 ở số thứ tự ${rowIndex}!`
                        } else {
                            // errorMessage = null
                        }
                        let gender =
                            rowValue[3] === 'Nam' ? true : rowValue[3] === 'Nữ' ? false : ''
                        let email = null
                        if (isValidEmail(rowValue[4])) {
                            email = rowValue[4]
                            // errorMessage = null
                        } else {
                            errorMessage = `Email không hợp lệ ở số thứ tự ${rowIndex}!`
                        }
                        let phone = null
                        if (
                            rowValue[5].length === 10 &&
                            rowValue[5][0] === '0' &&
                            /^\d+$/.test(rowValue[5])
                        ) {
                            phone = rowValue[5]
                            // errorMessage = null
                        } else {
                            errorMessage = `Số điện thoại không hợp lệ ở số thứ tự ${rowIndex}!`
                        }
                        let address = rowValue[6]
                        let academicLevel = rowValue[7]
                        let subjectsCol = rowValue[8].split(',')
                        let subjects = subjectsCol.map((item) => {
                            let subjectWithGrade = item.trim()
                            let subjectArray = subjectWithGrade.split('(')
                            let isValidSubjects = false
                            if (
                                subjectArray.length === 2 &&
                                /[a-zA-Z0-9\s-]/.test(subjectArray[0].trim()) &&
                                /^\d+$/.test(subjectArray[1].trim().replace(/\D/g, '').trim()) &&
                                +subjectArray[1].trim().replace(/\D/, '').trim() <= 12
                            ) {
                                isValidSubjects = true
                            }
                            if (!isValidSubjects) {
                                errorMessage = `Tên môn học không hợp lệ ở số thứ tự ${rowIndex}!`
                                return null
                            } else {
                                // errorMessage = null
                                return {
                                    subjectName: subjectArray[0].trim(),
                                    grade: subjectArray[1].trim().replace(/\D/, '').trim(),
                                }
                            }
                        })

                        let teacher = {
                            fullname: teacherName,
                            dob: dob,
                            gender: gender,
                            email: email,
                            phoneNumber: phone,
                            address: address,
                            academicLevel: academicLevel,
                            subjects: subjects,
                        }
                        teachers.push(teacher)
                    } else if (Object.values(row).length > 1 && rowIndex !== 0) {
                        errorMessage = `Thông tin không đầy đủ ở số thứ tự ${rowIndex}!`
                    }
                })
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                resolve([teachers, errorMessage])
            }
            reader.onerror = (error) => {
                reject(error)
            }
            reader.readAsArrayBuffer(file)
        })
    }

    const handleButtonClick = () => {
        // Trigger click event of file input
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = (event) => {
        event.preventDefault()
        const selectedFile = event.target.files[0]
        let teachersPromise = readFileExcel(selectedFile)
        teachersPromise.then(([teacherList, errorMessage]) => {
            if (errorMessage === null) {
                setLoadingWait(true)
                addListTeachers(teacherList)
            } else {
                setFileError(errorMessage)
                setShowError(true)
            }
        })
    }

    const addListTeachers = async (teacherList) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .post(
                    url + 'api/User/AddListTeacherWithSubject/' + userLoginData.schoolId,
                    teacherList,
                    {
                        headers: {
                            'content-type': 'application/json',
                            Authorization: `Bearer ${dataUserToken}`,
                        },
                    }
                )
                .then((res) => {
                    loadNewTeachers()
                    setLoadingWait(false)
                    setShowSuccessImport(true)
                    const timeout = setTimeout(() => {
                        setShowSuccessImport(false)
                        closePopUp()
                    }, 2300)

                    return () => {
                        clearTimeout(timeout)
                    }
                })
                .catch((err) => {
                    // console.error(err)
                    setLoadingWait(false)
                    loadNewTeachers()
                    setFileError(err.response.data)
                    setShowError(true)
                })
        }
    }

    const closeError = () => {
        setShowError(false)
    }

    const handleDownloadFile = () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            axios
                .get(url + 'api/School/DownloadSampleFile/' + userLoginData.schoolId, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${dataUserToken}`,
                    },
                })
                .then((res) => {
                    fileDownload(res.data, `Mẫu-danh-sách-giáo-viên-${userLoginData.schoolLevel}.xlsx`)
                })
        }
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'upload-file-wrapper') {
            closePopUp()
        }
    }

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                closePopUp()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <div id="upload-file-wrapper" onClick={handleWrapperClick}>
            <div className="pop-up bg-white p-5">
                <p className="elp-text-title text-center">
                    Vui lòng tải lên dữ liệu theo cấu trúc của file mẫu
                </p>
                <div className="d-flex justify-content-between">
                    <button
                        className="handle-file-btn btn btn-success rounded-5 mx-3"
                        onClick={handleDownloadFile}
                    >
                        Tải file mẫu (.xlsx)
                    </button>
                    <input
                        type="file"
                        accept=".xls, .xlsx"
                        className="d-none"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        className="handle-file-btn btn elp-bg-primary text-white rounded-5 mx-3"
                        onClick={handleButtonClick}
                    >
                        Tải lên file (.xlsx)
                    </button>
                </div>
            </div>
            {showSuccessImport && <Success message={'Tải lên file thành công'} />}
            {showError && <ErrorPopup handleClose={closeError} errorMsg={fileError} />}
            {loadingWait && <LoadingDataWait />}
        </div>
    )
}

export default ImportTeachers
