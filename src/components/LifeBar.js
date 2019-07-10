import React from 'react'
import './LifeBar.scss'

const LifeBar = (props) => {
    const { min, max, value } = props;
    const range = (max - min);
    const percentage = (value * 100)/range;
    return (
        <div className='life-bar'>
            <div className='percentage' style={{ width: `${percentage}%`}}/>
            <div className='glass'/>
            <div className='value'>
                {value}/{max}
            </div>
        </div>
    )
};

LifeBar.defaultProps = {
    min: 0,
    max: 100,
    value: 10,
};

export default  LifeBar