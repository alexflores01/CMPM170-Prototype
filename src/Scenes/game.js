class firstExample extends Phaser.Scene{
    constructor(){
        super('firstexample')
    }

    preload() {
        this.preload.path ='assets/'
        this.load.image('ball', 'ball.png');
        this.load.image('hoop', 'hoop.png');
    }

    create(){
        // Hoop Code
        this.GoalHoop = { x: 540, y: 300, r:80}
        this.start = { x: 540, y: 1280}
        this.spread = 70;
        this.flightTime = 700;                  // Time in ms

        // Ball Code
        this.ballCount = 1;
        this.ballsThrown = 0;
        this.ballsMade = 0;
        this.finished = 0;
        this.throwing = false;

        // Game Board
        this.add.rectangle(540, 750, 900, 1300, 0xe0e0e0).setStrokeStyle(12, 0x444444);

        // Hole
        this.add.circle(this.hole.x, this.hole.y, this.hole.r, 0x222222).setStrokeStyle(12, 0x444444);
    

        this.ball = this.physics.add.image(960, 200, 'ball');
        this.ball.setColliderWorldBounds(true);
        this.ball.setBounce(0.7);
    }

}
const game = new Phaser.Game(
    {
    width: 1920,
    height: 1080,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [firstExample],
});
