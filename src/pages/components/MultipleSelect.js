import React, { useState, useEffect, useRef } from 'react'
import { ConfigProvider, Select, Space, Tooltip } from 'antd'
import { Icon } from '@iconify/react'
import '../../sass/main.scss'
import { Option } from 'antd/es/mentions'

/* 
label: thông báo chọn option
optionList: danh sách các option, trong option có 'value' để kiểm tra xem option đấy có đuọc chọn hay k
optionList: danh sách các option
getDataFromChild: gui data ve parent component
className: css
*/

function MultipleSelect({ label, getDataFromChild, optionList, className, color, selectedItem }) {
    //select
   const [selectedItems, setSelectedItems] = useState([])
   const [checkValue, setCheckValue] = useState('0')
   useEffect(() => {
       if (checkValue === '0') {
           if (selectedItem.length > 0) {
               setSelectedItems(selectedItem)
           } else {
               setSelectedItems([])
           }
           setCheckValue('1')
       }
   }, [selectedItem])
    const filteredOptions = optionList.filter((o) => !selectedItems.includes(o))

    const handleSendSelectedData = () => {
        // Send selectedItems data here
        getDataFromChild(selectedItems)
    }

    useEffect(() => {
        handleSendSelectedData()
    }, [selectedItems])

    const handleChangeDataSelect = (selectedValues) => {
        setCheckValue('0')
        setSelectedItems(selectedValues)
    }

    const filterOption = (input, option) =>
        option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0

    return (
        <div id="mutiple-select" className={className}>
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 20,
                        colorBgContainer: 'transparent',
                        colorBorder: 'none',
                        colorText: color,
                        colorTextPlaceholder: color,
                    },
                }}
            >
                <Select
                    mode="multiple"
                    placeholder={label}
                    value={selectedItems}
                    onChange={handleChangeDataSelect}
                    optionLabelProp="label"
                    className="custom-select"
                    style={{
                        width: '100%',
                        height: '50%',
                        boxShadow: '0 0 0 0.15rem #fff !important',
                        borderColor: 'transparent',
                        padding: '.2rem .7rem',
                        outline: 'none',
                    }}
                    options={filteredOptions.map((item) => ({
                        value: Object.values(item)[1],
                        label: Object.values(item)[1],
                    }))}
                />
            </ConfigProvider>
        </div>
    )
}

export default MultipleSelect
