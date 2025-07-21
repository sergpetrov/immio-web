import React from "react";

const PrivacyPolicy: React.FC = () => {
    const privacyPolicyHtml = `
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: 20-07-2025</strong></p>
    
      <p>This Privacy Policy explains how <strong>Dev Mode Ltd</strong> ("we", "our", or "us") handles personal information in the <strong>Immio</strong> mobile app. We are committed to protecting your privacy and ensuring transparency about how data is used.</p>
    
      <hr>
    
      <h2>1. What We Collect</h2>
      <p>Immio does <strong>not collect personal data</strong> such as names, email addresses, location history, or trip content. However, we may collect <strong>limited anonymous data</strong> to help improve the app.</p>
    
      <p><strong>Specifically, we may collect:</strong></p>
      <ul>
        <li>Crash reports and error logs</li>
        <li>App performance metrics (e.g. screen loading times, memory usage)</li>
        <li>Basic usage analytics (e.g. feature usage frequency, number of active sessions)</li>
      </ul>
    
      <p>This information is <strong>non-personal, anonymized</strong>, and used solely to identify issues, improve stability, and enhance user experience.</p>
    
      <h2>2. What We Do Not Collect</h2>
      <p>We do <strong>not</strong>:</p>
      <ul>
        <li>Store or transmit your trip or stay data</li>
        <li>Track your GPS location</li>
        <li>Collect account details, names, or contact information</li>
        <li>Use your data for advertising or marketing</li>
        <li>Link analytics to your identity</li>
      </ul>
      <p>All trip and stay data remains <strong>entirely on your device</strong> and optionally in <strong>your iCloud account</strong>, if enabled.</p>
    
      <h2>3. How Your Data Is Stored</h2>
      <p>
        <strong>User-entered content</strong> (e.g. trips, stays, notes) is stored locally on your device and optionally in iCloud.<br>
        <strong>Analytics and crash data</strong> is collected in aggregate form via trusted platforms (e.g. Apple, Google, or similar).
      </p>
      <p>This data is stored securely, used only for diagnostic and performance improvements, and is never shared or sold.</p>
    
      <h2>4. Your Control</h2>
      <p>You remain in control of your data. You may:</p>
      <ul>
        <li>Disable iCloud sync via your device settings</li>
        <li>Control diagnostic and crash data sharing in iOS settings</li>
        <li>Delete app data anytime by removing entries or uninstalling the app</li>
      </ul>
      <p>We do not retain any personal user data on our servers.</p>
    
      <h2>5. Children's Privacy</h2>
      <p>Immio is not intended for children under the age of 18 (or equivalent minimum age in your jurisdiction). We do not knowingly collect personal information from children.</p>
    
      <h2>6. Legal Compliance</h2>
      <p>We comply with applicable privacy regulations, including:</p>
      <ul>
        <li>The <strong>UK Data Protection Act 2018</strong> and <strong>UK GDPR</strong></li>
        <li>The <strong>EU General Data Protection Regulation (GDPR)</strong></li>
        <li>The <strong>California Consumer Privacy Act (CCPA)</strong></li>
        <li>Other applicable US and international data protection laws</li>
      </ul>
      <p>Our limited anonymous data collection is based on legitimate interest for app improvement and does not involve identifiable personal data.</p>
    
      <h2>7. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Updates will be posted in the app and on our website. Continued use of Immio means you accept the revised policy.</p>
    
      <h2>8. Contact</h2>
      <p>If you have questions or concerns, please contact us at:</p>
      <p><strong><a href="mailto:support@immio.app">support@immio.app</a></strong></p>
    `;

    return (
        <div style={{maxWidth: 800, margin: '0 auto', padding: '0', textAlign: 'left'}}>
            <div dangerouslySetInnerHTML={{__html: privacyPolicyHtml}}/>
        </div>
    );
};

export default PrivacyPolicy; 