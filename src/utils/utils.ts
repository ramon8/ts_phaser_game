export class Utils{
    

    public static playAnimation(sprite: Phaser.Sprite, name:string, milliseconds):void{
        sprite.animations.play(name, milliseconds);
    }
}