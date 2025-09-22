import React from 'react';
import { Layout } from 'antd';

import style from './Footer.module.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
    return (
        <AntFooter className={style.footer}>
            <span>------ Blog Admin -----</span>
        </AntFooter>
    );
};

export default Footer;