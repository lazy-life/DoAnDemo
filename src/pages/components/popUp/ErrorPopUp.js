import { useEffect, useRef } from "react"

//handleClose: if data is 'cancel' 
//errorMsg: msg to display to popup
const ErrorPopup = ({ handleClose, errorMsg }) => {
    // errorMsg = 'Tên tổ đã tồn tại'
    const errorRef = useRef(null)

    const handleDropdownClick = (e) => {
        if (errorRef.current && !errorRef.current.contains(e.target)) {
            handleClose('cancel')
        }
    };

    const handleCloseBtn = () => {
        handleClose('cancel')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClick);
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                handleClose('cancel')
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <div id="error-wrapper">
                <div className="errorSelect">
                    <div class="warning" ref={errorRef}>
                        <svg viewBox="0 0 64 64">
                            <circle class="solid" fill="none" stroke-linecap="round" stroke-width="4" stroke-miterlimit="10" cx="32" cy="32" r="30" />
                            <circle class="animation" fill="none" stroke-linecap="round" stroke-width="4" stroke-miterlimit="10" cx="32" cy="32" r="30" />
                            <path fill="none" stroke="#FFBA00" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" d="M32 15v20" />
                            <line fill="none" stroke="#FFBA00" stroke-width="8" stroke-linecap="round" stroke-miterlimit="10" x1="32" y1="46" x2="32" y2="46" />
                        </svg>
                        <p>{errorMsg}</p>
                    </div>
                    <div className="btnClose">
                        <button onClick={() => handleCloseBtn()}>Đóng</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ErrorPopup