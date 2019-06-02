import 'phaser';

export default class Title extends Phaser.State {

    public preload(): void{
        this.load.image('button', require('assets/button_play.png'));
    }

    public create(): void {
        let style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        let text = this.add.text(0, 0, "This is the menu", style);
        let button = this.add.button(this.world.centerX, this.world.centerY, 'button', () => {
            this.state.start('game');
        }, this, 2, 1, 0);
    }
}
