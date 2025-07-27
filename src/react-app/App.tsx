// src/App.tsx

import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Terms from './Terms.tsx';
import Privacy from "./Privacy.tsx";
import Contact from "./Contact";
import "./App.css";

function MainPage() {
    return (
        <div className="main-container">
            <header className="header">
                <div className="logo-container">
                    <img src="/logo.svg" alt="Logo" className="logo"/>
                    <img src="/logo_name.svg" alt="Immio Logo" className="logo-name"/>
                </div>
            </header>
            
            <main className="hero-section">
                <h1 className="hero-title">
                    <span className="title-line">travel days</span>
                    <span className="title-line">tax residency</span>
                    <span className="title-line">immigration rules</span>
                    <span className="title-line">tracker</span>
                </h1>

                <div className="cta-section">
                    <button className="cta-button">
                        Download for iOS
                    </button>
                </div>
            </main>
            
            <nav className="footer-nav">
                <Link to="/contact" className="nav-link">Contact</Link>
                <Link to="/terms" className="nav-link">Terms of Use</Link>
                <Link to="/privacy" className="nav-link">Privacy Policy</Link>
            </nav>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/terms" element={<Terms/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </Router>
    );
}

export default App;
