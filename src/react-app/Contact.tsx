import React from "react";

const Contact: React.FC = () => (
  <div className="page-container">
    <h1 className="page-title">Contact</h1>
    
    <div className="page-content">
      <div style={{ 
        background: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '12px', 
        marginBottom: '2rem' 
      }}>
        <h2 style={{ marginTop: 0, color: '#1a1a1a' }}>App Support</h2>
        <p>
          For app support, please use email:<br/>
          <a href="mailto:support@immio.app" style={{ fontWeight: '600' }}>
            support@immio.app
          </a>
        </p>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '12px' 
      }}>
        <h2 style={{ marginTop: 0, color: '#1a1a1a' }}>Business Inquiries</h2>
        <p>
          For any other questions, feel free to reach out via this email:<br/>
          <a href="mailto:business@immio.app" style={{ fontWeight: '600' }}>
            business@immio.app
          </a>
        </p>
      </div>
    </div>
  </div>
);

export default Contact; 