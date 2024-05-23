import { useRef, useState, useEffect, forwardRef } from "react";
import axios from 'axios';
import { url } from "../../../Config/config";
import { Icon } from "@iconify/react";
import SelectDropdown from "../SelectDropdown";
import Shimmer from "../Shimmer";
import MultipleSelect from "../MultipleSelect";
import { Alert } from "antd";
import { handleDecrypt } from "../Ultilities/CommonFunction";

const ModifySchool = ({ getDataFromChild, message, dataSchool, dataProvinces, typeModify }, ref) => {

    const [loading, setLoading] = useState(true)
    const [selectedItemCity, setSelectedItemCity] = useState()
    const [selectedItemDistrict, setSelectedItemDistrict] = useState()
    const [selectedItemGender, setSelectedItemGender] = useState()
    const [selectedItemLevel, setSelectedItemLevel] = useState()

    const [selectedItemCityCode, setSelectedItemCityCode] = useState('')
    const [selectedItemDistrictCode, setSelectedItemDistrictCode] = useState('')
    const [selectedItemGenderCode, setSelectedItemGenderCode] = useState('')
    const [selectedItemLevelCode, setSelectedItemLevelCode] = useState(0)

    const [inputSchoolName, setInputSchoolName] = useState('');
    const [inputSchoolAddress, setInputSchoolAddress] = useState('');
    const [inputPrincipalName, setInputPrincipalName] = useState('');
    const [inputPrincipalEmail, setInputPrincipalEmail] = useState('');
    const [inputPrincipalDob, setInputPrincipalDob] = useState('');
    const [inputPrincipalPhoneNumber, setInputPrincipalPhoneNumber] = useState('');

    const inputRef = useRef();
    const errorRef = useRef();
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleInputSchoolName = (event) => {
        setInputSchoolName(event.target.value);
    };
    const handleInputSchoolAddress = (event) => {
        setInputSchoolAddress(event.target.value);
    };
    const handleInputPrincipalName = (event) => {
        setInputPrincipalName(event.target.value);
    };
    const handleInputPrincipalEmail = (event) => {
        setInputPrincipalEmail(event.target.value);
    };
    const handleInputPrincipalPhoneNumber = (event) => {
        setInputPrincipalPhoneNumber(event.target.value);
    };
    const handleInputPrincipalDob = (event) => {
        setInputPrincipalDob(event.target.value);
    };

    const [provinces, setProvinces] = useState([])
    const [district, setDistrict] = useState([])


    const gender = [
        { id: 2, name: 'Nam' },
        { id: 1, name: 'Nữ' }
    ]

    const level = [
        { id: 2, name: 'Cấp 2' },
        { id: 3, name: 'Cấp 3' }
    ]

    // inputRef.current.focus()

    useEffect(() => {
        if (typeModify === 0) {
            setLoading(false)
            setSelectedItemCity('Chọn Tỉnh/TP')
            setSelectedItemDistrict('Chọn Quận/Huyện')
            setSelectedItemGender('Chọn giới tính')
            setSelectedItemLevel('Chọn Cấp')
        }
        setProvinces(dataProvinces)
        fetchDataProvince()
    }, []);

    useEffect(() => {
        if (typeModify === 1) {
            const school = {
                schoolName: Object.values(dataSchool)[0],
                schoolAddress: Object.values(dataSchool)[1],
                numberTeacher: Object.values(dataSchool)[2],
                numberSubject: Object.values(dataSchool)[3],
                principalName: Object.values(dataSchool)[4],
                gender: Object.values(dataSchool)[5],
                email: Object.values(dataSchool)[6],
                phoneNumber: Object.values(dataSchool)[7],
                schoolId: Object.values(dataSchool)[8],
                provinceId: Object.values(dataSchool)[9],
                districtId: Object.values(dataSchool)[10],
                detailAddress: Object.values(dataSchool)[11],
                dob: Object.values(dataSchool)[12],
                level: Object.values(dataSchool)[13]
            }
            let foundCity = false
            dataProvinces.forEach(element => {
                if (Object.values(element)[0] === school.provinceId && !foundCity) {
                    setSelectedItemCity(Object.values(element)[1])
                    foundCity = true;
                }
            });
            setSelectedItemCityCode(Object.values(dataSchool)[9])
            setSelectedItemDistrictCode(Object.values(dataSchool)[10])
            fetchDataDistrice(Object.values(dataSchool)[9])

            setSelectedItemGender(+school.gender + 1)
            setSelectedItemLevel(school.level)
            setInputSchoolName(school.schoolName)
            setInputPrincipalDob(school.dob)
            setInputSchoolAddress(school.detailAddress)
            setInputPrincipalName(school.principalName)
            setInputPrincipalEmail(school.email)
            setInputPrincipalPhoneNumber(school.phoneNumber)
            setSelectedItemLevelCode(school.level)
            setSelectedItemGenderCode(school.gender)
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [dataSchool])

    const fetchDataProvince = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            try {
                const response = await axios.get(url + 'api/Province/GetAllProvinces', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    },
                });

                const parsedData = response.data.map(item => {
                    return {
                        id: item.provinceCode,
                        name: item.provinceName
                    };
                });

                setProvinces(parsedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchDataDistrice = async (id) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            try {
                const response = await axios.get(url + 'api/District/GetAllDistrictsByProvinceId?provinceId=' + id, {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    },
                });

                if (response.status !== 200) {
                    setLoading(true)
                    throw new Error('Network response was not ok');
                }
                const parsedData = response.data.map(item => {
                    return {
                        id: item.districtCode,
                        name: item.districtName
                    };
                });

                if (parsedData !== null) {
                    setDistrict(parsedData);
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleDataSelectedCity = (data) => {
        setSelectedItemCity(data.name)
        setSelectedItemCityCode(data.id)
        setSelectedItemDistrict('Chọn Quận/Huyện')
        setSelectedItemDistrictCode('')
        fetchDataDistrice(data.id)
    }

    const handleDataSelectedDistrict = (data) => {
        setSelectedItemDistrict(data.name)
        setSelectedItemDistrictCode(data.id)
    }

    const handleDataSelectedGender = (data) => {
        setSelectedItemGender(data.id)
        setSelectedItemGenderCode(data.id)
    }
    const handleDataSelectedLevel = (data) => {
        setSelectedItemLevel(data.id)
        setSelectedItemLevelCode(data.id)
    }

    const isValidPhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^[0-9]{10}$/;
        return phoneNumberRegex.test(phoneNumber);
    }

    const sendRequestDataAccept = (event) => {
        event.preventDefault();

        const today = new Date();
        const birthDate = new Date(inputPrincipalDob);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }


        if (!selectedItemCityCode) {
            setErrorMsg('Vui lòng chọn Tỉnh/Thành phố')
            setShowError(true)
        } else if (!selectedItemDistrictCode) {
            setErrorMsg('Vui lòng chọn Quận/Huyện')
            setShowError(true)
        } else if (!selectedItemLevelCode) {
            setErrorMsg('Vui lòng chọn Cấp')
            setShowError(true)
        } else if (!selectedItemGenderCode) {
            setErrorMsg('Vui lòng chọn Giới tính')
            setShowError(true)
        } else if (calculatedAge < 24 || calculatedAge > 70) {
            setErrorMsg('Tuổi Hiệu trưởng phải lớn hơn 24 tuổi')
            setShowError(true)
        } else {
            if (typeModify === 0) {
                const schoolData = {
                    schoolName: inputSchoolName,
                    provinceCode: selectedItemCityCode,
                    districtCode: selectedItemDistrictCode,
                    detailAddress: inputSchoolAddress,
                    schoolLevel: selectedItemLevelCode,
                };

                const principalData = {
                    principalName: inputPrincipalName,
                    dob: inputPrincipalDob,
                    gender: (+selectedItemGenderCode - 1) === 1 ? true : false,
                    email: inputPrincipalEmail,
                    phoneNumber: inputPrincipalPhoneNumber,
                    academicLevel: "Đại Học",
                    specialize: ""
                };

                const requestData = {
                    school: schoolData,
                    principal: principalData
                };

                addSChool(requestData)
            } else if (typeModify === 1) {
                const schoolData = {
                    Id: Object.values(dataSchool)[8],
                    schoolName: inputSchoolName,
                    provinceCode: selectedItemCityCode,
                    districtCode: selectedItemDistrictCode,
                    detailAddress: inputSchoolAddress,
                    schoolLevel: selectedItemLevelCode,
                };

                const principalData = {
                    principalName: inputPrincipalName,
                    dob: inputPrincipalDob,
                    gender: (+selectedItemGenderCode - 1) === 1 ? true : false,
                    email: inputPrincipalEmail,
                    phoneNumber: inputPrincipalPhoneNumber,
                    academicLevel: "Đại Học",
                    specialize: "",
                    Id: Object.values(dataSchool)[14]
                };

                const requestData = {
                    school: schoolData,
                    principal: principalData
                };
                updateSChool(requestData)
            }
        }
    }
    const sendRequestDataCancel = () => {
        getDataFromChild({}, 'cancel')
    }

    const addSChool = async (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/School/AddSchool'
            await axios.post(apiUrl, requestData, config)
                .then((response) => {
                    const dataAdd = {
                        "id": response.data,
                        "schoolName": requestData.school.schoolName,
                        "fullname": requestData.principal.principalName,
                        "provinceName": selectedItemCity
                    }
                    getDataFromChild(dataAdd, 'add')
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const updateSChool = async (requestData) => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            const config = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${dataUserToken}`
                }
            }
            const apiUrl = url + 'api/School/UpdateSchool'
            await axios.put(apiUrl, requestData, config)
                .then((response) => {
                    const schoolData = {
                        Id: Object.values(dataSchool)[8],
                        schoolName: inputSchoolName,
                        provinceCode: selectedItemCity,
                        principalName: inputPrincipalName
                    };

                    getDataFromChild(schoolData, 'edit')

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    const handleDropdownClick = (e) => {
        if (errorRef.current && !errorRef.current.contains(e.target)) {
            setShowError(false)
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClick);
        };
    }, []);

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                getDataFromChild({}, 'cancel')
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
        <>
            <div id="modifySchool-wrapper">
                {loading ? (
                    <div ref={ref} className="popUp" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div className="topPopUp" style={{ display: 'flex', justifyContent: 'center' }}>
                            <p style={{ width: '30%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                        </div>
                        <div className="middlePopUp">
                            <div className="left">
                                <div className="leftValue">
                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                    <div className="field selectField">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>

                                    <div className="field selectField">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>

                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                    <div className="field selectField">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="rightValue">
                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                    <div className="field selectField">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>

                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>
                                    <div className="field">
                                        <p style={{ width: '20%', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                                        <input type="text" style={{ backgroundColor: '#fad5c4', border: 'none' }} disabled />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bottomPopUp">
                            <button onClick={sendRequestDataCancel} className="cancel" >Huỷ</button>
                            <button style={{ backgroundColor: '#fad5c4' }} className="accept" >
                                <p style={{ width: '2rem', backgroundColor: '#fad5c4', height: '2rem', borderRadius: '5px' }}></p>
                            </button>
                        </div>
                        <Shimmer />
                    </div>
                ) :
                    <div ref={ref} className="popUp">
                        <div className="topPopUp">
                            <p>{message.title}</p>
                        </div>
                        <form onSubmit={sendRequestDataAccept}>
                            <div className="middlePopUp">
                                <div className="left">
                                    <div className="leftValue">
                                        <div className="field">
                                            <p>Tên Trường</p>
                                            <input ref={inputRef}
                                                type="text"
                                                value={inputSchoolName}
                                                onChange={handleInputSchoolName} placeholder="Nhập tên trường"
                                                required
                                            />
                                        </div>
                                        <div className="field selectField">
                                            <p>Tên Tỉnh/TP</p>
                                            <div className="seletOptionField">
                                                <SelectDropdown label={'Chọn Tỉnh/TP'} optionList={provinces}
                                                    getDataFromChild={handleDataSelectedCity}
                                                    dataUpdate={{ 'id': selectedItemCityCode }}
                                                />
                                            </div>
                                        </div>

                                        <div className="field selectField">
                                            <p>Tên Quận/Huyện</p>
                                            <div className="seletOptionField">
                                                <SelectDropdown label={'Chọn Quận/Huyện'} optionList={district}
                                                    getDataFromChild={handleDataSelectedDistrict} dataUpdate={{ 'id': selectedItemDistrictCode }} />
                                            </div>
                                        </div>

                                        <div className="field">
                                            <p>Địa chỉ</p>
                                            <input type="text"
                                                value={inputSchoolAddress}
                                                onChange={handleInputSchoolAddress} placeholder="Nhập địa chỉ cụ thể"
                                                required
                                            />
                                        </div>
                                        <div className="field selectField">
                                            <p>Cấp</p>
                                            <div className="seletOptionField">
                                                <SelectDropdown label={"Chọn cấp"} optionList={level} getDataFromChild={handleDataSelectedLevel}
                                                    dataUpdate={{ 'id': selectedItemLevel }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="rightValue">
                                        <div className="field">
                                            <p>Tên Hiệu trưởng</p>
                                            <input type="text"
                                                value={inputPrincipalName}
                                                onChange={handleInputPrincipalName} placeholder="Nhập tên hiệu trưởng"
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <p>Ngày sinh</p>
                                            <input type="date" value={inputPrincipalDob}
                                                onChange={handleInputPrincipalDob}
                                                required
                                            />
                                        </div>
                                        <div className="field selectField">
                                            <p>Giới tính</p>
                                            <div className="seletOptionField">
                                                <SelectDropdown label={"Chọn giới tính"} optionList={gender} getDataFromChild={handleDataSelectedGender}
                                                    dataUpdate={{ 'id': selectedItemGender }} />
                                            </div>
                                        </div>

                                        <div className="field">
                                            <p>Email</p>
                                            <input type="email"
                                                value={inputPrincipalEmail}
                                                onChange={handleInputPrincipalEmail} placeholder="Nhập email Hiệu trưởng"
                                                required
                                            />
                                        </div>
                                        <div className="field">
                                            <p>Số điện thoại</p>
                                            <input type="text"
                                                value={inputPrincipalPhoneNumber}
                                                pattern="\d{10}"
                                                onChange={handleInputPrincipalPhoneNumber} placeholder="Nhập số điện thoại hiệu trưởng"
                                                required
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="bottomPopUp">
                                <button onClick={sendRequestDataCancel} className="cancel" >Huỷ</button>
                                <button type="submit" className="accept" >{message.button}</button>
                            </div>
                        </form>
                    </div>
                }
                {showError && <div className="backgroundErrorSelect">
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
                    </div>
                </div>
                }
            </div>

        </>
    )
}

export default forwardRef(ModifySchool)