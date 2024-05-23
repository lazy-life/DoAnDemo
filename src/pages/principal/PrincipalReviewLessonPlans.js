import React, { useEffect, useState } from 'react'
import Appendix1 from './Appendix1'
import Appendix2 from './Appendix2'
import axios from 'axios'
import { url } from '../../Config/config'

import '../../sass/main.scss'
import ReviewHistory from './ReviewHistory'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function PrincipalReviewLessonPlans({ userLoginData }) {
    const [activeType, setActiveType] = useState(0)
    const [departments, setDepartments] = useState([])
    const [grades, setGrades] = useState([])

    const [lessonPlanPage, setLessonPlanPage] = useState('appendix-1')

    const loadAllDepartments = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Department/GetListDepartmentBySchoolId/' + userLoginData.schoolId, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    setDepartments(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        }
    }

    useEffect(() => {
        if (userLoginData !== null) {
            setGrades(
                userLoginData.schoolLevel === 2
                    ? [6, 7, 8, 9]
                    : userLoginData.schoolLevel === 3
                        ? [10, 11, 12]
                        : []
            )
            loadAllDepartments()
        }
    }, [userLoginData])

    const changeColorType = (index) => {
        setActiveType(index)
        if (index === 0) {
            setLessonPlanPage('appendix-1')
        } else if (index === 1) {
            setLessonPlanPage('appendix-2')
        } else if (index === 2) {
            setLessonPlanPage('history')
        }
    }

    return (
        <div id="principal-review-lesson-plans-wrapper">
            <div className="d-flex">
                <div
                    onClick={() => changeColorType(0)}
                    className={`lesson-plan-type py-2 px-5 ${activeType === 0 ? 'active-type' : ''
                        }`}
                >
                    <i className="fa-solid fa-check"></i>
                    Kế hoạch dạy học các môn học
                </div>
                <div
                    onClick={() => changeColorType(1)}
                    className={`lesson-plan-type py-2 px-5 ${activeType === 1 ? 'active-type' : ''
                        }`}
                >
                    <i className="fa-solid fa-check"></i>
                    Kế hoạch tổ chức hoạt động giáo dục
                </div>
                <div
                    onClick={() => changeColorType(2)}
                    className={`lesson-plan-type py-2 px-5 ${activeType === 2 ? 'active-type' : ''
                        }`}
                >
                    <i className="fa-solid fa-clock-rotate-left me-1"></i>
                    Lịch sử
                </div>
            </div>
            <div>
                {lessonPlanPage === 'appendix-1' && (
                    <Appendix1 departments={departments} grades={grades} />
                )}
                {lessonPlanPage === 'appendix-2' && <Appendix2 departments={departments} />}
                {lessonPlanPage === 'history' && <ReviewHistory userLoginData={userLoginData} />}
            </div>
        </div>
    )
}

export default PrincipalReviewLessonPlans
