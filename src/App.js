import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { loadEffect } from './pages/components/Ultility'

const Login = React.lazy(() => import('./pages/common/Login'))
const Admin = React.lazy(() => import('./pages/admin/Admin'))
const Teacher = React.lazy(() => import('./pages/teacher/Teacher'))
const HomPageTeacher = React.lazy(() => import('./pages/teacher/HomePageTeacher'))
const ForgetPassword = React.lazy(() => import('./pages/common/ForgetPassword'))
const PrincipalPage = React.lazy(() => import('./pages/principal/PrincipalPage'))
const HeadOfDepartmentPage = React.lazy(() => import('./pages/headOfDepartment/HeadOfDepartmentPage'))
const LoadPage = React.lazy(() => import('./pages/LoadPage/LoadPage'))

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <LoadPage />
                    </Suspense>
                }
            />
            <Route
                path="/hompageTeacher"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <HomPageTeacher />
                    </Suspense>
                }
            />
            <Route
                path="/teacher"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <Teacher />
                    </Suspense>
                }
            />
            <Route
                path="/headOfDepartment"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <HeadOfDepartmentPage />
                    </Suspense>
                }
            />

            <Route
                path="/admin"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <Admin />
                    </Suspense>
                }
            />

            <Route
                path="/login"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <Login />
                    </Suspense>
                }
            />

            <Route
                path="/forget-password"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <ForgetPassword />
                    </Suspense>
                }
            />

            <Route
                path="/principal"
                element={
                    <Suspense
                        fallback={
                            <div className="loading">
                                <div
                                    className="loader"
                                    dangerouslySetInnerHTML={{ __html: loadEffect }}
                                />
                            </div>
                        }
                    >
                        <PrincipalPage />
                    </Suspense>
                }
            />

        </Routes>
    )
}

export default App