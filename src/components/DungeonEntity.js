import React, { Component } from 'react';

// let jump = true;

class DungeonEntity extends Component {
    state = {
        action: null
    };

    _jump = true;

    get jump() {
        return this._jump
    }

    set jump(value) {
        this._jump = value;
    }

    pause = (node) => {
       this.jump = false;
        node.classList.remove('jump')
    };

    render() {
        const { entity, style } = this.props;
        const refs = this.refs;
        const node = refs[`node_${entity.id}`];
        // const node = ReactDOM.findDOMNode(this);
        // if (node ) node.addEventListener('webkitAnimationEnd', () => this.pause(node));
        const subType = entity.subType ? entity.subType : '';
        if (node) {
            if (!this.jump) {
                this.jump = true;
                node.classList.add('jump')
            }

            setTimeout(() => { this.pause(node); }, 200);
        }
        return (
            <div
                ref={`node_${entity.id}`}
                className={`sprite cell floor`} style={style}>
                <div className={`entity ${entity.type} ${entity.direction} ${subType}`}
                />
            </div>
        )
    }

}

export default DungeonEntity;
