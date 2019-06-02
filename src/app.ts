import 'p2';
import 'pixi';
import 'phaser';

import Boot from './states/boot';
import Title from './states/title';
import Game from './states/game';
import MainGame from './states/main_game';

window.onload = () => {
    let game = new Phaser.Game(544, 544);
    game.state.add('boot', Boot);
    game.state.add('title', Title);
    game.state.add('game', Game);
    game.state.add('main_game', MainGame);
    
    game.state.start('main_game');
};
