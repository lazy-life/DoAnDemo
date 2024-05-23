import React, { Suspense, useEffect, useState } from "react";
import CryptoJS from 'crypto-js';
// import Appendix from "../components/Appendix";
import Header from "../components/Header"
import { useNavigate } from "react-router-dom";
import { findPriorityValue, handleAccess, handleAccessPage, handleDecrypt, roles } from "../components/Ultilities/CommonFunction";
import { loadEffect } from "../components/Ultility";

const Appendix = React.lazy(() => {
    return import('../components/Appendix').then((module) => ({
        default: (props) => <module.default {...props} />,
    }))
})
function Teacher() {

    const navigate = useNavigate()


    useEffect(() => {
        const value = JSON.parse(localStorage.getItem('userlogin'));
        if (!value) {
            navigate('/login')
        }
    }, [])
    const handleShowMenu = (data) => {
        // setIsShowSideBar(data)
    };

    const handleKeySearch = (data) => {
        // setDataSearch(data)
    }

    return (
        <div>
            <Header showMenuRole={'3'} getDataFromChild={handleShowMenu} getKeySearchFromChild={handleKeySearch} />

            <div id="teacher-wrapper">
                <Suspense
                    fallback={
                        <div className="loading">
                            <div
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    }
                >
                    <Appendix />
                </Suspense>
            </div>
        </div>
    )
}

export default Teacher




