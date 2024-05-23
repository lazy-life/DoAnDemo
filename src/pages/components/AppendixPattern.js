import { useState, useContext, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { indexAppendix } from './Appendix'
import MenuViewDocumentApprove from './popUp/MenuViewDocumentApprove'

import axios from 'axios'
import { url } from '../../Config/config'
import fileDownload from 'js-file-download'

import '../../sass/main.scss'
import ViewDoc from '../components/popUp/ViewDoc'
import { loadEffect } from '../components/Ultility'
import { handleDecrypt } from './Ultilities/CommonFunction'

const AppendixPattern = (title) => {
    const selectAppendix = useContext(indexAppendix)

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
        <div id="appendixPattern-wrapper">
            <div className="contentAppendix">
                <div className="templates-title mb-3 p-2 fw-bold">Tài liệu mẫu</div>

                <div className="contentRecent">
                    {!isLoadTemplates ? (
                        templates.length > 0 ? (
                            templates.map((file, index) => (
                                <div key={index} className="perScorm">
                                    <div className="fileName">
                                        <div
                                            className="recentFileName"
                                            onClick={() => handleShowClick(file.name, file.url)}
                                        >
                                            {(file.name.substring(file.name.lastIndexOf('.')) ===
                                                '.doc' ||
                                                file.name.substring(file.name.lastIndexOf('.')) ===
                                                '.docx') && (
                                                    <Icon
                                                        icon="simple-icons:googledocs"
                                                        style={{ color: '#4285f4' }}
                                                    />
                                                )}
                                            {file.name.substring(file.name.lastIndexOf('.')) ===
                                                '.pdf' && (
                                                    <Icon icon="uiw:file-pdf" style={{ color: '#D82E18', fontSize: '18px' }} />
                                                )}
                                            <p>{file.name}</p>
                                        </div>
                                        <div
                                            className="menu-icon menu"
                                            onClick={() => handleTemplateClick(file.name, file.url)}
                                        >
                                            <MenuViewDocumentApprove
                                                getDataFromChild={handleMenuClick}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                style={{ left: '47%' }}
                                className="loader"
                                dangerouslySetInnerHTML={{ __html: loadEffect }}
                            />
                        </div>
                    )}
                </div>
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

export default AppendixPattern
