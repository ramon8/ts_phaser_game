import 'phaser';
import { Player } from './../../types';

export class MainGame extends Phaser.State {

    //Enemy status
    private cursor: Phaser.CursorKeys;
    private player: Player = new Player(this.game, null, null, true);

    private walls: Phaser.Group;
    private leftWalls;
    private rightWalls;
    private enemy;
    private rightWallHit: boolean = false;

    preload() {
        this.player = new Player(this.game);
        this.load.image('s', require('assets/s.png'));
        this.load.image('t', require('assets/t.png'));
        this.load.image('l', require('assets/l.png'));
        this.load.image('r', require('assets/r.png'));
        //this.load.image('enemy', require('assets/enemy.png'));
        this.load.spritesheet('enemy', require('assets/enemy.png'), 16, 16);
        this.player.preload();
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.enableBody = true;
        this.cursor = this.input.keyboard.createCursorKeys();

        this.player.createNewPlayer(this.game.add.sprite(32, 32, 'player'), this.cursor);

        //Enemy
        this.enemy = this.game.add.sprite(64, 32, 'enemy');
        this.enemy.body.gravity.y = 1000;
        this.enemy.smoothed = false;
        this.enemy.scale.setTo(2);
        this.enemy.body.setSize(16, 10, 0, 6);
        this.enemy.anchor.setTo(0, 0);

        this.enemy.animations.add('walk_l', [0, 1, 2, 3, 4, 5], 6, true);
        this.enemy.animations.add('walk_r', [6, 7, 8, 9, 10, 11], 6, true);

        this.walls = this.add.group();
        this.leftWalls = this.add.group();
        this.rightWalls = this.add.group();

        // Design the level. x = wall, o = coin, ! = lava.
        let level = [
            ' ttttttttttttttt ',
            'l               r',
            'l               r',
            'l           ssss ',
            'l                ',
            'l       ss      r',
            ' ss             r',
            '                r',
            'l    sss        r',
            'l               r',
            'l          sss  r',
            'l               r',
            'l   ssssss      r',
            'l               r',
            'l            sss ',
            'l            r   ',
            ' ssssssssssss    ',
        ];

        for (let i = 0; i < level.length; i++) {
            for (let j = 0; j < level[i].length; j++) {
                if (level[i][j] !== ' ') {
                    let wall = this.game.add.sprite(32 * j, 32 * i, level[i][j]);
                    wall.smoothed = false;
                    wall.scale.setTo(2);
                    wall.body.immovable = true;
                    if (level[i][j] == 't' || level[i][j] == 's') {
                        this.walls.add(wall);
                    }
                    else if (level[i][j] == 'l') {
                        this.leftWalls.add(wall);

                    }
                    else if (level[i][j] == 'r') {
                        this.rightWalls.add(wall);
                    }
                }
            }
        }
    }

    update() {
        this.game.physics.arcade.collide(this.player.sprite, this.walls);
        this.player.update();
        this.physics.arcade.collide(this.player.sprite, this.leftWalls);
        this.physics.arcade.collide(this.player.sprite, this.rightWalls);

        this.physics.arcade.collide(this.enemy, this.walls);

        this.physics.arcade.collide(this.enemy, this.rightWalls, () => {
            this.rightWallHit = true;
        });
        this.physics.arcade.collide(this.enemy, this.leftWalls, () => {
            this.rightWallHit = false;
        });
        this.physics.arcade.collide(this.enemy, this.player.sprite, () => { }, (enemy, sprite) => {
            if (sprite.y < enemy.y) {
                enemy.kill();
                sprite.body.velocity.y = -400;
            } else {

                sprite.body.velocity.y = -400;
                sprite.body.velocity.x = 0;
                sprite.frame = 0;

                this.game.time.events.add(Phaser.Timer.SECOND * 2, ()=>{
                    this.game.state.start('MainGame');
                }, this);

            }
        });

        if (!this.rightWallHit) {
            this.enemy.body.velocity.x = 20;
            this.enemy.animations.play('walk_l', 10);
        }
        else {
            this.enemy.body.velocity.x = -20;
            this.enemy.animations.play('walk_r', 10);
        }

    }

    render() {
        // this.player.render();
        // this.game.debug.body(this.player.sprite);
        // this.game.debug.body(this.enemy);
        // this.game.debug.text(this.player.sprite.body.y + ' :player', 40, 50);
        // this.game.debug.text(this.enemy.body.y + ' :enemy', 40, 100);
        // this.game.debug.text('Anchor X: ' + this.player.sprite.anchor.x.toFixed(1) + ' Y: ' + this.player.sprite.anchor.y.toFixed(1), 32, 32);
        // this.game.debug.text('Anchor X: ' + this.enemy.anchor.x.toFixed(1) + ' Y: ' + this.enemy.anchor.y.toFixed(1), 32, 32);
        // this.game.debug.body(this.player);
        // this.walls.forEachAlive((member) => {
        //     this.game.debug.body(member);
        // });
        // this.game.debug.body(this.walls);
        // this.game.debug.text(this.cursor.up.isDown, 0, 380);
        // this.game.debug.text(this.player.body.touching.down, 100, 380);
    }
    // render() {
    //     this.game.debug.body(this.player);
    //     this.game.debug.body(this.enemy);

    //     this.walls.forEachAlive((member) => {
    //         this.game.debug.body(member);
    //     });
    //     this.rightWalls.forEachAlive((member) => {
    //         this.game.debug.body(member);
    //     });
    //     this.leftWalls.forEachAlive((member) => {
    //         this.game.debug.body(member);
    //     });
    //     this.game.debug.body(this.walls);
    // }
}