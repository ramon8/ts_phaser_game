import 'p2';
import 'pixi';
import 'phaser';

import Boot from './states/boot';
import Title from './states/title';
import Game from './states/game';

window.onload = () => {
    let game = new Phaser.Game(500, 400);
    game.state.add('boot', Boot);
    game.state.add('title', Title);
    game.state.add('game', Game);
    
    game.state.start('boot');
};
