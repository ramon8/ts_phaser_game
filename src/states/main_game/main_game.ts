import 'phaser';
import { Player } from './../../types';
import { LevelCreator } from './../../models';

export class MainGame extends Phaser.State {

    //Enemy status
    private cursor: Phaser.CursorKeys;
    private player: Player;
    private levelCreator: LevelCreator;

    private enemy;
    private rightWallHit: boolean = false;

    preload() {
        this.levelCreator = new LevelCreator(this.game);
        this.player = new Player(this.game, null, null, false);


        //this.load.image('enemy', require('assets/enemy.png'));
        this.load.spritesheet('enemy', require('assets/enemy.png'), 16, 16);
        this.player.preload();
        this.levelCreator.preload();
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.enableBody = true;
        this.cursor = this.input.keyboard.createCursorKeys();

        this.levelCreator.create();


        this.game.world.setBounds(0, 0, this.levelCreator.level[0].length * 32, this.levelCreator.level.length * 32);

        ;

        this.player.createNewPlayer(this.game.add.sprite(300, 200, 'player'), this.cursor);


        //Enemy
        this.enemy = this.game.add.sprite(64, 32, 'enemy');
        this.enemy.body.gravity.y = 1000;
        this.enemy.smoothed = false;
        this.enemy.scale.setTo(2);
        this.enemy.body.setSize(16, 10, 0, 6);
        this.enemy.anchor.setTo(0, 0);

        this.enemy.animations.add('walk_l', [0, 1, 2, 3, 4, 5], 6, true);
        this.enemy.animations.add('walk_r', [6, 7, 8, 9, 10, 11], 6, true);


        this.game.camera.follow(this.player.sprite);
    }

    update() {
        this.game.physics.arcade.collide(this.player.sprite, this.levelCreator.walls, () => {
            this.player.collideWallHandler();
        });
        this.player.update();
        this.physics.arcade.collide(this.player.sprite, this.levelCreator.leftWalls);
        this.physics.arcade.collide(this.player.sprite, this.levelCreator.rightWalls);

        this.physics.arcade.collide(this.enemy, this.levelCreator.walls);

        this.physics.arcade.collide(this.enemy, this.levelCreator.rightWalls, () => {
            this.rightWallHit = true;
        });
        this.physics.arcade.collide(this.enemy, this.levelCreator.leftWalls, () => {
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

                this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
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
        this.player.render();

        // this.game.debug.cameraInfo(this.game.camera, 200, 200);
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