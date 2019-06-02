import { Utils } from './../../utils/utils';

export class Player {

    /** The default gravity on the 'y' axis */
    private GRAVITY: number = 1000;
    /** The default sprite velocity */
    private velocity: number = 200;
    private jump_vel: number = 350;

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
        { name: 'iddle_l', frames: [0, 1, 2, 3], maxFrames: 4, isLoop: true },
        { name: 'iddle_r', frames: [4, 5, 6, 7], maxFrames: 4, isLoop: true },
        { name: 'walk_r', frames: [8, 9, 10, 11, 12, 13, 14, 15], maxFrames: 8, isLoop: true },
        { name: 'walk_l', frames: [16, 17, 18, 19, 20, 21, 22, 23], maxFrames: 8, isLoop: true },
        { name: 'jump_r', frames: [24, 25, 26, 27, 28, 29, 30], maxFrames: 7, isLoop: true },
        { name: 'jump_l', frames: [31, 32, 33, 34, 35, 36, 37], maxFrames: 7, isLoop: true },
        { name: 'fall', frames: [35, 36, 37], maxFrames: 7, isLoop: false }
    ]
    /** The direction where the player is facing */
    private facing: 'idle' | 'left' | 'right';

    constructor(
        /** The current instance of the Phaser.Game */
        public game: Phaser.Game,
        /** The instance of the sprite */
        public sprite?: Phaser.Sprite,
        /** The current instance of the Phaser.CursorKeys */
        public cursors?: Phaser.CursorKeys,
        public debug?: boolean
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
        }
    }

    /** Here you load al assets need for the player class */
    private loadAssets() {
        this.game.load.spritesheet('player', require('assets/pj_anim.png'), this.TILE_X_SIZE, this.TILE_Y_SIZE);
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
        this.sprite.anchor.setTo(0, 0);
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
            this.sprite.body.velocity.x = this.velocity * -1;
            if (this.facing !== 'left') {
                this.playAnimation('walk_l');
                this.facing = 'left';
            }
        }
        else if (this.cursors.right.isDown) {
            this.sprite.body.velocity.x = this.velocity;
            if (this.facing !== 'right') {
                this.playAnimation('walk_r');
                this.facing = 'right';
            }
        }
        else {
            this.sprite.body.velocity.x = 0;
            if (this.facing !== 'idle') {
                if (this.facing === 'left') this.playAnimation('iddle_r', this.ANIMATION_MILLISECONDS_IDLE);
                else this.playAnimation('iddle_l', this.ANIMATION_MILLISECONDS_IDLE);
                this.facing = 'idle';
            }
        }
        if (this.canJump()) {
            this.sprite.body.velocity.y = this.jump_vel * -1;
        }
        if (!this.sprite.body.touching.down) {
            if (this.facing === 'left') {
                this.sprite.frame = 34;
            }
            else if (this.facing === 'right') {
                this.sprite.frame = 27;
            }
        }
    }

    /** return true if the player can jump */
    private canJump(): boolean {
        return (this.cursors.up.isDown && this.sprite.body.touching.down);
    }

    private playAnimation(name: string, milliseconds?: number): void {
        Utils.playAnimation(this.sprite, name, milliseconds || this.ANIMATION_MILLISECONDS_WALK);
    }
}