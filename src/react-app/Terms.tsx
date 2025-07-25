import React from 'react';

const Terms: React.FC = () => {
    const termsHtml = `
      <h1>Terms of Use</h1>
      <p><strong>Last updated: 25-07-2025</strong></p>
  
      <p>Welcome to <strong>Immio</strong>, a mobile application provided by <strong>Dev Mode Ltd.</strong> ("we", "our", or "us"). Immio helps you track your trips, stays, and understand potential implications related to immigration, tax residency, and similar matters. By using the Immio app, you agree to these Terms of Use and Apple End User License Agreement (<a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula">EULA</a>). If you do not agree, please do not use the app.</p>
 
      <hr>
  
      <h2>1. Purpose of the App</h2>
      <p>Immio is a <strong>personal tracker tool only</strong>. It does <strong>not provide legal, tax, immigration, residency, or financial advice</strong>. Any information provided in the app is general in nature and should not be considered legal guidance. You are solely responsible for consulting with qualified professionals (e.g., immigration lawyers, tax advisors) regarding your specific circumstances.</p>
  
      <h2>2. Data Storage & Privacy</h2>
      <p>Your data is stored <strong>only on your device and in your personal iCloud account</strong> (if enabled). We do not collect, access, or transmit your personal data to our servers. For details, see our <a href="/privacy">Privacy Policy</a>.</p>
  
      <p>We comply with applicable data laws, including:</p>
      <ul class="terms-list">
        <li>The <strong>UK Data Protection Act 2018</strong> and <strong>UK GDPR</strong></li>
        <li>The <strong>EU General Data Protection Regulation (GDPR)</strong></li>
        <li>The <strong>California Consumer Privacy Act (CCPA)</strong></li>
        <li>Any other applicable US federal or state privacy laws</li>
      </ul>
      <p>You are responsible for maintaining the security and backup of your data.</p>
  
      <h2>3. No Warranties or Liability</h2>
      <p>The app is provided <strong>"as is"</strong>, without warranties of any kind. We are <strong>not liable</strong> for any damages, loss of data, misinterpretation of stay or residency thresholds, or any legal or financial consequences resulting from use of Immio.</p>
      <p>Use of the app is <strong>entirely at your own risk</strong>.</p>
  
      <h2>4. User Responsibilities</h2>
      <p>You must not:</p>
      <ul class="terms-list">
        <li>Use the app for unlawful or harmful purposes</li>
        <li>Misrepresent your data or usage in any legal filings</li>
        <li>Rely on the app as a substitute for professional advice</li>
      </ul>
  
      <h2>5. Intellectual Property</h2>
      <p>All content, design, and code in the Immio app are owned by Dev Mode Ltd or its licensors. You may not reverse engineer, modify, or redistribute the app without written consent.</p>
  
      <h2>6. Governing Law</h2>
      <p>These Terms are governed by the laws of <strong>England and Wales</strong>, without regard to its conflict of laws principles. You agree to submit to the exclusive jurisdiction of the courts of London, UK.</p>
  
      <h2>7. Modifications</h2>
      <p>We may update these Terms from time to time. Continued use of the app after changes means you accept the revised Terms.</p>
  
      <h2>8. Contact</h2>
      <p>If you have questions or concerns, please contact us <strong><a href="mailto:support@immio.app">support@immio.app</a></strong></p>
    `;

    return (
        <div style={{maxWidth: 800, margin: '0 auto', padding: '0', textAlign: 'left'}}>
            <div dangerouslySetInnerHTML={{__html: termsHtml}}/>
        </div>
    );
};

export default Terms; 