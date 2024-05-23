import React, { useEffect } from 'react'
import '../../../sass/main.scss'

const SuccessWithButton = ({ message, closePopUp }) => {
    const handleCloseButton = () => {
        closePopUp()
    }

    const handleWrapperClick = (event) => {
        if (event.target.id === 'success-wrapper') {
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
        <div id="success-with-btn-wrapper" onClick={handleWrapperClick}>
            <div className="borderSuccess">
                <div className="checkCircle">
                    <svg width="115px" height="115px" viewBox="0 0 133 133">
                        <g
                            id="check-group"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                        >
                            <circle
                                id="filled-circle"
                                fill="#07b481"
                                cx="66.5"
                                cy="66.5"
                                r="54.5"
                            />
                            <circle id="white-circle" fill="#FFFFFF" cx="66.5" cy="66.5" r="55.5" />
                            <circle
                                id="outline"
                                stroke="#07b481"
                                strokeWidth="4"
                                cx="66.5"
                                cy="66.5"
                                r="54.5"
                            />
                            <polyline
                                id="check"
                                stroke="#FFFFFF"
                                strokeWidth="5.5"
                                points="41 70 56 85 92 49"
                            />
                        </g>
                    </svg>
                </div>
                <div className="textDesctionCheck my-4 fs-5">
                    <p>{message}</p>
                </div>
                <div>
                    <button
                        className="btn elp-bg-primary text-white rounded-5 px-4"
                        onClick={handleCloseButton}
                    >
                        Xong
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SuccessWithButton
