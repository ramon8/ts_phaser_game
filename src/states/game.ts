import 'phaser';

export default class Game extends Phaser.State {

    private cursors;
    private player;
    private facing;
    private jumpTimer = 0;

    public preload(): void {
        this.load.spritesheet('player_walk', require('assets/player_walk.png'), 16, 18, 22);
    }
    public create(): void {
        // Basic physsics
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1000;
        this.physics.p2.world.defaultContactMaterial.friction = 0.3;
        this.physics.p2.world.setGlobalStiffness(1e5);

        // new player
        this.player = this.add.sprite(200, 200, 'player_walk');
        this.player.scale.setTo(2);
        this.physics.p2.enable([this.player]);
        this.player.body.setZeroDamping();
        this.player.body.fixedRotation = true;

        // Player animations
        this.player.animations.add('walk_right', [0, 1, 2, 3, 4, 5, 6, 7], 8, true);
        this.player.animations.add('walk_left', [8, 9, 10, 11, 12, 13, 14, 15], 8, true);
        this.player.animations.add('iddle_left', [16, 17, 18], 2, true);
        this.player.animations.add('iddle_right', [19, 20, 21], 2, true);

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
                this.player.animations.play('walk_left', 15);
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.body.moveRight(150);

            if (this.facing !== 'right') {
                this.player.animations.play('walk_right', 15);
                this.facing = 'right';
            }
        }
        else {
            this.player.body.velocity.x = 0;

            if (this.facing !== 'idle') {
                //this.player.animations.stop();

                if (this.facing === 'left') {
                    this.player.animations.play('iddle_right', 6);
                    //this.player.frame = 17;
                }
                else {
                    this.player.animations.play('iddle_left', 6);
                    //this.player.frame = 16;
                }

                this.facing = 'idle';
            }
        }
        if (this.cursors.up.isDown && this.game.time.now > this.jumpTimer && this.checkIfCanJump())
        {
            this.player.body.moveUp(300);
            this.jumpTimer = this.game.time.now + 600;
        }
    }

    public render() {

    }

    public checkIfCanJump():boolean{
        return true;
    }


}