import './App.css'
import { lazy, Suspense, useEffect } from 'react';
import { IdleTimerProvider } from './contexts/IdleTimerContext';
import IdleTimerWarning from './components/IdleTimerWarning';
import { useAuth } from './hooks';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./pages/Login'));
const HomeAdmin = lazy(() => import('./pages/HomeAdmin'));
const EmployedView = lazy(() => import('./layouts/Employed/EmployedView'));
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

// Lazy loaded admin components
const RoomCategoryList = lazy(() => import('./components/roomAdmin/RoomCategoryList'));
const RoomCategoryForm = lazy(() => import('./components/RoomCategory/RoomCategoryForm'));
const RoomList = lazy(() => import('./components/roomAdmin/RoomList'));
const RoomForm = lazy(() => import('./components/roomAdmin/RoomForm'));
const EmployeeAdmin = lazy(() => import('./pages/EmployeeAdmin/EmployeeAdmin'));

function App() {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        console.log('App: Authentication state loaded, isAuthenticated =', isAuthenticated);
    }, [isAuthenticated]);
    
    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
    }, [location.pathname]);
    
    console.log('App: Rendering with isAuthenticated =', isAuthenticated, 'loading =', loading);
    
    // Show loading spinner while authentication is being checked
    if (loading) {
        return <div className="app-loading"><LoadingSpinner /></div>;
    }
    
    return (
        <IdleTimerProvider timeout={60000}>
            <Suspense fallback={<div className="page-loading"><LoadingSpinner /></div>}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected admin routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['ROLE_ADMIN']}>
                            <HomeAdmin />
                        </ProtectedRoute>
                    }>
                        <Route path="employee" element={<EmployeeAdmin />} />
                        <Route path="rooms" element={<RoomCategoryList />} />
                        <Route path="room-categories/add" element={<RoomCategoryForm />} />
                        <Route path="room-categories/edit/:id" element={<RoomCategoryForm />} />
                        <Route path="rooms/add" element={<RoomForm />} />
                        <Route path="rooms/edit/:id" element={<RoomForm />} />
                        <Route index element={<Navigate to="rooms" replace />} />
                    </Route>
                    
                    {/* Protected employee routes */}
                    <Route path="/employed" element={
                        <ProtectedRoute>
                            <EmployedView />
                        </ProtectedRoute>
                    } />
                    
                    {/* Redirect to home page for unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
            {isAuthenticated && <IdleTimerWarning />}
        </IdleTimerProvider>
    )
}

export default App
