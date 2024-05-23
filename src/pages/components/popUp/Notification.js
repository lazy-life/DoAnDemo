import React, { useEffect, useState } from 'react'
import '../../../sass/main.scss'
import { Icon } from '@iconify/react/dist/iconify.js';

const TimeDisplay = ({ inputDate }) => {
    const formatTime = (inputDate) => {
        const currentDate = new Date();
        const diffMilliseconds = currentDate - inputDate;

        const seconds = Math.floor(diffMilliseconds / 1000);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minutes ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            return `${days} days ago`;
        }
    };

    return (
        <span>{formatTime(inputDate)}</span>
    );
};

function Notification({ noticeData }) {

    const [listNotice, setListNotice] = useState([])
    useEffect(() => {
        if (noticeData.length > 0) {
            setListNotice(noticeData)
        } else {
            setListNotice([])
        }
    }, [noticeData])

    return (
        <div id='notification-wrapper'>
            <div className='titleNotice'>
                <p>Thông báo</p>
            </div>
            {listNotice.length > 0 ? (
                <>
                    <div className='scroll'>
                        <div className='listContent'>
                            {listNotice.map((item) => (
                                <div key={item.id} className='contentNotice'>
                                    <div className='notice'>
                                        <div className='noticeContent'>
                                            <p>{item.message}</p>
                                            <p className='timeNotice'><TimeDisplay inputDate={new Date(item.time)} /></p>
                                        </div>
                                        <div className={item.isReaded ? '' : 'noticeMark'}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='no-notifications'>
                        <div className='noContent'>
                            <Icon icon="lucide:ban" />
                            <p>Không có thông báo trong 7 ngày qua</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Notification