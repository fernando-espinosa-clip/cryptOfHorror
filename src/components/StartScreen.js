import React from 'react'

const StartScreen = (props) => {
    const { onClick } = props;
    return (
        <div style={{
            display: 'grid',
            height: '100vh',
            margin: '0',
            placeItems: 'center center',
        }}>
            <div style={{
                color: '#fff',
                padding: '5px 10px',
                margin: '0 auto',
                border: '1px solid #fff',
            }} onClick={() => onClick()}>
                Click To start
            </div>
        </div>
    )
};

export default StartScreen