import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import SelectDropdown from './SelectDropdown'
import MultipleSelect from './MultipleSelect'
import axios from 'axios'
import { url } from '../../Config/config'
import Success from './popUp/Success'
import { loadEffect } from './Ultility'
import ErrorPopup from './popUp/ErrorPopUp'

import '../../sass/main.scss'
import { handleDecrypt } from './Ultilities/CommonFunction'

function OverallSubjects({ getDeleteObject, dataSearch }) {
    const [overallSubjects, setOverallSubjects] = useState([])
    const [overallSubjectsTemp, setOverallSubjectsTemp] = useState([])
    const [grades, setGrades] = useState([
        { id: 1, grade: 6 },
        { id: 2, grade: 7 },
        { id: 3, grade: 8 },
        { id: 4, grade: 9 },
        { id: 4, grade: 10 },
        { id: 4, grade: 11 },
        { id: 4, grade: 12 },
    ])
    const [selectedGrades, setSelectedGrades] = useState([])
    const [compulsories, setCompulsories] = useState([
        { id: 1, label: 'Có', value: true },
        { id: 2, label: 'Không', value: false },
    ])
    const [compulsory, setCompulsory] = useState({ id: 1, label: 'Có', value: true })
    const [showSuccess, setShowSuccess] = useState(false)
    const [resetSelectedItem, setResetSelectedItem] = useState([])
    const [isLoadSubjects, setIsLoadSubjects] = useState(true)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleCloseError = () => {
        setShowError(false)
    }

    useEffect(() => {
        if (dataSearch) {
            if (dataSearch.trim()) {
                const dataTemp = JSON.parse(JSON.stringify(overallSubjectsTemp))
                if (dataTemp.length > 0) {
                    const dataSearchTemp = []
                    // const results = dataTemp.filter(item => item.subjectName.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()));
                    dataTemp.map(item => {
                        if (item.subjectName.trim().toLowerCase().includes(dataSearch.trim().toLowerCase()) || item.grade.toString() === dataSearch.trim().toLowerCase()) {
                            dataSearchTemp.push(item)
                        }
                    })
                    setOverallSubjects(dataSearchTemp)
                }
            } else {
                setOverallSubjects(JSON.parse(JSON.stringify(overallSubjectsTemp)))
            }
        } else {
            setOverallSubjects(JSON.parse(JSON.stringify(overallSubjectsTemp)))
        }
    }, [dataSearch])

    const loadAllOverallSubjects = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/OverallSubject/GetSubjectOverall/0/0', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }

                })
                .then((res) => {
                    setOverallSubjects(res.data)
                    setOverallSubjectsTemp(JSON.parse(JSON.stringify(res.data)))
                    setIsLoadSubjects(false)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        loadAllOverallSubjects()
    }, [])

    const getSelectedGrades = (data) => {
        setSelectedGrades(data)
    }

    const getCompulsory = (data) => {
        setCompulsory(data)
    }

    const handleDeleteAction = (subject) => {
        let messageDelete = {
            idObject: subject.id,
            title: 'Xóa môn học',
            content:
                'Bạn có chắc chắn muốn xóa môn ' +
                subject.subjectName +
                ' (' +
                subject.grade +
                ') không?',
            path: 'api/OverallSubject/DeleteSubjectOverall?subject=' + subject.id,
            loadNewObjects: () => {
                loadAllOverallSubjects()
            },
        }
        getDeleteObject(messageDelete)
    }

    const addSubject = async (event) => {
        event.preventDefault()

        if (selectedGrades.length > 0) {
            let subjectsAdd = selectedGrades.map((item) => {
                return {
                    subjectName: document.getElementById('overallSubjectName').value,
                    grade: item,
                    totalNumberSession: document.getElementById('numberOfSessions').value,
                    isCompulsory: compulsory.value,
                }
            })
            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .post(url + 'api/OverallSubject/AddListSubjectOverall', subjectsAdd, {
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': `Bearer ${dataUserToken}`
                        }

                    })
                    .then((res) => {
                        loadAllOverallSubjects()
                        setResetSelectedItem([])
                        document.getElementById('overallSubjectName').value = ''
                        document.getElementById('numberOfSessions').value = ''
                        setShowSuccess(true)
                        const timeout = setTimeout(() => {
                            setShowSuccess(false)
                        }, 2300)

                        return () => {
                            clearTimeout(timeout)
                        }
                    })
                    .catch((err) => {
                        // console.error(err)
                        setErrorMessage(err.response.data)
                        setShowError(true)
                    })
            }
        } else {
            setErrorMessage('Bạn chưa chọn khối!')
            setShowError(true)
        }
    }

    return (
        <div id="overall-subjects-wrapper" className="row w-100 px-4 pt-3">
            <div id="view-subject-container" className="p-3 h-100 col-lg-8">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="view-subject-title">
                        <div className="bg-white border-bottom fw-bold p-2 px-5 ">
                            <i className="fa-solid fa-check"></i>
                            Môn học
                        </div>
                    </div>
                </div>
                <div className="table-container bg-white shadow">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>Số thứ tự</th>
                                <th>Tên môn</th>
                                <th>Khối</th>
                                <th>Tổng số tiết</th>
                                <th>Môn học bắt buộc</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoadSubjects ? (
                                overallSubjects.length > 0
                                    ?
                                    (overallSubjects.map((item, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                            >
                                                <td>{index + 1}</td>
                                                <td>{item.subjectName}</td>
                                                <td>{item.grade}</td>
                                                <td>{item.totalNumberSession}</td>
                                                <td>
                                                    {item.isCompulsory ? (
                                                        <i className="fa-solid fa-circle-check text-success"></i>
                                                    ) : (
                                                        <i className="fa-solid fa-circle-xmark text-danger"></i>
                                                    )}
                                                </td>
                                                <td>
                                                    <div
                                                        className="icon px-2"
                                                        onClick={() => handleDeleteAction(item)}
                                                    >
                                                        <Icon icon="fluent:delete-24-regular" />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }))
                                    :
                                    (
                                        <tr
                                            className={'odd-row'}
                                        >
                                            <td colSpan="5">
                                                <div className='noContent' style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left', fontSize: '40px' }}>
                                                    <i className="iconNoContent fa-solid fa-ban"></i>
                                                    <p style={{ fontSize: '18px', marginTop: '.5rem' }}>Không có dữ liệu</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            ) : (
                                <div
                                    style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                                    className="loading"
                                >
                                    <div
                                        style={{ left: '43%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="add-subject-wrapper" className="col-lg-4">
                <div className="p-3 pt-3 shadow bg-white add-subject-container">
                    <p className="create-title text-center elp-text-title fw-bold mb-4">
                        Thêm môn học mới
                    </p>
                    <div>
                        <form onSubmit={addSubject}>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="overallSubjectName"
                                    className="form-label mb-0 align-self-center text-start"
                                >
                                    Tên môn học
                                </label>
                                <input
                                    id="overallSubjectName"
                                    className="form-control ms-3 rounded-5"
                                    type="text"
                                    placeholder="Tên môn học"
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label className="form-label mb-0 align-self-center text-start">
                                    Khối
                                </label>
                                <MultipleSelect
                                    label={'Chọn khối'}
                                    getDataFromChild={getSelectedGrades}
                                    optionList={grades}
                                    className={'border w-100 ms-3 rounded-5 subject-list'}
                                    selectedItem={resetSelectedItem}
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label
                                    htmlFor="overallSubjectName"
                                    className="form-label mb-0 align-self-center text-start"
                                >
                                    Tổng số tiết
                                </label>
                                <input
                                    id="numberOfSessions"
                                    className="form-control ms-3 rounded-5"
                                    type="number"
                                    min={1}
                                    placeholder="Tổng số tiết"
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex">
                                <label className="form-label mb-0 align-self-center text-start">
                                    Bắt buộc
                                </label>
                                <SelectDropdown
                                    label={'Môn học bắt buộc'}
                                    getDataFromChild={getCompulsory}
                                    optionList={compulsories}
                                    className={'border w-100 ms-3 rounded-5'}
                                    dataUpdate={compulsory}
                                />
                            </div>
                            <div className="d-flex justify-content-center mt-5">
                                <button
                                    type="submit"
                                    className="btn elp-bg-primary text-white rounded-5 px-3"
                                >
                                    Thêm môn học
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showSuccess && <Success message={'Thêm môn học thành công'} />}
            {showError && <ErrorPopup errorMsg={errorMessage} handleClose={handleCloseError} />}
        </div>
    )
}

export default OverallSubjects
