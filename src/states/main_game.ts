import 'phaser';

export default class MainGame extends Phaser.State {

    private player: Phaser.Sprite;
    private cursor: Phaser.CursorKeys;
    private walls: Phaser.Group;
    private facing: 'left' | 'idle' | 'right';
    preload() {
        this.game.load.image('s', require('assets/s.png'));
        this.game.load.image('t', require('assets/t.png'));
        this.game.load.image('l', require('assets/l.png'));
        this.game.load.image('r', require('assets/r.png'));
        this.game.load.spritesheet('player', require('assets/pj_anim.png'), 16, 16);
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

        this.walls = this.game.add.group();

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
                    this.walls.add(wall);
                }
            }
        }

        // Make the player and the walls collide

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
}