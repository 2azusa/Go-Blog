import React from 'react';

const footerStyles: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    fontSize: '10px',
}

const Footer: React.FC = () => {
    return (
        <div style={footerStyles}>
            <span>----- Blog Admin -----</span>
        </div>
    );
};

export default Footer;