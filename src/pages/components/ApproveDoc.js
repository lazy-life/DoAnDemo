import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import CommentReject from "./popUp/CommentReject";

//getDataFromChild: value "0" : close popUp
const ApproveDoc = ({ getDataFromChild, urlDoc, nameLessonPlan, commentContent }) => {
    const popupRef = useRef(null)
    const [commentReject, setCommentReject] = useState(false)
    const [commentValueReject, setCommentValueReject] = useState(null)
    const [comment, setComment] = useState(null)
    const docs = [
        { uri: urlDoc },
        {
            fileName: 'Hello',
            fileType: 'docx'
        }
    ];

    useEffect(() => {
        if (commentContent) {
            setCommentValueReject(commentContent)
        } else {
            setCommentValueReject(null)
        }
    }, [commentContent])

    const handleCommentReject = (id, data) => {
        if (id === '0') {
            setCommentReject(false)
        } else if (id === '1') {
            setComment(data)
            setCommentReject(false)
            const jsonReject = {
                PlanId: null,
                TypeId: 3,
                Status: 0,
                Comment: data
            }
            getDataFromChild('1', jsonReject)
            //api reject
        }
    }

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
            );
        }

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
        );
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

        return (<div className="errorLoad">
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
        </div>)
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
            if (!commentReject) {
                getDataFromChild('0', '')
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClick);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClick);
        };
    }, [commentReject]);

    const closePopup = () => {
        if (!commentReject) {
            getDataFromChild('0', '')
        }
    }

    const handleReject = () => {
        setCommentReject(true)
    }

    const handleApprove = () => {
        //api approve
        const jsonReject = {
            PlanId: null,
            TypeId: 3,
            Status: 1,
            Comment: null
        }
        getDataFromChild('1', jsonReject)
    }

    const handleViewComment = (dataComment) => {
        setCommentReject(dataComment)
        setCommentReject(true)
    }



    return (
        <>
            <div id="approveDoc-wrapper">
                <div ref={popupRef} className="viewDocBorder">
                    <div className="topPopup">
                        <div className="nameFile">
                            <p>{nameLessonPlan}</p>
                        </div>
                        {commentValueReject && <div className='commentFileReject' onClick={() => handleViewComment(commentValueReject)}>
                            <Icon icon="majesticons:comment-text" />
                        </div>}
                        <div className="bottomPopup">
                            <button className="cancel" onClick={() => handleReject()}>Từ chối</button>
                            <button className="accept" onClick={() => handleApprove()}>Phê duyệt</button>
                        </div>
                        <div onClick={() => closePopup()} className="closeBtn">
                            <Icon icon="mingcute:close-line" />
                        </div>
                    </div>
                    <div className="centerPopup">
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
                    </div>
                </div>
                {commentReject && <CommentReject getDataFromChild={handleCommentReject} commentContent={commentValueReject} />}
            </div>
        </>
    )
}
export default ApproveDoc