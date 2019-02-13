import React from 'react';
import styles from './Header.module.css';

const Header = props => (
    <div className={styles.Header}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.languageSwitcher}>EN</div>
    </div>
);

export default Header