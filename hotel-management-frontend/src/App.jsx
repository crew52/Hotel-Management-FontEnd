import { useState } from 'react'
import './App.css'
import RoutersAdmin from "./routes/index.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
          <RoutersAdmin/>
        </>
    )
}

export default App
