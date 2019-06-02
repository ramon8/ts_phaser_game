import 'phaser';

export default class Boot extends Phaser.State {

    public preload(): void {
        this.load.image('pic', require('assets/logo.png'));
    }

    public create(): void {
        let image = this.add.image(this.world.centerX, this.world.centerY, 'pic');
        image.anchor.setTo(0.5, 0.5);
        image.scale.setTo(0.25);

        image.alpha = 0;

        this.add.tween(image).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 0);
        this.time.events.add(Phaser.Timer.SECOND * 2, () => {
            this.state.start('title');
        }, this);
    }
}


