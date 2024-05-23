import { forwardRef, useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"

const MenuViewDocumentApprove = forwardRef(({ getDataFromChild }, ref) => {
    const [showMenu, setShowMenu] = useState(false)
    const handleClickAction = (action) => {
        getDataFromChild(action)
        setShowMenu(false)
    }
    const menuRef = useRef(null);
    const itemClickRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target) && !itemClickRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    const updateMenuPosition = () => {
        if (itemClickRef.current && menuRef.current) {
            const itemClickRect = itemClickRef.current.getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();
            let top = itemClickRect.bottom; // Hiển thị menu dưới itemClick mặc định
    
            // Kiểm tra xem menu có vượt ra ngoài biên dưới của phần tử cha không
            if (itemClickRect.bottom + menuRect.height > window.innerHeight) {
                top = itemClickRect.top - menuRect.height; // Hiển thị menu trên itemClick
            }
    
            menuRef.current.style.left = itemClickRect.left - 70 + 'px';
            menuRef.current.style.top = top + 'px';
        }
    };

    useEffect(() => {
        if (showMenu) {
            updateMenuPosition();
        }
    }, [showMenu]);
    return (
        <div>
            <div ref={itemClickRef} className="itemClick" onClick={() => setShowMenu(!showMenu)}>
                <Icon icon="charm:menu-kebab" style={{ width: '20px', height: '20px' }} />
            </div>
            {showMenu &&
                <div className="popup" style={{ height: '', overflow: 'auto' }}>
                    <div ref={menuRef} className="menuViewDocument-wrapper">
                        <div className="actionMenuViewDocument view" onClick={() => handleClickAction(3)}>
                            <Icon icon="ep:view" />
                            <p>Xem</p>
                        </div>
                        <div className="actionMenuViewDocument download" onClick={() => handleClickAction(4)}>
                            <Icon icon="radix-icons:download" />
                            <p>Tải xuống</p>
                        </div>

                    </div>
                </div>}
        </div>
    )
}
)

export default MenuViewDocumentApprove