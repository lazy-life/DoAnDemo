import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';


//1: principle 2: hod 3: teacher 4:admin
export const userLogin = {
    token: '',
    usId: '1',
    userRole: [3, 1],
    schoolId: 1,
    schoolevel: 2,
}

export const roles = [1, 2, 3, 4]

export const handleDecrypt = (value) => {
    const bytes = CryptoJS.AES.decrypt(value, 'secretKey');
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    const decryptedObject = JSON.parse(decryptedString);
    return decryptedObject
};

export const findPriorityValue = (array, priorityValues) => {
    for (let i = 0; i < array.length; i++) {
        const baseValue = array[i];
        for (let i = 0; i < priorityValues.length; i++) {
            const priorityValue = priorityValues[i];
            if (baseValue === priorityValue) {
                return priorityValue
            }
        }
    }
    return null;
};

export const handleAccess = (array, role) => {
    for (let i = 0; i < array.length; i++) {
        const priorityValue = array[i];
        if (priorityValue === role) {
            return true
        }
    }
    return false
}

export const handleAccessPage = (navigate, role) => {
    const value = JSON.parse(localStorage.getItem('userlogin'));
    if (value) {
        const dataUser = handleDecrypt(value)
        const isAccess = handleAccess(dataUser.userRole, role)

        if (!isAccess) {
            const roleValue = findPriorityValue(roles, dataUser.userRole);
            if (roleValue === 1) {
                navigate('/principal')
            } else if (roleValue === 2) {
                navigate('/headOfDepartment')
            } else if (roleValue === 3) {
                navigate('/hompageTeacher')
            } else if (roleValue === 4) {
                navigate('/admin')
            }
        }
    } else {
        navigate('/login')
    }
}

export const dataTimeTableEmpty = [
        {
            "dayOfWeek": 2,
            "data": [
                {
                    "id": 1,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 2,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                }
            ]
        },
        {
            "dayOfWeek": 3,
            "data": [
                {
                    "id": 3,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                }
            ]
        },
        {
            "dayOfWeek": 4,
            "data": [
                {
                    "id": 0,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 4,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                }
            ]
        },
        {
            "dayOfWeek": 5,
            "data": [
                {
                    "id": 0,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null,
                    "teacherId": null
                }
            ]
        },
        {
            "dayOfWeek": 6,
            "data": [
                {
                    "id": 0,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                }
            ]
        },
        {
            "dayOfWeek": 7,
            "data": [
                {
                    "id": 0,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                }
            ]
        },
        {
            "dayOfWeek": 1,
            "data": [
                {
                    "id": 0,
                    "session": 1,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 2,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 3,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 4,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                },
                {
                    "id": 0,
                    "session": 5,
                    "subject": null,
                    "teacher": null,
                    "subjectId": null
                }
            ]
        }
    ]