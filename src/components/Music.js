import React, { Component } from 'react'
import Sound from 'react-sound'
import _ from 'lodash'
import music from '../assets/sound/music/DiscoDescent.mp3'

class Music extends Component{
    state = { musicState: Sound.status.STOPPED, idSound: `sound${_.random(1,100000)}`};

    /* componentDidMount() {
        setTimeout(() => {
            const { idSound } = this.state;
            const game = this.refs[idSound];
            const event = document.createEvent('MouseEvent');
            event.initEvent('click', true, false);
            game.dispatchEvent(event);
        }, 1000);
    } */

    render() {
        const { musicState, idSound } = this.state;
        const { startMusic } = this.props;
        let ms = musicState;
        if (startMusic) ms = Sound.status.PLAYING;
        return (
            <div ref={idSound}>
                <Sound url={music} autoLoad={true} playStatus={ms} loop={true} />
            </div>
        )
    }
}

export default Music