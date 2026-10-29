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

        // Score = total balls that went in this game
        this.score = 0;

        // Game Board
        this.add.rectangle(540, 750, 900, 1300, 0xe0e0e0).setStrokeStyle(12, 0x444444);

        // Hole
        this.hole = this.add.circle(this.GoalHoop.x, this.GoalHoop.y, this.GoalHoop.r, 0x222222).setStrokeStyle(12, 0x444444);

        // Hoop image on top of the hole
        this.hoopImg = this.add.image(this.GoalHoop.x, this.GoalHoop.y + 45, 'hoop').setDisplaySize(400, 400);

        // Slide the hoop back and forth
        this.tweens.add({
            targets: [this.hole, this.hoopImg, this.GoalHoop],
            x: { from: 240, to: 840 },
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // Turns + UI
        this.turnsLeft = 10;
        this.ui = this.add.text(140, 120, '', { fontSize: '48px', color: '#222' });
        this.scoreText = this.add.text(140, 180, '', { fontSize: '48px', color: '#222' });
        this.turnResult = this.add.text(540, 1100, 'Click where you want to shoot!', { fontSize: '48px', color: '#444', align: 'center', wordWrap: { width: 800 } }).setOrigin(0.5);
        this.updateUI();

        this.input.on('pointerdown', (p) => this.throwBalls(p));
    }

    updateUI() {
        this.ui.setText(`Turns: ${this.turnsLeft}   Balls: ${this.ballCount}`);
        this.scoreText.setText(`Score: ${this.score}`);
    }

    throwBalls(p) {
        if (this.throwing || this.turnsLeft <= 0) return;
        this.throwing = true;
        this.turnsLeft--;
        this.ballsThrown = this.ballCount;
        this.ballsMade = 0;
        this.finished = 0;
        this.turnResult.setText('');
        this.updateUI();

        for (let i = 0; i < this.ballsThrown; i++) {
            const b = this.add.image(this.start.x, this.start.y, 'ball').setDisplaySize(60, 60);
            // Aim at the click, with spray around it
            const tx = p.x + Phaser.Math.Between(-this.spread * 1.2, this.spread * 1.2);
            const ty = p.y + Phaser.Math.Between(-this.spread * 1.2, this.spread * 1.2);

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
            this.score++;
            this.updateUI();
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
        this.turnResult.setText(`${this.ballsMade} of ${this.ballsThrown} went in!`);

        if (this.ballCount === 0 || this.turnsLeft === 0) {
            const msg = this.ballCount ? 'Game over!' : 'Out of balls!';
            this.add.text(540, 800, `${msg}\nScore: ${this.score}\nClick to restart`, { fontSize: '64px', color: '#222', align: 'center', wordWrap: { width: 800 } }).setOrigin(0.5);
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