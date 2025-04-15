import './App.css'
import RoutersAdmin from "./routes/index.jsx";
import { IdleTimerProvider } from './contexts/IdleTimerContext';
import IdleTimerWarning from './components/IdleTimerWarning';
import { useAuth } from './hooks';

function App() {
    const { isAuthenticated } = useAuth();
    
    console.log('App: isAuthenticated =', isAuthenticated);
    
    return (
        <IdleTimerProvider timeout={15000}>
            <RoutersAdmin/>
            {isAuthenticated && <IdleTimerWarning />}
        </IdleTimerProvider>
    )
}

export default App
