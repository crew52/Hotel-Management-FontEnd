
import './App.css'
import {Routes,Route} from "react-router";
import HomAdmin from "./layouts/index.jsx";
import ResponsiveAppBar from "./layouts/index.jsx";
import HeaderWithNav from "./layouts/index.jsx";

function App() {
  
    return (
        <>
            <Routes>
            <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<HeaderWithNav/>}></Route>
            </Routes>
        </>
    )
}

export default App;
