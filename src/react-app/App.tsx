// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./Contact";
import LandingPage from "./LandingPage.tsx";

import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </Router>
    );
}

export default App;
