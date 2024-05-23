import { createContext, useEffect, useState } from 'react';
import '../../../sass/main.scss'
import ConfirmLogout from './ConfirmLogout';




const Avatar = ({ getDataFromChild, useInfor }) => {
    const {
        name,
        email,
        username,
        acedemi,
        dob,
        position
    } = useInfor;

    const [nameShow, setNameShow] = useState(null)

    useEffect(() => {
        const str = name;
        const words = str.split(' ');
        const lastWord = words[words.length - 1];
        setNameShow(lastWord.charAt(0))
    }, [])



    const activeLogout = () => {
        getDataFromChild('logout');
    }

    const sendDataToParent = () => {
        getDataFromChild('setting');
    };

    const svgSetting = "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"

    const svgLogout = "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"


    return (
        <>
            <div id="Avatar-wrapper">
                <div className="topAvatar">
                    <p>{email}</p>
                </div>
                <div className="middleAvatar">
                    <div className='avatar'>
                        <div className='avatarName'>
                            <span>{nameShow}</span>
                        </div>
                    </div>
                    <div className='welcome'>
                        <p>Chào {name},</p>
                    </div>
                </div>
                <div className="bottomAvatar">
                    <div onClick={sendDataToParent} className='setting'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d={svgSetting}>
                        </path></svg>
                        <p>Cài đặt tài khoản</p>
                        {/* useContext */}
                    </div>
                    <div onClick={activeLogout} className='logout'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out"><path d={svgLogout}></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <p>Đăng xuất</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Avatar