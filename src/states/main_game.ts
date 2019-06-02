import 'phaser';

export default class MainGame extends Phaser.State {

    private player;
    private cursor;
    private walls;

    preload() {
        this.load.image('s', require('assets/s.png'));
        this.load.image('t', require('assets/t.png'));
        this.load.image('l', require('assets/l.png'));
        this.load.image('r', require('assets/r.png'));
        this.load.spritesheet('player', require('assets/pj_anim.png'), 16, 16);
    }

    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.world.enableBody = true;
        this.cursor = this.input.keyboard.createCursorKeys();
        this.player = this.game.add.sprite(32, 32, 'player');
        this.player.scale.setTo(2);
        this.player.smoothed = false;

        this.player.body.gravity.y = 600;

        this.player.animations.add('iddle_l', [0, 1, 2, 3], 4, true);
        this.player.animations.add('iddle_r', [4, 5, 6, 7], 4, true);
        this.player.animations.add('walk_r', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.player.animations.add('walk_l', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);
        this.player.animations.add('jump_r', [24, 25, 26, 27, 28, 29, 30], 7, true);
        this.player.animations.add('jump_l', [31, 32, 33, 34, 35, 36, 37], 7, true);

        this.walls = this.add.group();

        // Design the level. x = wall, o = coin, ! = lava.
        var level = [
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

        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {
                if (level[i][j] != ' ') {
                    var wall = this.add.sprite(16 * j, 16 * i, level[i][j]);
                    wall.smoothed = false;
                    wall.body.immovable = true;
                    this.walls.add(wall);
                }
            }
        }
        
        this.walls.scale.setTo(2);
        // Make the player and the walls collide
        this.physics.arcade.collide(this.player, this.walls);

    }

    update() {

        if (this.cursor.left.isDown)
            this.player.body.velocity.x = -200;
        else if (this.cursor.right.isDown)
            this.player.body.velocity.x = 200;
        else
            this.player.body.velocity.x = 0;

        // Make the player jump if he is touching the ground
        if (this.cursor.up.isDown && this.player.body.touching.down)
            this.player.body.velocity.y = -250;
    }


}