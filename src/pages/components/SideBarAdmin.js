import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'

const SideBarAdmin = ({ getDataFromChild }) => {
    const [isCheckSchool, setIsCheckSchool] = useState(1)

    const schoolBtn = useRef('')
    const sampleBtn = useRef('')
    const subjectBtn = useRef('')
    const deletedSchoolBtn = useRef('')

    const activeBtn = (e) => {
        if (schoolBtn.current && schoolBtn.current.contains(e.target)) {
            setIsCheckSchool(1)
            getDataFromChild('1')
        } else if (sampleBtn.current && sampleBtn.current.contains(e.target)) {
            setIsCheckSchool(2)
            getDataFromChild('2')
        } else if (subjectBtn.current && subjectBtn.current.contains(e.target)) {
            setIsCheckSchool(3)
            getDataFromChild('3')
        } else if (deletedSchoolBtn.current && deletedSchoolBtn.current.contains(e.target)) {
            setIsCheckSchool(4)
            getDataFromChild('4')
        }
    }
    useEffect(() => {
        // Save isCheckSchool to localStorage
        localStorage.setItem('isCheckSchool', JSON.stringify(isCheckSchool))
    }, [isCheckSchool])

    return (
        <div id="sideBar-principal">
            <div
                ref={schoolBtn}
                className={isCheckSchool === 1 ? 'check' : 'principalAction'}
                onClick={activeBtn}
            >
                <div className="iconTitle">
                    <Icon icon="gravity-ui:graduation-cap" />
                    <p className="mainTitle">Trường học</p>
                </div>
            </div>
            <div
                ref={sampleBtn}
                className={isCheckSchool === 2 ? 'check' : 'principalAction'}
                onClick={activeBtn}
            >
                <div className="iconTitle">
                    <Icon icon="mdi:file-settings-outline" />
                    <p className="mainTitle">Mẫu tài liệu</p>
                </div>
            </div>
            <div
                ref={subjectBtn}
                className={isCheckSchool === 3 ? 'check' : 'principalAction'}
                onClick={activeBtn}
            >
                <div className="iconTitle">
                    <Icon icon="icon-park-outline:more-app" />
                    <p className="mainTitle">Môn học</p>
                </div>
            </div>
            <div
                ref={deletedSchoolBtn}
                className={isCheckSchool === 4 ? 'check' : 'principalAction'}
                onClick={activeBtn}
            >
                <div className="iconTitle">
                    <Icon icon="material-symbols:history-rounded" />
                    <p className="mainTitle">Lịch sử khoá trường học</p>
                </div>
            </div>
        </div>
    )
}

export default SideBarAdmin
