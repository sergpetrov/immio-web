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
                    <span className="title-line">Travel days</span>
                    <span className="title-line">Tax residency</span>
                    <span className="title-line">Immigration rules</span>
                    <span className="title-line">Tracker</span>
                </h1>

                <div className="cta-section">
                    <a
                        className="cta-button"
                        href="https://apps.apple.com/app/immio-travel-days-tracker/id6747927306"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download for iOS
                    </a>
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
