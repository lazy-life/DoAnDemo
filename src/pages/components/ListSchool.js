import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { Icon, InlineIcon } from '@iconify/react'
import { LoadingContext } from '../admin/Admin';
import Shimmer from './Shimmer';
import { url } from '../../Config/config';
import { handleDecrypt } from './Ultilities/CommonFunction';

const ListShool = ({ getDataFromChild, handleMessageActionChange, keySearch }) => {

    const [loading, setLoading] = useState(true)
    const [schoolList, setSchoolList] = useState([]);
    const [objectSelected, setObjectSelected] = useState('')
    const [pastPage, setPastPage] = useState([])
    const [totalRecords, setTotalRecords] = useState(0);
    const [check, setCheck] = useState(0)
    const [loadPageNumber, setLoadPageNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPageSize, setPerPageSize] = useState(10);
    const [pageSize, setPageSize] = useState(10);

    const contentTableRef = useRef(null);
    const [visibleRowsHeight, setVisibleRowsHeight] = useState(0);


    const { data, dataModify } = useContext(LoadingContext)
    const dataConfirm = data

    useEffect(() => {

    }, [dataModify])

    useEffect(() => {
        // Function to fetch schools from API
        fetchSchools();
    }, [keySearch]);

    const updateVisibleRowsHeight = () => {
        if (contentTableRef.current) {
            const contentTableRect = contentTableRef.current.getBoundingClientRect();
            const rows = contentTableRef.current.querySelectorAll('.rowTable');

            let totalHeight = 0;
            rows.forEach(row => {
                const rowRect = row.getBoundingClientRect();
                // Kiểm tra xem row có đang hiển thị trên màn hình không
                if (rowRect.top >= contentTableRect.top && rowRect.bottom <= contentTableRect.bottom) {
                    totalHeight += rowRect.height;
                }
            });

            setVisibleRowsHeight(totalHeight);
        }
    };

    useEffect(() => {
        updateVisibleRowsHeight();
    }, [loading, schoolList]);

    useEffect(() => {
        const fetchModifySchools = async () => {
            if (dataConfirm === 2) {
                const value = JSON.parse(localStorage.getItem('userlogin'))
                if (value) {
                    const dataUser = handleDecrypt(value)
                    let dataUserToken = dataUser.token
                    try {
                        const response = await axios.delete(url + `api/School/DeleteSchool/${objectSelected}`, {
                            headers: {
                                'Authorization': `Bearer ${dataUserToken}`
                            },
                        });

                        if (response.status === 200) {
                            getDataFromChild('5', null)
                            const updatedList = schoolList.filter(item => Object.values(item)[0] !== objectSelected);
                            setSchoolList(updatedList);
                            setTotalRecords(totalRecords - 1)
                        } else {
                            console.error('Error fetching data:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    } finally {
                        handleMessageActionChange('-1');
                    }
                }
            } else if (dataConfirm === 1) {
                const updatedSchools = schoolList.map(school => {
                    if (school.id === objectSelected) {
                        return {
                            ...school,
                            schoolName: dataModify.schoolName,
                            fullname: dataModify.principalName,
                            provinceName: dataModify.provinceCode,
                        };
                    }
                    return school;
                });
                // Cập nhật trạng thái với mảng đã cập nhật
                setSchoolList(updatedSchools);

                getDataFromChild('6', null)
            } else if (dataConfirm === 3) {
                // Cập nhật trạng thái với mảng đã cập nhật

                // setPastPage(prev => [...prev, dataModify]);
                setSchoolList(prev => [...prev, dataModify]);
                setTotalRecords(totalRecords + 1)
                getDataFromChild('7', null)
            }
        }

        fetchModifySchools();
    }, [dataConfirm]);


    const fetchSchools = async () => {
        try {
            if (!keySearch) {
                keySearch = 'noKey'
            }

            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token
                await axios
                    .get(url + `api/School/SearchSchool/${loadPageNumber}/${pageSize}/${keySearch}`, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }

                    })
                    .then((response) => {
                        // Handle success
                        if (response.data) {
                            const { schools, totalRecords } = response.data;
                            setSchoolList(schools);
                            setTotalRecords(totalRecords);
                            setLoading(false)
                            if (!pastPage.includes(currentPage) && !pastPage.includes(currentPage + 1)) {
                                setPastPage(prev => [...prev, currentPage]);
                            }
                        }
                    })
                    .catch((error) => {
                        setSchoolList([]);
                        setTotalRecords(0);
                        setLoading(false)
                        console.error('Error:', error);
                    })
            }
        } catch (error) {
            setSchoolList([]);
            setTotalRecords(0);
            setLoading(false)
            console.error('Error fetching data:', error);
        }
    };



    const fetchSchoolsPage = async (pageNumberAPI) => {
        try {
            if (!keySearch) {
                keySearch = 'noKey'
            }

            const value = JSON.parse(localStorage.getItem('userlogin'))
            if (value) {
                const dataUser = handleDecrypt(value)
                let dataUserToken = dataUser.token

                await axios
                    .get(url + `api/School/SearchSchool/${pageNumberAPI}/${pageSize}/${keySearch}`, {
                        headers: {
                            'Authorization': `Bearer ${dataUserToken}`
                        }

                    })
                    .then((response) => {
                        const { schools, totalRecords } = response.data;
                        const newSchools = schools.filter(newSchool => !schoolList.some(oldSchool => oldSchool.id === newSchool.id));
                        setTotalRecords(totalRecords);
                        setSchoolList(prev => [...prev, ...newSchools]);
                        if (!pastPage.includes(currentPage) && !pastPage.includes(currentPage + 1)) {
                            setPastPage(prev => [...prev, currentPage]);
                        }
                        setLoading(false)

                    })
                    .catch((err) => {
                        setSchoolList([]);
                        setTotalRecords(0);
                        setLoading(false)
                        console.error(err)
                    })
            }
        } catch (error) {
            setSchoolList([]);
            setTotalRecords(0);
            setLoading(false)
            console.error('Error fetching data:', error);
        }
    }

    const paginate = (pageNumber) => {
        fetchSchoolsPage(pageNumber, keySearch);
        setCurrentPage(pageNumber)
    }

    const totalItems = totalRecords;
    const totalPages = Math.ceil(totalItems / perPageSize);

    const indexOfLastItem = currentPage * perPageSize;
    const indexOfFirstItem = indexOfLastItem - perPageSize;
    const currentItems = schoolList.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const maxPagesToShow = 5;
    const middlePage = Math.ceil(maxPagesToShow / 2);
    const startPage = currentPage <= middlePage ? 1 : currentPage - middlePage + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const columnWidths = {
        number: '10%', // Độ rộng của cột STT
        school: '40%', // Độ rộng của cột Trường
        principal: '20%', // Độ rộng của cột Hiệu trưởng
        city: '19%', // Độ rộng của cột Tỉnh/Thành Phố
        action: '4%', // Độ rộng của cột action
    };

    const sendDataToDelete = (row) => {
        setObjectSelected(Object.values(row)[0])
        getDataFromChild("2", row)
    }
    const sendDataToView = (row) => {
        setObjectSelected(Object.values(row)[0])
        getDataFromChild("0", row)
    }
    const sendDataToEdit = (row) => {
        setObjectSelected(Object.values(row)[0])
        getDataFromChild("1", row)
    }
    const sendDataToAdd = (row) => {
        getDataFromChild('4', row)
    }

    return (
        <div id="listSchool-wrapper">
            <div className='tableListSchool'>
                <div className='topListSchool'>
                    <p>Danh sách các Trường học ({totalRecords} Trường)</p>
                    <button>
                        <div onClick={() => sendDataToAdd(1)} className='btnAddSchool'>
                            <Icon icon="fa6-solid:plus" />
                            <p>Thêm trường mới</p>
                        </div>
                    </button>
                </div>

                <div className="table-container" style={{ position: 'relative', overflow: 'hidden' }}>
                    {loading ? (
                        <div className="loader-overlay">
                            <div className='tableBorder'>
                                <div className='topTable'>
                                    <p style={{ border: 'none', width: columnWidths.number, textAlign: 'center' }}>Số thứ tự</p>
                                    <p style={{ border: 'none', width: columnWidths.school }}>Trường</p>
                                    <p style={{ border: 'none', width: columnWidths.principal }}>Hiệu trưởng</p>
                                    <p style={{ border: 'none', width: columnWidths.city }}>Tỉnh/Thành Phố</p>
                                    <div className='iconAction' style={{ width: columnWidths.action }}></div>
                                    <div className='iconAction' style={{ width: columnWidths.action }}></div>
                                    <div className='iconAction' style={{ width: columnWidths.action }}></div>
                                </div>
                                <div className='contentTable'>
                                    {Array.from({ length: 10 }, (_, index) => index + 1).map(number => (
                                        <div className='rowTable' style={{ width: '100%' }}>
                                            <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '100%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.school, textAlign: 'center', height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '100%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.principal, textAlign: 'center', height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '100%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.city, textAlign: 'center', height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '100%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.action, height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '80%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.action, height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '80%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                            <div style={{ width: columnWidths.action, height: '2rem', padding: '5px 5px' }}>
                                                <p style={{ width: '80%', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Shimmer />
                        </div>
                    ) : (
                        <div className='tableBorder'>
                            <div className='topTable'>
                                <p style={{ width: columnWidths.number, textAlign: 'center' }}>Số thứ tự</p>
                                <p style={{ width: columnWidths.school }}>Trường</p>
                                <p style={{ width: columnWidths.principal }}>Hiệu trưởng</p>
                                <p style={{ width: columnWidths.city }}>Tỉnh/Thành Phố</p>
                                <div className='iconAction' style={{ width: columnWidths.action }}></div>
                                <div className='iconAction' style={{ width: columnWidths.action }}></div>
                                <div className='iconAction' style={{ width: columnWidths.action }}></div>
                            </div>
                            {currentItems.length > 0
                                ? (<>
                                    <div ref={contentTableRef} className='contentTable'>
                                        {currentItems.map((row, rowIndex) => (
                                            <div key={indexOfFirstItem + rowIndex} className={(indexOfFirstItem + rowIndex) % 2 === 0 ? 'even-row rowTable' : 'odd-row rowTable'}>
                                                <p style={{ width: columnWidths.number, textAlign: 'center' }}>{indexOfFirstItem + rowIndex + 1}</p>
                                                <p style={{ width: columnWidths.school }} onClick={() => sendDataToView(row)}>{Object.values(row)[1]}</p>
                                                <p style={{ width: columnWidths.principal }} onClick={() => sendDataToView(row)}>{Object.values(row)[2]}</p>
                                                <p style={{ width: columnWidths.city }} onClick={() => sendDataToView(row)}>{Object.values(row)[3]}</p>
                                                <div style={{ width: columnWidths.action }} className='iconAction' onClick={() => sendDataToView(row)}><Icon icon="ph:eye" /></div>
                                                <div style={{ width: columnWidths.action }} className='iconAction' onClick={() => sendDataToEdit(row)}><Icon icon="iconamoon:edit-light" /></div>
                                                <div style={{ width: columnWidths.action }} className='iconAction' onClick={() => sendDataToDelete(row)}><Icon icon="fluent:delete-24-regular" /></div>
                                            </div>
                                        ))}
                                        <div style={{ height: 400 - visibleRowsHeight }} className={'rowTable'}>
                                            <p style={{ width: columnWidths.number, textAlign: 'center', borderRight: '2px solid #ffa780', height: '100%' }}></p>
                                            <p style={{ width: columnWidths.school, height: '100%' }}></p>
                                            <p style={{ width: columnWidths.principal, height: '100%' }}></p>
                                            <p style={{ width: columnWidths.city, height: '100%' }}></p>
                                            <div style={{ width: columnWidths.action, backgroundColor: 'transparent' }} className='iconAction' ></div>
                                            <div style={{ width: columnWidths.action, backgroundColor: 'transparent' }} className='iconAction' ></div>
                                            <div style={{ width: columnWidths.action, backgroundColor: 'transparent' }} className='iconAction' ></div>
                                        </div>
                                    </div>
                                </>)
                                : (<>
                                    <div className='contentTable'>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'left', fontSize: '25px', marginTop: '1rem' }} className='noContent'>
                                            <Icon icon="ion:ban" style={{ fontSize: '25px' }} />
                                            <p style={{ fontSize: '18px' }}>Không có dữ liệu</p>
                                        </div>
                                    </div>
                                </>)}
                        </div>
                    )}
                </div>
                <div className="footerPaging" style={{ position: 'relative', overflow: 'hidden' }}>
                    {loading ? (
                        <div className="loader-overlay">
                            <div className="pagination">
                                <div className='firstPage'>
                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 1rem' }}>
                                        <p style={{ width: '3rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>

                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 1rem' }}>
                                        <p style={{ width: '3rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>
                                </div>

                                <div className='mainNumber'>
                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 .5rem' }}>
                                        <p style={{ width: '2rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>

                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 .5rem' }}>
                                        <p style={{ width: '2rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>
                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 .5rem' }}>
                                        <p style={{ width: '2rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>
                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 .5rem' }}>
                                        <p style={{ width: '2rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>
                                </div>

                                <div className='lastPage'>
                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 1rem' }}>
                                        <p style={{ width: '3rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>

                                    <div style={{ width: columnWidths.number, textAlign: 'center', height: '2rem', padding: '5px 5px', margin: '0 1rem' }}>
                                        <p style={{ width: '3rem', height: '1.5rem', backgroundColor: '#fad5c4', borderRadius: '5px', border: 'none' }}></p>
                                    </div>
                                </div>
                            </div>
                            <Shimmer />
                        </div>
                    ) : (
                        <div className="pagination">
                            <div className='firstPage'>
                                {currentPage > 1 && (
                                    <button onClick={() => paginate(1)}>Trang đầu</button>
                                )}

                                {currentPage > 1 && (
                                    <button onClick={() => paginate(currentPage - 1)}>Trước</button>
                                )}
                            </div>

                            <div className='mainNumber'>
                                {pageNumbers.slice(startPage - 1, endPage).map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={number === currentPage ? 'active ' : ''}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>

                            <div className='lastPage'>
                                {currentPage < totalPages && (
                                    <button onClick={() => paginate(currentPage + 1)}>Tiếp</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListShool


