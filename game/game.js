// const canvas = document.getElementById("memoryGameCanvas");
// const ctx = canvas.getContext("2d");

// Update game logic (move elements, check collisions)
// function update() {

// }

// // Clear canvas and draw all elements
// function draw() {

// }

// function gameLoop() {
//     update();
//     draw();
//     requestAnimationFrame(gameLoop)
// }

// requestAnimationFrame(gameLoop);

const numRows = 3;
const numCols = 5;

var myGamePiece;

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this. canvas. height);
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    gameArea.clear();
    myGamePiece.update();
}

function startGame() {
    gameArea.start();
    myGamePiece = new component(30, 30, "red", 10, 120);
}

startGame();
