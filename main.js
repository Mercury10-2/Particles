const elements = [];
const explosions = [];
let maxSpeed = 3, radius, value;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    const numberOfElements = Math.floor(window.innerWidth / 10);
    for (let i = 0; i < numberOfElements; i++)
        elements.push(new Element());
}

function draw() {
    background(22, 22, 22);
    elements.forEach((el, index) => {
        el.drawElement();
        el.movement();
        el.edges(elements.slice(index));
    });
    explosions.forEach((expl, index) => {
        expl.drawExplosion();
        if (expl.mass > 60)
            explosions.splice(index);
    });
}

class Element {
    constructor() {
        this.resetElement();
    }

    resetElement() {
        this.x = random(width);
        this.y = random(height);
        this.speedX = random(-2, 2);
        this.speedY = random(-2, 2);
        this.mass = 1;
        this.futureMass = 1;
    }

    drawElement() {
        noStroke();
        fill('rgba(90,90,90,1)');
        circle(this.x, this.y, this.mass);
    }

    movement() {
        this.speedX += random(-1, 1);
        this.speedY += random(-1, 1);
        if (Math.abs(this.speedX) > maxSpeed) {
            value = (Math.abs(this.speedX) - maxSpeed) / 5;
            this.speedX = this.speedX > 0 ? this.speedX - value : this.speedX + value;
        }
        if (Math.abs(this.speedY) > maxSpeed) {
            value = (Math.abs(this.speedY) - maxSpeed) / 5;
            this.speedY = this.speedY > 0 ? this.speedY - value : this.speedY + value;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.borders();
    }

    borders() {
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
            this.resetElement();
    }

    edges(set) {
        this.mass = this.futureMass;
        this.futureMass = 1;
        radius = this.mass * 30;
        set.forEach(el => {
            value = Math.hypot(this.x - el.x, this.y - el.y);
            if (value < radius) {
                this.mass++;
                el.futureMass++;
                stroke('rgba(125,125,125,0.1)');
                line(this.x, this.y, el.x, el.y);
            }

        });
        if (this.mass > 20) {
            value = Math.floor(Math.random() * 10);
            if (value == 6) {
                explosions.push(new Explosion(this.x, this.y, this.mass))
                this.resetElement();
            }
        }
    }
}

class Explosion {
    constructor(x, y, mass) {
        this.x = x;
        this.y = y;
        this.mass = mass;
    }

    drawExplosion() {
        noStroke();
        fill('rgba(255,255,255, 1)');
        circle(this.x, this.y, this.mass * 2);
        this.mass += 120;
        this.blastWave();
    }

    blastWave() {
        radius = this.mass;
        elements.forEach(el => {
            value = Math.hypot(this.x - el.x, this.y - el.y);
            if (value < radius) {
                value = radius / value;
                el.speedX = (el.x - this.x) / (10 / value);
                el.speedY = (el.y - this.y) / (10 / value);
            }
        });
    }
}

function mouseClicked() {
    elements.forEach(el => {
        value = Math.hypot(mouseX - el.x, mouseY - el.y);
        if (value < 200) {
            value = 200 / value;
            el.speedX = (el.x - mouseX) / (20 / value);
            el.speedY = (el.y - mouseY) / (20 / value);
        }
    });
}
