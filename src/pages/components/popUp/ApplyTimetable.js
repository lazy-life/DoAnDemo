import { useEffect } from "react";

const ApplyTimetable = ({handleClose}) =>{
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                handleClose('0');
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return(
        <>
            <div id="applyTimetable-wrapper">
                <div className="applyTimetableBorder">
                    
                </div>
            </div>
        </>
    )
}

export default ApplyTimetable