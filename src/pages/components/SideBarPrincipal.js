import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

const SideBarPrincipal = ({ getChildrenPage, checkChangeSideBar }) => {
    const [showAppendix, setShowAppendix] = useState(true)
    const [showShool, setShowShool] = useState(false)
    const [activeOption, setActiveOption] = useState(0)
    const [showTimeTable, setShowTimeTable] = useState(false)
    const [sideBarChange, setSideBarChange] = useState(null)

    useEffect(() => {
        setSideBarChange(checkChangeSideBar)
    }, [checkChangeSideBar])

    const ShowAppendix = () => {
        setShowAppendix(!showAppendix)
    }
    const ShowShool = () => {
        setShowShool(!showShool)
    }
    const ShowTimeTable = () => {
        setShowTimeTable(!showTimeTable)
    }

    const changeColor = (index) => {
        setActiveOption(index)
    }

    const sendChildrenPage = (pageName, index) => {
        getChildrenPage(pageName, index)
    }

    const chooseOption = (index, pageName) => {
        if (!sideBarChange) {
            changeColor(index)
        }
        sendChildrenPage(pageName, index)
    }

    const levelSchool = 3
    const gradeData = [
        {
            id: 6,
            level: 2,
            gradeKey: 'grade6',
            name: 'Khối 6'
        },
        {
            id: 7,
            level: 2,
            gradeKey: 'grade7',
            name: 'Khối 7'
        },
        {
            id: 8,
            level: 2,
            gradeKey: 'grade8',
            name: 'Khối 8'
        },
        {
            id: 9,
            level: 2,
            gradeKey: 'grade9',
            name: 'Khối 9'
        },
        {
            id: 10,
            level: 3,
            gradeKey: 'grade10',
            name: 'Khối 10'
        },
        {
            id: 11,
            level: 3,
            gradeKey: 'grade11',
            name: 'Khối 11'
        },
        {
            id: 12,
            level: 3,
            gradeKey: 'grade12',
            name: 'Khối 12'
        }
    ]


    return (
        <div id="sideBar-principal">
            <div className="principalAction" onClick={ShowAppendix}>
                <div className="iconTitle">
                    <Icon icon="mi:folder" />
                    <p className="mainTitle">Kế hoạch giảng dạy</p>
                </div>
                <div className="dropdown">
                    <Icon icon="mdi:keyboard-arrow-down" />
                </div>
            </div>
            {showAppendix && (
                <ul>
                    <li>
                        <div
                            onClick={() => chooseOption(0, 'review-lesson-plans')}
                            className={`principalAction ${activeOption === 0 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mi:check" />
                                <p className="secondTitle">Duyệt kế hoạch</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(1, 'lesson-plans')}
                            className={`principalAction ${activeOption === 1 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mi:eye" />
                                <p className="secondTitle">Xem kế hoạch</p>
                            </div>
                        </div>
                    </li>
                </ul>
            )}

            <div className="principalAction" onClick={ShowTimeTable}>
                <div className="iconTitle">
                    <Icon icon="mdi:timetable" />
                    <p className="mainTitle">Thời khoá biểu</p>
                </div>
                <div className="dropdown">
                    <Icon icon="mdi:keyboard-arrow-down" />
                </div>
            </div>
            {showTimeTable && (
                <ul>
                    {gradeData.map(
                        (grade, index) =>
                            grade.level === levelSchool && (
                                <li key={grade.id}>
                                    <div
                                        onClick={() => chooseOption(grade.id, 'timeTable')}
                                        className={`principalAction ${activeOption === grade.id ? 'active' : ''
                                            }`}
                                    >
                                        <div className="iconTitle">
                                            <p className="secondTitle">{grade.name}</p>
                                        </div>
                                    </div>
                                </li>
                            )
                    )}
                </ul>
            )}

            <div className="principalAction" onClick={ShowShool}>
                <div className="iconTitle">
                    <Icon icon="gravity-ui:graduation-cap" />
                    <p className="mainTitle">Trường học</p>
                </div>
                <div className="dropdown">
                    <Icon icon="mdi:keyboard-arrow-down" />
                </div>
            </div>
            {showShool && (
                <ul>
                    <li>
                        <div
                            onClick={() => chooseOption(2, 'subjects')}
                            className={`principalAction ${activeOption === 2 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="material-symbols:collections-bookmark-outline-rounded" />
                                <p className="secondTitle">Môn học</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(5, 'teachers')}
                            className={`principalAction ${activeOption === 5 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mdi:teach" />
                                <p className="secondTitle">Giáo viên</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(4, 'departments')}
                            className={`principalAction ${activeOption === 4 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="material-symbols:group-outline-rounded" />
                                <p className="secondTitle">Tổ</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(6, 'syllabus')}
                            className={`principalAction ${activeOption === 6 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="octicon:book-16" />
                                <p className="secondTitle">Khung chương trình môn</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(21, 'school-year')}
                            className={`principalAction ${activeOption === 21 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mingcute:time-line" />
                                <p className="secondTitle">Năm học</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(20, 'classes')}
                            className={`principalAction ${activeOption === 20 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mdi:google-classroom" />
                                <p className="secondTitle">Lớp</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(3, 'school-detail')}
                            className={`principalAction ${activeOption === 3 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mdi:file-lock-outline" />
                                <p className="secondTitle">Thông tin trường</p>
                            </div>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default SideBarPrincipal
