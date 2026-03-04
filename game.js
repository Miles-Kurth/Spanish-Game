import Color from "https://colorjs.io/dist/color.js";

const canvasWidth = 1280 + 10;
const canvasHeight = 570 + 10;
      
const numRows = 3; //Vertical (down)
const numCols = 8; //Horizontal (across)

const cardWidth = ((canvasWidth - 10) - (numCols * 10)) / numCols;
const cardHeight = ((canvasHeight - 10) - (numRows * 10)) / numRows;
      
let cardArray = [];

let wordsArray = [
    [1 , "one"   , 0],
    [2 , "two"   , 0],
    [3 , "three" , 0],
    [4 , "four"  , 0],
    [5 , "five"  , 0],
    [6 , "six"   , 0],
    [7 , "seven" , 0],
    [8 , "eight" , 0],
    [9 , "nine"  , 0],
    [10, "ten"   , 0],
    [11, "eleven", 0],
    [12, "twelve", 0]
];
let wordsArrayAssignments = [
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0],
                             [0,0]
                            ];
for (let i = 0; i < wordsArray.length; i++){
    wordsArrayAssignments[i][0] = wordsArray[i][0];
    wordsArrayAssignments[i][1] = wordsArray[i][1];
}


// let wordsArrayAssignments = [
//     [1 , "one"   ],
//     [2 , "two"   ],
//     [3 , "three" ],
//     [4 , "four"  ],
//     [5 , "five"  ],
//     [6 , "six"   ],
//     [7 , "seven" ],
//     [8 , "eight" ],
//     [9 , "nine"  ],
//     [10, "ten"   ],
//     [11, "eleven"],
//     [12, "twelve"]
// ];



var startingHue = Math.floor(Math.random() * 360) + 1;
var ctx;

let globalHueChange = 0;
let time = 0;

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        // canvas.addEventListener('click', function(){
        //     console.log("canvas was clicked");
        // });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this. canvas. height);
    }
}

class Card {
    constructor(width, height, hue, x, y, cardIndex, row, column) {
        //Card
        this.cardIndex = cardIndex;
        let mouseOverCard = false;
        this.element = document.createElement("canvas");
        this.element.id = this.cardIndex;
        console.log(this.element.id);
        // document.body.appendChild(this.element);

        // this.element.addEventListener("mouseenter", function() {
        //     mouseOverCard = true;
        //     console.log(this.cardIndex + " on");
        // });
        // this.element.addEventListener("mouseleave", function() {
        //     mouseOverCard = false;
        // });

        //Size
        this.cardWidth = width;
        this.cardHeight = height;
        this.x = x;
        this.y = y;
        this.row = row;
        this.col = column;

        //Color
        this.lightness = 0.8;
        this.chroma = 0.09;
        this.hue = (hue + (10 * (this.row + this.col)) ) % 360;
        this.color = new Color("oklch", [this.lightness, this.chroma, this.hue]);
        
        //Word
        this.wordIndex = Math.floor(Math.random() * 12);
        this.wordType = Math.floor(Math.random() * 2);
        while (wordsArrayAssignments[this.wordIndex][this.wordType] == -1){
            this.wordIndex = Math.floor(Math.random() * 12);
            this.wordType = Math.floor(Math.random() * 2);
        }
        wordsArrayAssignments[this.wordIndex][this.wordType] = -1;
        this.word = "" + wordsArray[this.wordIndex][this.wordType];
        this.wordLength = this.word.length;
        

        //Called every frame
        this.update = function(){
            //Color
            this.hue = ( (this.hue) % 360 ) - 0.25 - globalHueChange;
            this.color = new Color("oklch", [this.lightness, this.chroma, this.hue]);

            //Draw card
            ctx = gameArea.context;
            this.element.style.borderStyle = "solid";
            this.element.style.borderColor = "black";
            if (mouseOverCard == true) {
                this.element.style.borderWidth = "5px";
            }
            else {
                this.element.style.borderWidth = "0px";
            }

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.cardWidth, this.cardHeight, 15);
            ctx.fill();            
            
            //Text setup
            this.textMetrics = ctx.measureText(this.word);
            this.textHeight = this.textMetrics.actualBoundingBoxAscent + this.textMetrics.actualBoundingBoxDescent;
            this.textWidth = this.textMetrics.height;

            //Draw text
            ctx.textAlign = "center";
            ctx.fillStyle = "#000000";
            ctx.font = "20px monospace";
            ctx.fillText(this.word, this.x + this.cardWidth/2, this.y + this.cardHeight/2 + this.textHeight/2);
        }
        this.handleClick = function() {
            this.mouseOverCard = !this.mouseOverCard;
            console.log("Card clicked: ", this.word);
        }

        this.containsPoint = function(px, py) {
            const r = 15; // same radius you use in roundRect
            const x = this.x;
            const y = this.y;
            const w = this.cardWidth;
            const h = this.cardHeight;

            // 1️⃣ First: quick reject (outside bounding box)
            if (px < x || px > x + w || py < y || py > y + h) {
                return false;
            }

            // 2️⃣ Check central rectangle (no corner areas)
            if (
                (px >= x + r && px <= x + w - r) ||
                (py >= y + r && py <= y + h - r)
            ) {
                return true;
            }

            // 3️⃣ Check the four corner circles
            const corners = [
                { cx: x + r,     cy: y + r },         // top-left
                { cx: x + w - r, cy: y + r },         // top-right
                { cx: x + r,     cy: y + h - r },     // bottom-left
                { cx: x + w - r, cy: y + h - r }      // bottom-right
            ];

            for (let corner of corners) {
                const dx = px - corner.cx;
                const dy = py - corner.cy;
                if (dx * dx + dy * dy <= r * r) {
                    return true;
                }
            }

            return false;
        };
    
    
    }
}

function updateGameArea() {
    gameArea.clear();
    for (let r = 0; r < cardArray.length; r++){
        for (let c = 0; c < cardArray[r].length; c++){
            cardArray[r][c].update();
        }
    }
    updateGlobalHue();

    //Check mouse over cards
    const rect = gameArea.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let running = true;
    for (let r = 0; r < cardArray.length; r++){
        for (let c = 0; c < cardArray[r].length; c++){
            let card = cardArray[r][c];

            if (card.containsPoint(mouseX, mouseY)) {
                card.mouseOverCard = true;
                running = false;
                break;
            }
            else {
                card.mouseOverCard = false;
            }
        }
        if (!running){break;}
    }

}

function updateGlobalHue() {
    globalHueChange = 1/(Math.cosh(time - 10)) * 1;
    time = (time + 0.01) % 20;
}

function startGame() {
    gameArea.start();
    let targetX = 10;
    let targetY = 10;
    
    let count = 0;
    for (let r = 0; r < numRows; r++){
      targetX = 10;
      let arrayRow = [];
      for (let c = 0; c < numCols; c++){
        arrayRow.push( new Card(cardWidth, cardHeight, startingHue, targetX, targetY, count, r, c) );
        //startingHue = ( (startingHue + 5) % 360 ) + 1;
        targetX += cardWidth + 10;
        count++;
      }
      cardArray.push(arrayRow);
      targetY += cardHeight + 10;
    }

    //Event listeners
    gameArea.canvas.addEventListener("click", function(e) {
        const rect = gameArea.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (let r = 0; r < cardArray.length; r++){
            for (let c = 0; c < cardArray[r].length; c++){
                let card = cardArray[r][c];

                if (card.containsPoint(mouseX, mouseY)) {
                    card.handleClick();
                    return; // stop after first hit
                }
            }
        }
    });
    

}

startGame();





/*TO-DO
- Detect mouse over, highlight card
- Detect click
*/




// function getRandomOkLCHColor() {
//   const l = Math.random() * 1;
//   const c = Math.random() * 0.09;
//   const h = (Math.random() * 360) + 1; 
  
//   return new Color("oklch", [l, c, h]);
// }

/*
function startGame() {
    gameArea.start();
    let targetX = 10;
    let targetY = 10;
    
    let count = 0;
    for (let r = 0; r < numRows; r++){
      targetX = 10;
      for (let c = 0; c < numCols; c++){
        cardArray[r][c] = new Card(cardWidth, cardHeight, startingHue, targetX, targetY, count);
        //cardArray.push( new Card(cardWidth, cardHeight, startingHue, targetX, targetY, count) );
        //startingHue = ( (startingHue + 5) % 360 ) + 1;
        targetX += cardWidth + 10;
        count++;
      }
      targetY += cardHeight + 10;
    }
}
*/