import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './hooks';
import { Provider } from 'react-redux';
import { store } from './store';
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <ToastContainer position="top-right" autoClose={3000} />
            </AuthProvider>
        </BrowserRouter>
    </Provider>
)
