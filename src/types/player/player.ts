import { Utils } from './../../utils/utils';

export class Player {

    /** The default gravity on the 'y' axis */
    private GRAVITY: number = 1000;
    /** The default sprite velocity */
    private velocity: number = 150;
    private jump_vel: number = 400;
    private jumping: boolean = false;
    private force: number = 0;
    public first_jump: boolean;

    /** Duration in millisecons between fotogramas */
    private ANIMATION_MILLISECONDS_WALK: 15;
    private ANIMATION_MILLISECONDS_IDLE: 6;

    /**Default 'x' axis tile size */
    private TILE_X_SIZE: number = 16;
    /**Default 'y' axis tile size */
    private TILE_Y_SIZE: number = this.TILE_X_SIZE;

    /** Relative path to the player assets directory */
    private ASSETS_PATH: string = 'assets/s.png';
    /** Player animation file name */
    private PLAYER_ANIM_FILE: string = 's.png';

    /** All the animations of the player */
    private ANIMATIONS: { name: string, frames: number[], maxFrames: number, isLoop: boolean }[] = [
        { name: 'iddle', frames: [0, 1, 2, 3], maxFrames: 4, isLoop: true },
        { name: 'walk', frames: [4, 5, 6, 7, 8, 9, 10, 11], maxFrames: 8, isLoop: true },
        { name: 'fall', frames: [13, 14, 15, 16, 17, 18], maxFrames: 6, isLoop: false },
    ]
    /** The direction where the player is facing */
    private facing: 'left' | 'right' = 'right';

    constructor(
        /** The current instance of the Phaser.Game */
        public game: Phaser.Game,
        /** The instance of the sprite */
        public sprite?: Phaser.Sprite,
        /** The current instance of the Phaser.CursorKeys */
        public cursors?: Phaser.CursorKeys,
        public debug?: boolean,
    ) { }

    public preload() {
        this.loadAssets();
    }

    public create() {
        this.setDimensions();
        this.setAnimations();
    }

    public update() {
        this.updateMovment();
    }

    public render() {
        if (this.debug) {
            this.game.debug.body(this.sprite);
            this.game.debug.text('velocity x:' + this.sprite.body.velocity, 40, 60);
        }
    }

    /** Here you load al assets need for the player class */
    private loadAssets() {
        this.game.load.spritesheet('player', require('./assets/player.png'), this.TILE_X_SIZE, this.TILE_Y_SIZE);
    }

    public createNewPlayer(sprite: Phaser.Sprite, cursors: Phaser.CursorKeys) {
        this.sprite = sprite;
        this.cursors = cursors;
        this.create();
    }

    /**
     * Set the dimensions of the sprite
     * @param scale An object with the 'x' scale size and the 'y' scale size
     * @param smoothed Sprite will be smoothd if true
     * @param gravity Number indicating the gravity.y of the sprite
     */
    private setDimensions(
        scale: { x: number, y: number } = { x: 2, y: 2 },
        smoothed?: boolean,
        gravity?: number
    ) {
        this.sprite.scale.setTo(scale.x, scale.y);
        this.sprite.smoothed = smoothed || false;
        this.sprite.body.gravity.y = gravity || this.GRAVITY;
        this.sprite.anchor.setTo(.5, .5);

        this.sprite.body.setSize(12, 15, 2, 1);
    }

    /** Seter for all the animations tha player require */
    private setAnimations() {
        this.ANIMATIONS.forEach((animation) => {
            this.sprite.animations.add(
                animation.name,
                animation.frames,
                animation.maxFrames,
                animation.isLoop);
        });
    }

    private updateMovment() {
        if (this.cursors.left.isDown) {
            if (this.facing === 'right') {
                this.facing = 'left';
                this.sprite.scale.x *= -1;
            }
            this.moveLeft();
            if (this.first_jump === null) {
                this.first_jump = false;
            }
        } else if (this.cursors.right.isDown) {
            if (this.facing === 'left') {
                this.facing = 'right';
                this.sprite.scale.x *= -1;
            }
            this.moveRight();
            if (this.first_jump === null) {
                this.first_jump = false;
            }
        }
        if (!this.cursors.right.isDown && !this.cursors.left.isDown) {
            this.stopPlayer();
        }
        if (this.isFalling()) {
            this.playAnimation('fall', 10, false);
            if (!this.first_jump) {
                // this.sprite.angle += 25;
            }
        } else {
            if (this.cursors.up.isDown && this.canJump()) {
                if (this.first_jump === false) {
                    // this.sprite.angle += 25;
                }
                this.jump();
                this.force = this.jump_vel + 50;
                if (this.first_jump === null) {
                    this.first_jump = true;
                }
            } else if (this.cursors.up.isDown && this.force > 0 && this.jumping) {
                if (this.first_jump === false) {
                    // this.sprite.angle += 25;
                }
                if (this.first_jump === null) {
                    this.first_jump = true;
                }
                this.sprite.frame = 12;
                this.sprite.body.velocity.y -= 25;
                this.force -= 25;
            } else if (!this.cursors.up.isDown || this.force <= 0) {
                this.jumping = false;
            }
            if (this.sprite.body.velocity.x != 0) {
                this.playAnimation('walk');
            } else {
                this.playAnimation('iddle');
            }
        }
    }

    /** return true if the player can jump */
    private canJump(): boolean {
        return (this.sprite.body.touching.down);
    }

    private playAnimation(name: string, milliseconds?: number, loop?: boolean): void {
        Utils.playAnimation(this.sprite, name, milliseconds || this.ANIMATION_MILLISECONDS_WALK, loop);
    }

    private stopPlayer(): void {
        this.sprite.body.velocity.x = 0;
        // this.playAnimation('iddle', this.ANIMATION_MILLISECONDS_IDLE);
    }

    private moveLeft(vel?: number): void {
        this.sprite.body.velocity.x = (vel || this.velocity) * -1;
        // this.playAnimation('walk');
    }

    private moveRight(vel?: number): void {
        this.sprite.body.velocity.x = vel || this.velocity;
        // this.playAnimation('walk');
    }

    private jump(heihgt?: number): void {
        this.sprite.body.velocity.y = (heihgt || this.jump_vel) * -1;
        // this.playAnimation('jump_l', undefined, false);
    }

    private isFalling(): boolean {
        return this.sprite.body.velocity.y > 0;
    }
}