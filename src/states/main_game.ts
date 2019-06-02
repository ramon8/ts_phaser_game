import 'phaser';

export default class MainGame extends Phaser.State {


    //Enemy status
    private player: Phaser.Sprite;
    private cursor: Phaser.CursorKeys;
    private walls: Phaser.Group;
    private facing: 'left' | 'idle' | 'right';
    private leftWalls;
    private rightWalls;
    private enemy;
    private rightWallHit: boolean = false;
    preload() {
        this.load.image('s', require('assets/s.png'));
        this.load.image('t', require('assets/t.png'));
        this.load.image('l', require('assets/l.png'));
        this.load.image('r', require('assets/r.png'));
        this.load.image('enemy', require('assets/enemy.png'));
        this.load.spritesheet('player', require('assets/pj_anim.png'), 16, 16);
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.enableBody = true;
        this.cursor = this.input.keyboard.createCursorKeys();
        this.player = this.game.add.sprite(32, 32, 'player');
        this.player.scale.setTo(2);
        this.player.smoothed = false;

        this.player.body.gravity.y = 800;

        this.player.animations.add('iddle_l', [0, 1, 2, 3], 4, true);
        this.player.animations.add('iddle_r', [4, 5, 6, 7], 4, true);
        this.player.animations.add('walk_r', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.player.animations.add('walk_l', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);
        this.player.animations.add('jump_r', [24, 25, 26, 27, 28, 29, 30], 7, true);
        this.player.animations.add('jump_l', [31, 32, 33, 34, 35, 36, 37], 7, true);
        this.player.animations.add('fall', [35, 36, 37], 7, false);

        //Enemy
        this.enemy = this.game.add.sprite(64, 32, 'enemy');
        this.enemy.body.gravity.y = 600;
        this.enemy.smoothed = false;
        this.player.body.velocity.x = 200;

        this.walls = this.add.group();
        this.leftWalls = this.add.group();
        this.rightWalls = this.add.group();

        // Design the level. x = wall, o = coin, ! = lava.
        let level = [
            ' ttttttttttttttt ',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            'l               r',
            ' sssssssssssssss ',
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
        this.game.physics.arcade.collide(this.player, this.walls);
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;

            if (this.facing !== 'left') {
                this.player.animations.play('walk_l', 15);
                this.facing = 'left';
            }
        }
        else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = 200;

            if (this.facing !== 'right') {
                this.player.animations.play('walk_r', 15);
                this.facing = 'right';
            }
        }
        else {
            this.player.body.velocity.x = 0;
            if (this.facing !== 'idle') {
                if (this.facing === 'left') {
                    this.player.animations.play('iddle_r', 6);
                }
                else {
                    this.player.animations.play('iddle_l', 6);
                }
                this.facing = 'idle';
            }
        }
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -250;
            // if (this.facing === 'left') {
            //     this.player.animations.play('jump_l');
            // } else if (this.facing === 'right') {
            //     this.player.animations.play('jump_r');
            // }
        }
        if (!this.player.body.touching.down) {
            if (this.facing === 'left') {
                this.player.frame = 34;
            }
            else if (this.facing === 'right') {
                this.player.frame = 27;
            }
        }
        this.physics.arcade.collide(this.player, this.walls);
        this.physics.arcade.collide(this.player, this.leftWalls);
        this.physics.arcade.collide(this.player, this.rightWalls);

        this.physics.arcade.collide(this.enemy, this.walls);

        if (!this.rightWallHit) {
            this.enemy.body.velocity.x = 200;
        }
        else {
            this.enemy.body.velocity.x = -200;

        }

        this.physics.arcade.collide(this.enemy, this.rightWalls, () => {
            this.rightWallHit = true;
        });
        this.physics.arcade.collide(this.enemy, this.leftWalls, () => {
            this.rightWallHit = false;
        });

    }

    render() {
        // this.game.debug.body(this.player);
        // this.walls.forEachAlive((member) => {
        //     this.game.debug.body(member);
        // });
        // this.game.debug.body(this.walls);
        // this.game.debug.text(this.cursor.up.isDown, 0, 380);
        // this.game.debug.text(this.player.body.touching.down, 100, 380);
    }

    checkIfCanJump(): boolean {
        return true;
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