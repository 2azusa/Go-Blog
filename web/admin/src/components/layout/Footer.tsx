import React from 'react';

const footerStyles: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    padding: '20px 0', // 增加一些垂直内边距
}

const lineStyles: React.CSSProperties = {
    width: '96%',
    borderBottom: '2px dashed #000', // 创建一条2像素宽的黑色虚线
    margin: '0 auto', // 使其居中
}

const Footer: React.FC = () => {
    return (
        <div style={footerStyles}>
            <div style={lineStyles}></div>
        </div>
    );
};

export default Footer;