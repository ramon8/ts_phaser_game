export class Utils{
    

    public static playAnimation(sprite: Phaser.Sprite, name:string, milliseconds, loop:boolean):void{
        sprite.animations.play(name, milliseconds, loop);
    }
}