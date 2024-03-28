let width = prompt('Enter your width')
let height = prompt('Enter your height')

width = parseInt(width)
height = parseInt(height)

function setup() {
    createCanvas(width, height)
    Game.addCommonBallon();
}


function draw() {
    background('#FFD700')
    textSize(32)
    fill('#142300')
    text(Game.score, 20, 40)

    for (let ballons of Game.ballons) {
        ballons.draw()
        ballons.move(Game.score)

        if(ballons.y <= ballons.size / 2 && ballons.color != '#800000' && ballons.color != '#FFC618'){
            noLoop()
            clearInterval(interval)
            Game.ballons.splice(0)
            background('#30BA8F')
            let finalScore = Game.score
            Game.score = ' '
            fill('#F5E6CB')
            textAlign(CENTER, CENTER)
            textSize(60)
            text('Finish', height / 2,width / 2 )
            textSize(40)
            text('Score: ' + finalScore, width / 2, height / 2 + 100)
        }
    }

    if (frameCount % 50 == 0){
        Game.addCommonBallon()
    }

    if (frameCount % 100 == 0){
        Game.addUniqueBallon()
    }

    if (frameCount % 120 == 0){
        Game.addAngryBallon()
    }

    if(frameCount % 300 == 0){
        Game.addVeryBallon()
    }
}

function sendStats() {
    let stats = {
        score: Game.score,
        countOfCommonBallon: Game.countOfCommonBallon,
        countOfUniqueBallon: Game.countOfUniqueBallon,
        countOfAngryBallon: Game.countOfAngryBallon,
        countOfAngryBallon: Game.countOfAngryBallon,
        countOfClick: Game.countOfClick,
    }

    fetch("/stats", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
    });
}

let interval = setTimeout(() =>  {
    sendStats()
}, 5000)


function mousePressed(){
    if(!isLooping()){
        loop()
        Game.score = 0
        setTimeout(() =>  {
            sendStats()
        }, 5000)
    }
    Game.CheckIfBallonburst()
    Game.countOfClick +=1
}

class Game{
    static ballons = []
    static score = 0
    static countOfCommonBallon = 0;
    static countOfAngryBallon = 0;
    static countOfUniqueBallon = 0;
    static countOfClick = 0;

    static addCommonBallon(){
        let ballons = new CommonBallon(50, '#1843FF')   
        this.ballons.push(ballons) 
    }

    static addUniqueBallon(){
        let ballons = new UniqueBallon(20, '#008000')   
        this.ballons.push(ballons) 
    }

    static addAngryBallon(){
        let ballons = new AngryBallons(50, '#800000')   
        this.ballons.push(ballons)
    }

    static addVeryBallon(){
        let ballons = new VeryBallons(10, '#FFC618')   
        this.ballons.push(ballons)
    }
    

    static CheckIfBallonburst() {
        Game.ballons.forEach((ballon, index) => {
            let distance = dist(ballon.x, ballon.y, mouseX, mouseY)
            if(distance <= ballon.size / 2){
                ballon.burst(index)
            }
        })
    }
}



class CommonBallon{
    constructor(size,color){
        this.x = random(width)
        this.y = random(height - 50, height + 10)
        this.size = size
        this.color = color
    }

    draw() {
        fill(this.color)
        ellipse(this.x, this.y, this.size)
        line(this.x, this.y + this.size / 2, this.x, this.y + this.size * 2);
    }

    move() {
        if (Game.score < 100){
            this.y -= 1;  
        } else if (Game.score >= 100 && Game.score <= 200) {
            this.y -= 1.5; 
        } else if(Game.score >= 200 && Game.score <= 300){
            this.y -= 2;
        } else{
            this.y -= 2.5
        }
    }

    burst(index) {
        Game.ballons.splice(index, 1);
        let points = 1; 
        Game.score += points;
        text(points, this.x, this.y); 
        Game.countOfCommonBallon +=1
    }
}

class UniqueBallon extends CommonBallon{
    constructor(size, color){
        super(size, color)
    }
    burst(index) {
        Game.ballons.splice(index, 1);
        let points = 10; 
        Game.score += points;
        text(points, this.x, this.y);
        Game.countOfUniqueBallon +=1
    }

    move() {
        if (Game.score < 100){
            this.y -= 1.5;  
        } else if (Game.score >= 100 && Game.score <= 200) {
            this.y -= 2; 
        } else{
            this.y -= 2.5;
        }
    }
}

class AngryBallons extends CommonBallon{
    constructor(size, color){
        super(size, color);
    }
    burst(index) {
        Game.ballons.splice(index, 1);
        let points = -5; 
        Game.score += points;
        text(points, this.x, this.y);
        Game.countOfAngryBallon +=1
    }
}

class VeryBallons extends CommonBallon{
    constructor(size, color){
        super(size, color);
    }
    burst(index) {
        Game.ballons.splice(index, 1);
        let points = 100; 
        Game.score += points;
        text(points, this.x, this.y);
    }

    move() {
        if (Game.score < 100){
            this.y -= 3;  
        } else if (Game.score >= 100 && Game.score <= 200) {
            this.y -= 3.5; 
        } else{
            this.y -= 4;
        }
    }
}


