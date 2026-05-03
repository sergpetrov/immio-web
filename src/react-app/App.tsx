// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Terms from './Terms.tsx';
import Privacy from "./Privacy.tsx";
import Contact from "./Contact";
import LandingPage from "./LandingPage.tsx";

import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/terms" element={<Terms/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </Router>
    );
}

export default App;
