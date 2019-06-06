

export class LevelCreator {

    public level;

    public walls;
    public leftWalls;
    public rightWalls;

    public modules: any[any];

    constructor(private game: Phaser.Game) { }

    preload() {
        this.game.load.image('s', require('assets/s.png'));
        this.game.load.image('l', require('assets/l.png'));
        this.game.load.image('t', require('assets/t.png'));
        this.game.load.image('r', require('assets/r.png'));
    }

    create() {
        this.modules = [
            [
                '  l           r  ',
                '  l           r  ',
                '  l     sss   r  ',
                '  l           r  ',
                '   sss        r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l    ssss   r  ',
                '  l           r  ',
                '  l           r  ',
                '  l sss       r  ',
            ],
            [
                '  l        ss r  ',
                '  l           r  ',
                '  l           r  ',
                '  l sss       r  ',
                '  l           r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l       ss  r  ',
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l         ss   ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '   ss    ssss r  ',
                '  l           r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l        s  r  ',
                '  l           r  ',
                '   ss         r  ',
                '  l           r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '   ss         r  ',
                '  l           r  ',
                '  l           r  ',
                '  l         ss  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l       ss  r  ',
                '  l           r  ',
                '  l ss        r  ',
                '  l           r  ',
                '  l    ssss   r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l  ss       r  ',
                '  l           r  ',
                '  l       sss r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l ss    ss  r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l     sss   r  ',
                '  l           r  ',
                '  l           r  ',
                '  l  ss       r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '  l     ss    r  ',
                '  l           r  ',
            ],
            [
                '  l           r  ',
                '  l           r  ',
                '  l           r  ',
                '   ssss       r  ',
                '  l           r  ',
                '  l           r  ',
            ],
        ]
        this.level = [
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l    sss    r  ',
        ];

        for (let i = 0; i < 50; i++) {
            let rand = this.game.rnd.integerInRange(0, this.modules.length - 1);
            this.modules[rand].forEach(element => {
                this.level.push(element);
            });
        }


        let lastModule = [
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '  l           r  ',
            '   sssssssssss   ',
        ];
        lastModule.forEach(element => {
            this.level.push(element);
        });

        this.walls = this.game.add.group();
        this.leftWalls = this.game.add.group();
        this.rightWalls = this.game.add.group()

        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                if (this.level[i][j] !== ' ') {
                    let wall = this.game.add.sprite(32 * j, 32 * i, this.level[i][j]);
                    wall.smoothed = false;
                    wall.scale.setTo(2);
                    wall.body.immovable = true;
                    if (this.level[i][j] == 't' || this.level[i][j] == 's') {
                        this.walls.add(wall);
                    }
                    else if (this.level[i][j] == 'l') {
                        this.leftWalls.add(wall);
                    }
                    else if (this.level[i][j] == 'r') {
                        this.rightWalls.add(wall);
                    }
                }
            }
        }
    }
}