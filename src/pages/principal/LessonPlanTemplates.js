import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { url } from '../../Config/config'
import fileDownload from 'js-file-download'

import '../../sass/main.scss'
import ViewDoc from '../components/popUp/ViewDoc'
import MenuViewDocumentApprove from '../components/popUp/MenuViewDocumentApprove'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from '../components/Ultilities/CommonFunction'

function LessonPlanTemplates() {
    const [templates, setTemplates] = useState([])
    const [showViewDoc, setShowViewDoc] = useState(false)
    const [templateUrl, setTemplateUrl] = useState('')
    const [templateName, setTemplateName] = useState('')
    const [isLoadTemplates, setIsLoadTemplates] = useState(true)

    const closeViewDoc = () => {
        setShowViewDoc(false)
    }

    const handleTemplateClick = (name, url) => {
        setTemplateName(name)
        setTemplateUrl(url)
    }

    const handleShowClick = (name, url) => {
        handleTemplateClick(name, url)
        setShowViewDoc(true)
    }

    const handleMenuClick = (action) => {
        if (action === 3) {
            setShowViewDoc(true)
        } else if (action === 4) {
            axios
                .get(templateUrl, {
                    responseType: 'blob'
                })
                .then((response) => {
                    fileDownload(response.data, templateName)
                })
        }
    }

    const loadTemplates = async () => {
        const value = JSON.parse(localStorage.getItem('userlogin'))
        if (value) {
            const dataUser = handleDecrypt(value)
            let dataUserToken = dataUser.token
            await axios
                .get(url + 'api/Plan/GetSample', {
                    headers: {
                        'Authorization': `Bearer ${dataUserToken}`
                    }
                })
                .then((res) => {
                    // console.log(res)
                    setTemplates(res.data)
                    setIsLoadTemplates(false)
                })
                .catch((err) => {
                    // console.error(err)
                    setTemplates([])
                    setIsLoadTemplates(false)
                })
        }
    }

    useEffect(() => {
        loadTemplates()
    }, [])

    return (
        <div id="lesson-plan-templates-wrapper">
            <div className="templates-container bg-white py-3 px-4">
                <div className="templates-title mb-3 p-2 fw-bold">Tài liệu mẫu</div>
                {!isLoadTemplates ? (
                    templates.length > 0 ? (
                        templates.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="template d-flex px-2 mb-3 border-bottom py-1"
                                >
                                    <div
                                        className="d-flex flex-grow-1 align-items-center"
                                        onClick={() => handleShowClick(item.name, item.url)}
                                    >
                                        {(item.name.substring(item.name.lastIndexOf('.')) ===
                                            '.doc' ||
                                            item.name.substring(item.name.lastIndexOf('.')) ===
                                            '.docx') && (
                                                <Icon
                                                    icon="simple-icons:googledocs"
                                                    style={{ color: '#4285f4' }}
                                                />
                                            )}
                                        {item.name.substring(item.name.lastIndexOf('.')) ===
                                            '.pdf' && (
                                                <Icon
                                                    icon="mingcute:pdf-fill"
                                                    style={{ color: '#d85248', fontSize: '18px' }}
                                                />
                                            )}
                                        <p className="m-0 px-2 fw-bold">{item.name}</p>
                                    </div>
                                    <div
                                        className="menu-icon menu"
                                        onClick={() => handleTemplateClick(item.name, item.url)}
                                    >
                                        <MenuViewDocumentApprove
                                            getDataFromChild={handleMenuClick}
                                        />
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="d-flex flex-column align-items-center pt-3">
                            <Icon icon="ion:ban" style={{ fontSize: '40px' }} />
                            <span className="px-3 fw-bold">Không có dữ liệu</span>
                        </div>
                    )
                ) : (
                    <div
                        style={{ backgroundColor: 'white', margin: '0', padding: '0' }}
                        className="loading"
                    >
                        <div
                            style={{ left: '56%' }}
                            className="loader"
                            dangerouslySetInnerHTML={{ __html: loadEffect }}
                        />
                    </div>
                )}
            </div>
            {showViewDoc && (
                <ViewDoc
                    getDataFromChild={closeViewDoc}
                    urlDoc={templateUrl}
                    nameLessonPlan={templateName}
                />
            )}
        </div>
    )
}

export default LessonPlanTemplates
