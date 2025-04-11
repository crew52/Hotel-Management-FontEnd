import { useState } from 'react'
import './App.css'
import {Routes,Route} from "react-router";
import HomAdmin from "./layouts/index.jsx";
import ResponsiveAppBar from "./layouts/index.jsx";
import HeaderWithNav from "./layouts/index.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Routes>
                <Route path="/admin" element={<HeaderWithNav/>}></Route>
            </Routes>
        </>
    )
}

export default App
