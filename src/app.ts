import 'p2';
import 'pixi';
import 'phaser';

import { 
    Boot,
    Title,
    Game,
    MainGame
} from './states';

const STATES = [
    Boot,
    Title,
    Game,
    MainGame
]

import {
    Player,
    Enemy
} from './types'

window.onload = () => {
    let game = new Phaser.Game(544, 544);

    STATES.forEach((state)=>{
        console.log(state.name);
        game.state.add(state.name, state);
    });

    game.state.start('MainGame');
};
