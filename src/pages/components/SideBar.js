import React, { useState } from 'react';
import { Icon } from '@iconify/react'
import '../../sass/main.scss'
import SideBarPrincipal from './SideBarPrincipal';
import SideBarAdmin from './SideBarAdmin';

const SideBar = ({stateShow, children}) => {

    //0: admin
    //1: principal
    //2: head of department
    //3: teacher


    return (
        <div style={{display: stateShow ? 'block' : 'none'}} id='sideBar-wrapper'>
            {children}
        </div>
    )
}
export default SideBar