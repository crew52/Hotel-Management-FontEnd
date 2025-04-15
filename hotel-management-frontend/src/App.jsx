import './App.css'
import RoutersAdmin from "./routes/index.jsx";
import { IdleTimerProvider } from './contexts/IdleTimerContext';

function App() {
    // Handle idle timeout callback
    const handleOnIdle = () => {
        console.log('User has gone idle');
        // You can perform actions like automatic logout here
        // For example: authService.logout();
    };

    return (
        <IdleTimerProvider timeout={300000} onIdle={handleOnIdle}>
            <RoutersAdmin/>
        </IdleTimerProvider>
    )
}

export default App
