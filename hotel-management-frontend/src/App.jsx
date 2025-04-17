import './App.css'
import RoutersAdmin from "./routes/index.jsx";
import { IdleTimerProvider } from './contexts/IdleTimerContext';
import IdleTimerWarning from './components/IdleTimerWarning';
import { useAuth } from './hooks';
import { useEffect } from 'react';

function App() {
    const { isAuthenticated, loading } = useAuth();
    
    useEffect(() => {
        console.log('App: Authentication state loaded, isAuthenticated =', isAuthenticated);
    }, [isAuthenticated]);
    
    console.log('App: Rendering with isAuthenticated =', isAuthenticated, 'loading =', loading);
    
    // While authentication is loading, we could show a loading spinner here
    if (loading) {
        return <div>Loading authentication...</div>;
    }
    
    return (
        <IdleTimerProvider timeout={60000}>
            <RoutersAdmin/>
            {isAuthenticated && <IdleTimerWarning />}
        </IdleTimerProvider>
    )
}

export default App
