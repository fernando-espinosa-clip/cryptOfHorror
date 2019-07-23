import React, { Component } from "react";
import UIfx from "uifx";
import playerAttackSound from "../assets/sound/en_blademaster_attack_near.mp3";
import enemyAttackSound from "../assets/sound/en_skeleton_knight_attack.mp3";

const playerAttack = new UIfx({ asset: playerAttackSound });
const enemyAttack = new UIfx({ asset: enemyAttackSound });
// let jump = true;

class DungeonEntity extends Component {
  state = {
    action: null
  };

  _jump = true;

  get jump() {
    return this._jump;
  }

  set jump(value) {
    this._jump = value;
  }

  pause = node => {
    this.jump = false;
    node.classList.remove("jump");
  };

  render() {
    const { entity, style } = this.props;
    const refs = this.refs;
    const node = refs[`node_${entity.id}`];
    // const node = ReactDOM.findDOMNode(this);
    // if (node ) node.addEventListener('webkitAnimationEnd', () => this.pause(node));
    const subType = entity.subType ? entity.subType : "";
    if (node && entity.action === "move") {
      console.log("move", entity.type);
      if (!this.jump) {
        this.jump = true;
        node.classList.add("jump");
      }

      setTimeout(() => {
        this.pause(node);
      }, 200);
    }
    if (entity.action === "attack") {
      if (entity.type === "player") playerAttack.play();
      if (entity.type === "enemy") enemyAttack.play();
    }
    return (
      <div ref={`node_${entity.id}`} className={`sprite cell`} style={style}>
        <div
          className={`entity ${entity.type} ${entity.direction} ${subType}`}
        />
      </div>
    );
  }
}

export default DungeonEntity;
