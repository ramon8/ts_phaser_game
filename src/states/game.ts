import 'phaser';

export default class Game extends Phaser.State {

    private cursors;
    private player;
    private facing;
    private jumpTimer = 0;

    public preload(): void {
        // this.load.spritesheet('player_walk', require('assets/player_walk.png'), 16, 18, 22);
        this.load.spritesheet('player_anim', require('assets/pj_anim.png'), 16, 16, 38);
    }
    public create(): void {
        // Basic physsics
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1000;
        this.physics.p2.world.defaultContactMaterial.friction = 0.3;
        this.physics.p2.world.setGlobalStiffness(1e5);

        // new player
        this.player = this.add.sprite(200, 200, 'player_anim');
        this.player.scale.setTo(3);
        this.physics.p2.enable([this.player]);
        this.player.body.setZeroDamping();
        this.player.body.fixedRotation = true;

        // Player animations
        this.player.animations.add('iddle_l', [0, 1, 2, 3], 4, true);
        this.player.animations.add('iddle_r', [4, 5, 6, 7], 4, true);
        this.player.animations.add('walk_r', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.player.animations.add('walk_l', [16, 17, 18, 19, 20, 21, 22, 23], 8, true);
        this.player.animations.add('jump_r', [24, 25, 26, 27, 28, 29, 30], 7, true);
        this.player.animations.add('jump_l', [31, 32, 33, 34, 35, 36, 37], 7, true);

        // set collisions
        let spriteMaterial = this.physics.p2.createMaterial('spriteMaterial', this.player.body);
        let worldMaterial = this.physics.p2.createMaterial('worldMaterial');

        this.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        //  this.player.scale.setTo(3);
        this.player.smoothed = false;

        let groundPlayerCM = this.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { friction: 0.0 } as any);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    public update(): void {
        if (this.cursors.left.isDown) {
            this.player.body.moveLeft(150);

            if (this.facing !== 'left') {
                this.player.animations.play('walk_l', 15);
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.moveRight(150);

            if (this.facing !== 'right') {
                this.player.animations.play('walk_r', 15);
                this.facing = 'right';
            }
        }
        else {
            this.player.body.velocity.x = 0;

            if (this.facing !== 'idle') {
                //this.player.animations.stop();

                if (this.facing === 'left') {
                    this.player.animations.play('iddle_r', 6);
                    //this.player.frame = 17;
                }
                else {
                    this.player.animations.play('iddle_l', 6);
                    //this.player.frame = 16;
                }

                this.facing = 'idle';
            }
        }
        if (this.cursors.up.isDown && this.game.time.now > this.jumpTimer && this.checkIfCanJump()) {
            this.player.body.moveUp(300);
            if(this.facing === 'left'){
                this.player.animations.play('jump_l');
            }else if(this.facing === 'right'){
                this.player.animations.play('jump_r');
            }
            this.jumpTimer = this.game.time.now + 600;
        }
    }

    public render() {

    }

    public checkIfCanJump(): boolean {
        return true;
    }


}