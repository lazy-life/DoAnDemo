import React, { useState } from 'react'
import { Icon } from '@iconify/react'

const SideBarHeadOfDepartment = ({ getChildrenPage }) => {
    const [showAppendix, setShowAppendix] = useState(true)
    const [showShool, setShowShool] = useState(false)
    const [activeOption, setActiveOption] = useState(0)

    const ShowAppendix = () => {
        setShowAppendix(!showAppendix)
    }
    const ShowShool = () => {
        setShowShool(!showShool)
    }

    const changeColor = (index) => {
        setActiveOption(index)
    }

    const sendChildrenPage = (pageName) => {
        getChildrenPage(pageName)
    }

    const chooseOption = (index, pageName) => {
        changeColor(index)
        sendChildrenPage(pageName)
    }

    return (
        <div id="sideBar-principal">
            <div className="principalAction" onClick={ShowAppendix}>
                <div className="iconTitle">
                    <Icon icon="mi:folder" />
                    <p className="mainTitle">Phụ lục</p>
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
                                <p className="secondTitle">Duyệt tài liệu</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(1, 'make-lesson-plans')}
                            className={`principalAction ${activeOption === 1 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="prime:file-edit" />
                                <p className="secondTitle">Lập kế hoạch</p>
                            </div>
                        </div>
                    </li>
                </ul>
            )}

            <div className="principalAction" onClick={ShowShool}>
                <div className="iconTitle">
                    <Icon icon="gravity-ui:graduation-cap" />
                    <p className="mainTitle">Tổ</p>
                </div>
                <div className="dropdown">
                    <Icon icon="mdi:keyboard-arrow-down" />
                </div>
            </div>
            {showShool && (
                <ul>
                    <li>
                        <div
                            onClick={() => chooseOption(3, 'groupInfor')}
                            className={`principalAction ${activeOption === 3 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="mdi:file-lock-outline" />
                                <p className="secondTitle">Thông tin tổ</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div
                            onClick={() => chooseOption(2, 'subjects')}
                            className={`principalAction ${activeOption === 2 ? 'active' : ''}`}
                        >
                            <div className="iconTitle">
                                <Icon icon="material-symbols:collections-bookmark-outline-rounded" />
                                <p className="secondTitle">Khung chương trình môn</p>
                            </div>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    )
}

export default SideBarHeadOfDepartment
