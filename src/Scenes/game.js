class firstExample extends Phaser.Scene{
    constructor(){
        super('firstexample')
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('ball', 'Water Ball_Frame_03.png');
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
        this.add.circle(this.GoalHoop.x, this.GoalHoop.y, this.GoalHoop.r, 0x222222).setStrokeStyle(12, 0x444444);

        // Hoop image on top of the hole
        this.add.image(this.GoalHoop.x, this.GoalHoop.y + 45, 'hoop').setDisplaySize(400, 400);

        // Turns + UI
        this.turnsLeft = 10;
        this.ui = this.add.text(140, 120, '', { fontSize: '48px', color: '#222' });
        this.updateUI();

        this.input.on('pointerdown', () => this.throwBalls());
    }

    updateUI() {
        this.ui.setText(`Turns: ${this.turnsLeft}   Balls: ${this.ballCount}`);
    }

    throwBalls() {
        if (this.throwing || this.turnsLeft <= 0) return;
        this.throwing = true;
        this.turnsLeft--;
        this.ballsThrown = this.ballCount;
        this.ballsMade = 0;
        this.finished = 0;
        this.updateUI();

        for (let i = 0; i < this.ballsThrown; i++) {
            const b = this.add.image(this.start.x, this.start.y, 'ball').setDisplaySize(60, 60);
            const tx = this.GoalHoop.x + Phaser.Math.Between(-this.spread * 1.2, this.spread * 1.2);
            const ty = this.GoalHoop.y + Phaser.Math.Between(-this.spread * 1.2, this.spread * 1.2);

            this.tweens.add({
                targets: b,
                x: tx,
                y: ty,
                displayWidth: 40,
                displayHeight: 40,
                duration: this.flightTime,
                delay: i * 60,
                ease: 'Quad.easeOut',
                onComplete: () => this.landBall(b),
            });
        }
    }

    landBall(b) {
        const made = Phaser.Math.Distance.Between(b.x, b.y, this.GoalHoop.x, this.GoalHoop.y) < this.GoalHoop.r;
        if (made) {
            this.ballsMade++;
            this.tweens.add({ targets: b, alpha: 0, duration: 200, onComplete: () => b.destroy() });
        } else {
            this.tweens.add({ targets: b, y: b.y + 300, alpha: 0, duration: 400, onComplete: () => b.destroy() });
        }

        this.finished++;
        if (this.finished === this.ballsThrown) this.time.delayedCall(500, () => this.endTurn());
    }

    endTurn() {
        this.ballCount = this.ballsMade * 2;   // every make duplicates
        this.throwing = false;
        this.updateUI();

        if (this.ballCount === 0 || this.turnsLeft === 0) {
            const msg = this.ballCount ? `Final: ${this.ballCount} balls!` : 'Out of balls!';
            this.add.text(540, 900, msg + '\nClick to restart', { fontSize: '72px', color: '#222', align: 'center' }).setOrigin(0.5);
            this.input.once('pointerdown', () => this.scene.restart());
        }
    }
}

const game = new Phaser.Game({
    width: 1080,
    height: 1920,
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