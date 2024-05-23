import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

const UploadWait = ({ getDataFromChild, dataUpload }) => {
    const [dataUploading, setDataUploading] = useState([])
    const [showContent, setShowContent] = useState(true)
    useEffect(() => {
        const reversedArray = [];
        for (let i = dataUpload.length - 1; i >= 0; i--) {
            reversedArray.push(dataUpload[i]);
        }
        setDataUploading(reversedArray)
    }, [dataUpload])

    const hideContent = () => {
        setShowContent(!showContent)
    }
    const closeContent = () => {
        let check = true
        dataUploading.forEach(item => {
            if (item.status === '1' || item.status === '2') {
                
            }else{
                check = false
            }
        })

        if (check) {
            getDataFromChild('close')
        }
    }
    return (
        <>
            <div id="uploadWait-wrapper">
                <div style={showContent ? {} : { height: '3rem', border: 'none', borderRadius: '15px' }} className="topHeader">
                    <p>Tải lên {dataUploading.length} tệp</p>
                    <div className="iconAction">
                        <div className="iconClose" onClick={() => hideContent()}>
                            <Icon icon="iconamoon:arrow-down-2-duotone" />
                        </div>
                        <div className="iconClose" onClick={() => closeContent()}>
                            <Icon icon="mingcute:close-line" />
                        </div>
                    </div>
                </div>
                {showContent && <div className="contentData">
                    {dataUploading.map((item) =>
                    (<div key={item.id} className="perItem">
                        <div className="nameUploadFile">
                            <p>{item.name}</p>
                        </div>
                        <div className="iconUpload">
                            {item.status === '0'
                                ?
                                (<Icon icon="line-md:uploading-loop" style={{ color: '#33190D' }} />)
                                :
                                (item.status === '1'
                                    ?
                                    <Icon icon="ep:success-filled" style={{ color: '#07b481' }} />
                                    :
                                    <Icon icon="clarity:error-solid" style={{ color: '#D82E18' }} />)
                            }
                        </div>

                    </div>)
                    )}
                </div>}
            </div>
        </>
    )
}

export default UploadWait