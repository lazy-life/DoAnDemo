import React, { useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Icon } from '@iconify/react';

const AddSemester = ({ getDataFromChild, handleClose }) => {
    const inputRef = useRef(null)
    const onChange = (date, dateString) => {
    };
    const handleCancel = () => {
        handleClose('0');
    }
    const handleSave = () => {
        getDataFromChild('1', '')
    }
    useEffect(() => {
        inputRef.current.focus()
    }, [])
    return (
        <>
            <form>
                <div id="addSemester-wrapper">
                    <div className="addSemesterBorder">
                        <div className="top">
                            <p>Thêm kỳ mới</p>
                        </div>
                        <div className="content">
                            <div className="contentMain">
                                <div className="leftContent">
                                    <p>Tên kỳ</p>
                                </div>
                                <div className="rightContent">
                                    <input ref={inputRef} className='semesterName' type='text' placeholder='Nhập tên kỳ' required />
                                </div>
                            </div>
                            <div className="contentMain">
                                <div className="leftContent">
                                    <p>Thời gian bắt đầu</p>
                                </div>
                                <div className="rightContent">
                                    <ConfigProvider locale={viVN}
                                        theme={{
                                            token: {
                                                borderRadius: 20,
                                                colorBgContainer: 'transparent',
                                                colorBorder: 'none',
                                                colorTextPlaceholder: '#5A473E'
                                            },
                                        }}>
                                        <DatePicker
                                            className='dateSemester'
                                            format={{
                                                format: 'DD-MM-YYYY',
                                                type: 'mask',
                                            }}
                                            placeholder='Chọn ngày bắt đầu'
                                            onChange={onChange}
                                        />
                                    </ConfigProvider>
                                </div>
                            </div>
                            <div className="contentMain">
                                <div className="leftContent">
                                    <p>Thời gian kết thúc</p>
                                </div>
                                <div className="rightContent">
                                    <ConfigProvider locale={viVN}
                                        theme={{
                                            token: {
                                                borderRadius: 20,
                                                colorBgContainer: 'transparent',
                                                colorBorder: 'none',
                                                colorTextPlaceholder: '#5A473E'
                                            },
                                        }}>
                                        <DatePicker
                                            className='dateSemester'
                                            format={{
                                                format: 'DD-MM-YYYY',
                                                type: 'mask',
                                            }}
                                            placeholder='Chọn ngày kết thúc'
                                            onChange={onChange}
                                        />
                                    </ConfigProvider>
                                </div>
                            </div>
                        </div>
                        <div className="bottom">
                            <button onClick={() => handleCancel()} className="cancel">Huỷ</button>
                            <button type='submit' onClick={() => handleSave()} className="save">Lưu</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AddSemester