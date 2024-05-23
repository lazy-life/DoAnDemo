import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Icon } from "@iconify/react";
import fileDownload from 'js-file-download'
import { useEffect, useRef, useState } from "react";
import { loadEffect } from "../Ultility";
import axios from "axios";
import { handleDecrypt } from "../Ultilities/CommonFunction";


//getDataFromChild: value "0" : close popUp
const ViewDoc = ({ getDataFromChild, urlDoc, nameLessonPlan }) => {
    const popupRef = useRef(null)
    const [docs, setDocs] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 600);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDocs([
                { uri: urlDoc },
                {
                    fileName: 'Hello',
                    fileType: 'docx'
                }
            ])
            setIsLoading(false);
        }, 600);

        return () => {
            clearTimeout(timeout);
        };
    }, [urlDoc])

    const LoadingRenderer = ({ document, fileName }) => {
        const fileText = fileName || document?.fileType || "";

        if (fileText) {
            return (
                <div className="errorLoad">
                    <div class="ui-error">
                        <svg viewBox="0 0 87 87" version="1.1">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Group-2" transform="translate(2.000000, 2.000000)">
                                    <circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                    <circle class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <p>Đang tải...</p>
                </div>
            )
        }

        return <div>Đang tải...</div>;
    };

    const NoRenderer = ({ document, fileName }) => {
        const fileText = fileName || document?.fileType || "";

        if (fileText) {
            return (
                <div className="errorLoad">
                    <div class="ui-error">
                        <svg viewBox="0 0 87 87" version="1.1">
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Group-2" transform="translate(2.000000, 2.000000)">
                                    <circle id="Oval-2" stroke="rgba(252, 191, 191, .5)" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                    <circle class="ui-error-circle" stroke="#F74444" stroke-width="4" cx="41.5" cy="41.5" r="41.5"></circle>
                                    <path class="ui-error-line1" d="M22.244224,22 L60.4279902,60.1837662" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
                                    <path class="ui-error-line2" d="M60.755776,21 L23.244224,59.8443492" id="Line" stroke="#F74444" stroke-width="3" stroke-linecap="square"></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <p>Tài liệu đang không khả dụng! Vui lòng thử lại sau!</p>
                </div>
            )
        }

        return <div>Tài liệu bị lỗi!</div>;
    };

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.keyCode === 27 || event.key === 'Escape') {
                getDataFromChild('0', '')
            }
        }

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyDown);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleDropdownClick = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            getDataFromChild('0', '')
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClick);
        };
    }, []);

    const closePopup = () => {
        getDataFromChild('0', '')
    }
    const handleDownload = (url, filename) => {
        axios.get(url, {
            responseType: 'blob'
        })
            .then((res) => {
                fileDownload(res.data, filename)
            })
    }

    return (
        <>
            <div id="viewDoc-wrapper">
                <div ref={popupRef} className="viewDocBorder">
                    <div className="topPopup">
                        <div className="nameFile">
                            <Icon icon="simple-icons:googledocs" style={{ color: '#4285f4' }} />
                            <div className="nameViewDocument">
                                <p>{nameLessonPlan}</p>
                            </div>
                        </div>
                        <div className="bottomPopup">
                            <button onClick={() => handleDownload(urlDoc, nameLessonPlan)} className="download"><Icon icon="tabler:download" /></button>
                            <button onClick={() => closePopup()} className="save">Xong</button>
                        </div>
                        <div onClick={() => closePopup()} className="closeBtn">
                            <Icon icon="mingcute:close-line" />
                        </div>
                    </div>
                    <div className="centerPopup">
                        {isLoading ? (
                            <>
                                <div style={{ backgroundColor: 'white', margin: '0', padding: '0' }} className="loading">
                                    <div
                                        style={{ left: '48%' }}
                                        className="loader"
                                        dangerouslySetInnerHTML={{ __html: loadEffect }}
                                    />
                                </div>
                            </>
                        ) : (
                            <DocViewer documents={docs}
                                config={{
                                    header: {
                                        disableHeader: true,
                                        disableFileName: true,
                                        retainURLParams: true,
                                    },
                                    loadingRenderer: {
                                        overrideComponent: LoadingRenderer,
                                    },
                                    noRenderer: {
                                        overrideComponent: NoRenderer,
                                    },
                                    csvDelimiter: ",", // "," as default,
                                    pdfZoom: {
                                        defaultZoom: 1.1, // 1 as default,
                                        zoomJump: 0.2, // 0.1 as default,
                                    },
                                    pdfVerticalScrollByDefault: true, // false as default
                                }}
                                pluginRenderers={DocViewerRenderers}
                                iframeProps={{
                                    sandbox: "allow-scripts"
                                }}
                                style={{
                                    borderRadius: '0 0 20px 20px'
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewDoc