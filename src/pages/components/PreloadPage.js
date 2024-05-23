import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { findPriorityValue, handleDecrypt, roles } from "../components/Ultilities/CommonFunction";

const PreloadPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const logo = process.env.PUBLIC_URL + '/logo.png';




    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => {
            clearTimeout(timeout);
        };
    }, []);


    useEffect(() => {
        const timeout = setTimeout(() => {
            const value = JSON.parse(localStorage.getItem('userlogin'));

            if (value !== null) {
                const dataUser = handleDecrypt(value)
                const roleValue = findPriorityValue(roles, dataUser.userRole);
                if (roleValue === 1) {
                    navigate('/principal')
                } else if (roleValue === 2) {
                    navigate('/headOfDepartment')
                } else if (roleValue === 3) {
                    navigate('/hompageTeacher')
                } else if (roleValue === 4) {
                    navigate('/admin')
                }
            } else {
                navigate('/login');
            }
        }, 1500);

        return () => {
            clearTimeout(timeout);
        };
    }, [isLoading]);

    return (
        <>
            <div id="preLoadPage-wrapper">
                {isLoading && (
                    <>
                        <div className="logo">
                            <img src={logo} />
                        </div>

                        <div class="loadAnimation">
                            <svg version="1.1" id="L4" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0">
                                <circle id="circle1" fill="#FFFFFF" stroke="none" cx="0" cy="50" r="9">
                                    <animate attributeName="fill"
                                        dur="2s"
                                        values="#D82E18;#f8c9b3;#f8c9b3;#f8c9b3"
                                        repeatCount="indefinite" />
                                </circle>
                                <circle id="circle2" fill="#FFFFFF" stroke="none" cx="30" cy="50" r="9">
                                    <animate attributeName="fill"
                                        dur="2s"
                                        values="#f8c9b3;#D82E18;#f8c9b3;#f8c9b3"
                                        repeatCount="indefinite" />
                                </circle>
                                <circle id="circle3" fill="#FFFFFF" stroke="none" cx="60" cy="50" r="9">
                                    <animate attributeName="fill"
                                        dur="2s"
                                        values="#f8c9b3;#f8c9b3;#D82E18;#f8c9b3"
                                        repeatCount="indefinite" />
                                </circle>
                                <circle id="circle4" fill="#FFFFFF" stroke="none" cx="90" cy="50" r="9">
                                    <animate attributeName="fill"
                                        dur="2s"
                                        values="#f8c9b3;#f8c9b3;#f8c9b3;#D82E18"
                                        repeatCount="indefinite" />
                                </circle>
                            </svg>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default PreloadPage