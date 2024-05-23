import { useRef, useState, useEffect, forwardRef } from "react";

const ViewSchool = ({ getDataFromChild, dataSchool }, ref) => {

    const sendRequestDataClose = () => {
        getDataFromChild('cancel')
    }



    const school = {
        schoolName: Object.values(dataSchool)[0],
        schoolAddress: Object.values(dataSchool)[1],
        numberTeacher: Object.values(dataSchool)[2],
        numberSubject: Object.values(dataSchool)[3],
        principalName: Object.values(dataSchool)[4],
        gender: Object.values(dataSchool)[5],
        email: Object.values(dataSchool)[6],
        phoneNumber: Object.values(dataSchool)[7]
    }

    const message = {
        title: 'Thông tin trường ' + Object.values(school)[0],
        button: 'Xong'
    }
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                getDataFromChild('cancel')
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (
        <div id="viewSchool-wrapper">
            <div ref={ref} className="popUp">
                <div className="topPopUp">
                    <p>{message.title}</p>
                </div>
                <div className="middlePopUp">
                    <div className="left">
                        <div className="leftValue">
                            <div className="field selectField">
                                <p>Tên Trường</p>
                                <div className="seletOptionField">
                                    <p>{school.schoolName}</p>
                                </div>
                            </div>
                            <div className="field selectField">
                                <p>Địa chỉ</p>
                                <div className="seletOptionField">
                                    <p>{school.schoolAddress}</p>
                                </div>
                            </div>

                            <div className="field selectField">
                                <p>Số lượng giáo viên</p>
                                <div className="seletOptionField">
                                    <p>{school.numberTeacher}</p>
                                </div>
                            </div>

                            <div className="field selectField">
                                <p>Số lượng môn học</p>
                                <div className="seletOptionField">
                                    <p>{school.numberSubject}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="rightValue">
                            <div className="field selectField">
                                <p>Tên Hiệu trưởng</p>
                                <div className="seletOptionField">
                                    <p>{school.principalName}</p>
                                </div>
                            </div>
                            <div className="field selectField">
                                <p>Giới tính</p>
                                <div className="seletOptionField">
                                    <p>{+school.gender + 1 === 2 ? 'Nam' : 'Nữ'}</p>
                                </div>
                            </div>

                            <div className="field selectField">
                                <p>Email</p>
                                <div className="seletOptionField">
                                    <p>{school.email}</p>
                                </div>
                            </div>
                            <div className="field selectField">
                                <p>Số điện thoại</p>
                                <div className="seletOptionField">
                                    <p>{school.phoneNumber}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="bottomPopUp">
                    <button onClick={sendRequestDataClose} className="accept" >{message.button}</button>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(ViewSchool)