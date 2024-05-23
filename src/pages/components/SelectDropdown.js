import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Input, Select, Space, Button, ConfigProvider } from 'antd';
let index = 0;

/*
label: thông báo chọn option
getDataFromChild: gửi dữ liệu được chọn lên cho component cha
optionList: danh sách các option
className: css,
dataUpdate: dữ liệu muốn chọn sẵn (truyền vào 1 object)
*/

const SelectDropdown = ({ label, getDataFromChild, optionList, className, color, dataUpdate }) => {

  const [textSearch, setTextSearch] = useState('');
  const [selected, setSelected] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef()
  const [isOpen, setInOpen] = useState(false)

  useEffect(() => {
    const fetchData = () => {
      setSearchResults(optionList);
    };

    fetchData();
  }, [optionList]);

  useEffect(() => {
    if (dataUpdate) {
      setSelected(Object.values(dataUpdate)[0])
    }
  }, [dataUpdate])

  const handleTextSearch = (e) => {
    const value = e.target.value;
    setTextSearch(value);

    const results = value
      ? optionList.filter(option =>
        Object.values(option)[1].toLowerCase().includes(value.toLowerCase())
      ) : optionList;
    setSearchResults(results);
  }

  //select
  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, isOpen);

  const handleSelectChange = (value) => {
    setSelected(value)
    getDataFromChild(optionList.find(item => item.id === value))
  };

  return (
    <div id="select-wrapper" className={className}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 20,
            colorBgContainer: 'transparent',
            colorBorder: 'none',
            colorText: color,
            colorTextPlaceholder: color
          },
        }}
      >
        <Select onClick={() => {
          setTextSearch('')
          setSearchResults(optionList)
          searchRef.current?.focus();
        }}
          style={{ width: '100%' }}
          listHeight={256}
          variant='borderless'
          onDropdownVisibleChange={value => setInOpen(value)}
          onChange={handleSelectChange}
          placeholder={label}
          value={selected ? selected : null}
          dropdownRender={(menu) => (
            <>
              {isOpen &&
                <>
                  <div style={{ width: '100%', padding: '.2rem', marginBottom: '.2rem' }} className="searchInput">
                    <input
                      style={{ width: '100%', borderRadius: '10px', padding: '5px 10px', outline: '2px solid #ffa780' }}
                      autoFocus ref={searchRef} type="text"
                      value={textSearch} onChange={handleTextSearch} placeholder="Tìm kiếm" />
                  </div>
                  {menu}
                </>
              }
            </>
          )}
          options={searchResults.map((item) => ({
            label: Object.values(item)[1],
            value: Object.values(item)[0],
          }))}
        />
      </ConfigProvider>
    </div>
  );
}

export default SelectDropdown;
