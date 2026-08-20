// src/App.tsx

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Contact from "./Contact";
import LandingPage from "./LandingPage.tsx";
import { trackPageView } from "./analytics";

import "./App.css";

/**
 * GA4 page views for client-side navigation. `initClientAnalytics` configures
 * gtag with `send_page_view: false`, so every view — including the first —
 * is sent from here, and each one is counted exactly once.
 */
function AnalyticsPageViews() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}

function App() {
    return (
        <Router>
            <AnalyticsPageViews/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </Router>
    );
}

export default App;
