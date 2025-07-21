// src/App.tsx

import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Terms from './Terms.tsx';
import PrivacyPolicy from "./PrivacyPolicy";
import "./App.css";

function MainPage() {
    return (
        <div>
            <h1 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <span style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <img src="/logo.svg" alt="Logo" style={{height: '40px'}}/>
                    <img src="/logo_name.svg" alt="Immio Logo" style={{
                        height: '32px',
                        filter: 'brightness(0) saturate(100%) invert(18%) sepia(13%) saturate(2322%) hue-rotate(175deg) brightness(97%) contrast(92%)'
                    }}/>
                </span>
                <p style={{ fontSize: '0.4em', fontWeight: 'normal', margin: 30}}>Travel Days, Tax Residency and Immigration Rules Tracker</p>
            </h1>
            <nav style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/terms">Terms of Use</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
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
                <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            </Routes>
        </Router>
    );
}

export default App;
