import React from 'react';
import styles from './Header.module.css';

const Header = props => (
    <div className={styles.Header}>
        {props.title}
    </div>
);

export default Header