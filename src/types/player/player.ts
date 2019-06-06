import { Utils } from './../../utils/utils';
import { Game } from '../../states';

export class Player {

    /** The default gravity on the 'y' axis */
    private gravity: number = 1000;
    /** The default sprite velocity */
    private velocity: number = 200;
    private jump_vel: number = 450;
    private isDown: boolean = false;

    private ammo: number = 8;

    private jumpTimer: number = 0.1;

    private text;

    private SPIN_FRAME: number = 19;

    /**Default 'x' axis tile size */
    private TILE_X_SIZE: number = 16;
    /**Default 'y' axis tile size */
    private TILE_Y_SIZE: number = this.TILE_X_SIZE;

    private SPIN_ROTATION: number = 15;

    public spin: boolean;

    public splash_down;
    public splash_up;

    public rebote: boolean = false;

    /** All the animations of the player */
    private ANIMATIONS: { name: string, frames: number[], maxFrames: number, isLoop: boolean }[] = [
        { name: 'idle', frames: [0, 1, 2, 3], maxFrames: 4, isLoop: true },
        { name: 'walk', frames: [4, 5, 6, 7, 8, 9, 10, 11], maxFrames: 8, isLoop: false },
        { name: 'fall', frames: [13, 14, 15, 16, 17, 18], maxFrames: 6, isLoop: true },
        { name: 'jumpDown', frames: [20, 21, 22], maxFrames: 3, isLoop: false },
    ]
    /** The direction where the player is facing */
    private facing: 'left' | 'right' = 'right';
    private facingSpin: 'left' | 'right';

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
        this.setSplash();
    }

    public update() {
        this.updateMovement();
    }

    public render() {
        if (this.debug) {
            this.game.debug.body(this.sprite);
            // this.game.debug.body(this.splash_down);
            this.game.debug.text('r:' + this.sprite.body.touching.right, 40, 60);
            this.game.debug.text(':' + this.sprite.body.touching.left, 40, 80);
            this.game.debug.text(':' + this.sprite.body.touching.up, 40, 100);
        }
    }

    private setSplash(): void {
        this.splash_down = this.game.add.sprite(0, 0, 'splash_down');
        this.splash_down.animations.add('splash', [0, 1, 2, 3, 4], 5, false);
        this.splash_down.scale.setTo(2);
        this.splash_down.anchor.setTo(.5, .5);
        this.splash_down.smoothed = false;

        this.splash_up = this.game.add.sprite(0, 0, 'splash_up');
        this.splash_up.animations.add('splash', [0, 1, 2, 3, 4, 5, 6, 7], 8, false);
        this.splash_up.scale.setTo(2);
        this.splash_up.anchor.setTo(.5, .5);
        this.splash_up.smoothed = false;
    }

    /** Here you load al assets need for the player class */
    private loadAssets() {
        this.game.load.spritesheet('player', require('./assets/player.png'), this.TILE_X_SIZE, this.TILE_Y_SIZE);
        this.game.load.spritesheet('splash_down', require('./assets/splash_down.png'), this.TILE_X_SIZE, this.TILE_Y_SIZE);
        this.game.load.spritesheet('splash_up', require('./assets/splash_up.png'), this.TILE_X_SIZE, this.TILE_Y_SIZE);
    }

    public createNewPlayer(sprite: Phaser.Sprite, cursors: Phaser.CursorKeys) {
        this.sprite = sprite;
        this.cursors = cursors;
        this.create();
        var style = { font: "10px", fill: "#ffffff", align: "center" };
        this.text = this.game.add.text(0, 0, "Player: " + this.ammo, style);
    }

    afegirText(x, y){
        this.text.x = x;
        this.text.y = y - 15;
        this.text.text = 'Player: ' + this.ammo;
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
        this.sprite.body.gravity.y = gravity || this.gravity;
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
    
    private updateMovement() {
        this.spinPlayer();
        this.checkIfJump();

        if (this.cursors.left.isDown) {
            if (this.facing == 'right') {
                this.facing = 'left';
                this.sprite.scale.x *= -1;
            }
            this.moveLeft();
        } else if (this.cursors.right.isDown) {
            if (this.facing === 'left') {
                this.facing = 'right';
                this.sprite.scale.x *= -1;
            }
            this.moveRight();
        } else {
            this.stopPlayer();
        }

        if (this.isFalling() && !this.spin) {
            this.playAnimation('fall', 20);
        }

        if (this.sprite.body.velocity.x != 0 && this.sprite.body.touching.down) {
            this.sprite.animations.play('walk', 25);
            // this.playAnimation('walk', this.ANIMATION_MILLISECONDS_WALK);
        } else {
            if (this.sprite.body.touching.down) {
                if (this.sprite.animations.currentAnim.name != 'jumpDown') {
                    this.playAnimation('idle', 10);
                } else if (this.sprite.animations.currentAnim.isFinished) {
                    this.playAnimation('idle', 10);
                }
            }
        }
        this.afegirText(this.sprite.body.x, this.sprite.body.y);
        this.generalChecks();
    }

    private generalChecks(): void {
        if (!this.sprite.body.touching.down) {
            this.isDown = false;
        }
    }

    /** return true if the player can jump */
    private canJump(): boolean {
        return ((this.sprite.body.touching.down || this.ammo != 0) && this.game.time.totalElapsedSeconds() > this.jumpTimer);
    }

    private playAnimation(name: string, milliseconds?: number, loop?: boolean): void {
        this.sprite.animations.play(name, milliseconds, loop);
    }

    private stopPlayer(): void {
        this.sprite.body.velocity.x = 0;
        // this.playAnimation('idle', this.ANIMATION_MILLISECONDS_IDLE);
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

    private spinPlayer(): void {
        if (this.spin) {
            this.sprite.animations.stop();
            this.sprite.frame = this.SPIN_FRAME;
            if (this.facingSpin === 'right') {
                this.sprite.angle += this.SPIN_ROTATION;
            } else {
                this.sprite.angle -= this.SPIN_ROTATION;
            }
        }
    }

    private checkIfJump(): void {
        if (this.cursors.up.isDown && this.canJump()) {
            if (this.cursors.right.isDown || this.cursors.left.isDown) {
                this.spin = true;
                this.facingSpin = this.facing;
            }
            this.jumpTimer = this.game.time.totalElapsedSeconds() + 0.1;
            this.playSplashUp();
            this.jump();
            this.ammo --;
        }
    }

    public stopSpin() {
        this.sprite.angle = 0;
        this.spin = false;
    }

    public collideWallHandler() {
        if (!this.isDown && this.sprite.body.touching.down) {
            this.playAnimation('jumpDown', 15, false);
            this.playSplashDown();
            this.stopSpin();
            this.isDown = true;
            this.ammo = 8;
            // if (this.sprite.body.velocity.x != 0 && !this.rebote) {
            //     this.jump(150);
            //     this.rebote = true;
            // } else if (this.rebote) {
            //     this.rebote = false;
            // }
        }
        //this.playAnimation('idle');
        // if (this.sprite.body.touching.down) {
        //     this.stopSpin();
        //     this.isDown = true;
        // }
    }

    private playSplashDown() {
        this.splash_down.body.x = this.sprite.body.x - 7;
        this.splash_down.body.y = this.sprite.body.y;
        this.splash_down.animations.play('splash', 30);
    }

    private playSplashUp() {
        this.splash_up.body.x = this.sprite.body.x - 7;
        this.splash_up.body.y = this.sprite.body.y;
        this.splash_up.animations.play('splash', 60);
    }
}