import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Iframe from 'react-iframe';
import { Icon } from '@iconify/react';

// Import tệp tin SCORM (index.html)

const ScormPlayer = ({ getDataFromChild, webInfor }) => {

  const refPopup = useRef(null)
  const handleClosePopUp = () => {
    getDataFromChild('close', false)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.keyCode === 27 || event.key === 'Escape') {
        getDataFromChild('close', false)
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
    if (refPopup.current && !refPopup.current.contains(e.target)) {
      getDataFromChild('close', false)
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDropdownClick);
    return () => {
      document.removeEventListener('mousedown', handleDropdownClick);
    };
  }, []);
  return (
    <div id='scorm-player-wrapper'>
      <div ref={refPopup} className='scormPlayer'>
        <div className='scormBorder'>
          <div className='scormTitle'>
            <p>{webInfor.name ? webInfor.name : ''}</p>
            <div className='closeScorm'>
              <Icon icon="ic:round-close" onClick={() => {
                handleClosePopUp()
              }} />
            </div>
          </div>
          <Iframe url={webInfor.staticSiteUrl}
            display="initial"
            position="relative"
            allowFullScreen />
        </div>
      </div>
    </div>
  );
}

export default (ScormPlayer);