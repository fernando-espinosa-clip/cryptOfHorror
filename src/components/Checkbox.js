import React from 'react';
import styles from './Checkbox.module.scss'

export const Checkbox = props => {
    const {label, value, onClick} = props;
    return (
        <div style={{ margin: '5px' }}>
            <div className={styles.label}>{label}</div>
            <div className={`${value ? styles.checked : ''} ${styles.value}`} onClick={() => onClick()} />
        </div>
    )
};

export default Checkbox;