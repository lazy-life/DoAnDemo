import React, { useState } from 'react'

import '../../sass/main.scss'
import LessonPlans from './LessonPlans'
import LessonPlanTemplates from './LessonPlanTemplates'

function PrincipalViewLessonPlans({ userLoginData }) {
    const [activeType, setActiveType] = useState(0)
    const [lessonPlanPage, setLessonPlanPage] = useState('appendix-3')
    const grades =
        userLoginData.schoolLevel === 2
            ? [6, 7, 8, 9]
            : userLoginData.schoolLevel === 3
            ? [10, 11, 12]
            : []

    const changeColorType = (index) => {
        setActiveType(index)
        if (index === 2) {
            setLessonPlanPage('templates')
        } else {
            if (index === 0) {
                setLessonPlanPage('appendix-3')
            } else if (index === 1) {
                setLessonPlanPage('appendix-4')
            }
        }
    }

    return (
        <div id="principal-lesson-plan-wrapper">
            <div className="d-flex">
                <div
                    onClick={() => changeColorType(0)}
                    className={`lesson-plan-type py-2 px-5 ${
                        activeType === 0 ? 'active-type' : ''
                    }`}
                >
                    <i className="fa-solid fa-check"></i>
                    Kế hoạch giáo dục của giáo viên
                </div>
                <div
                    onClick={() => changeColorType(1)}
                    className={`lesson-plan-type py-2 px-5 ${
                        activeType === 1 ? 'active-type' : ''
                    }`}
                >
                    <i className="fa-solid fa-check"></i>
                    Kế hoạch bài dạy
                </div>
                <div
                    onClick={() => changeColorType(2)}
                    className={`lesson-plan-type py-2 px-5 ${
                        activeType === 2 ? 'active-type' : ''
                    }`}
                >
                    <i className="fa-solid fa-check"></i>
                    Tài liệu mẫu
                </div>
            </div>
            <div>
                {lessonPlanPage === 'appendix-3' && (
                    <LessonPlans userLoginData={userLoginData} grades={grades} appendixType={3} />
                )}
                {lessonPlanPage === 'appendix-4' && (
                    <LessonPlans
                        userLoginData={userLoginData}
                        grades={grades}
                        appendixType={4}
                        className={'appendix-4'}
                    />
                )}
                {lessonPlanPage === 'templates' && <LessonPlanTemplates />}
            </div>
        </div>
    )
}

export default PrincipalViewLessonPlans
