// src/App.tsx

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Contact from "./Contact";
import LandingPage from "./LandingPage.tsx";
import { trackPageView } from "./analytics";

import "./App.css";

/** GA4 page views for client-side navigation; see analytics.ts. */
function AnalyticsPageViews() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}

/** Landing stays light; other SPA routes follow theme.js (system default, then user choice). */
function ColorSchemeForRoute() {
    const location = useLocation();

    useEffect(() => {
        window.__immioApplyTheme?.(location.pathname);
    }, [location.pathname]);

    return null;
}

function App() {
    return (
        <Router>
            <AnalyticsPageViews/>
            <ColorSchemeForRoute/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
        </Router>
    );
}

export default App;
