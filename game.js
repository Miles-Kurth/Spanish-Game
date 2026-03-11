import Color from "https://colorjs.io/dist/color.js";

const canvasWidth = 1280 + 10;
const canvasHeight = 570 + 10;
      
const numRows = 3; //Vertical (down)
const numCols = 8; //Horizontal (across)

const cardWidth = ((canvasWidth - 10) - (numCols * 10)) / numCols;
const cardHeight = ((canvasHeight - 10) - (numRows * 10)) / numRows;
      
let cardArray = [];

let wordsArray = [
    ["1" , "one"   , 0],
    ["2" , "two"   , 0],
    ["3" , "three" , 0],
    ["4" , "four"  , 0],
    ["5" , "five"  , 0],
    ["6" , "six"   , 0],
    ["7" , "seven" , 0],
    ['8' , "eight" , 0],
    ["9" , "nine"  , 0],
    ["10", "ten"   , 0],
    ["11", "eleven", 0],
    ["12", "twelve", 0]
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

let selectedCards = [];



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
        this.mouseOverCard = false;
        this.isSelected = false;
        this.isHidden = false;

        this.cardIndex = cardIndex;
        this.element = document.createElement("canvas");
        this.element.id = this.cardIndex;
        console.log(this.element.id);

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
        this.update = function() {
            //Color
            this.hue = ( (this.hue) % 360 ) - 0.25 - globalHueChange;
            this.color = new Color("oklch", [this.lightness, this.chroma, this.hue]);

            //Draw card
            ctx = gameArea.context;
            ctx.fillStyle = this.color;

            if (!this.isHidden){ //if visible
                this.lightness = 0.8;
                this.chroma = 0.09;

                if (!this.isSelected){ //not selected
                    ctx.beginPath();
                    ctx.roundRect(this.x, this.y, this.cardWidth, this.cardHeight, 15);
                    ctx.fill();  
                }
                else { //selected
                    this.lightness = 0.72;
                    this.chroma = 0.121;
                    ctx.beginPath();
                    ctx.roundRect(this.x + 2, this.y + 2, this.cardWidth - 4, this.cardHeight - 4, 15);
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "black";
                    ctx.stroke();
                }
                
                if (this.mouseOverCard && !this.isSelected) {
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "white";
                    ctx.stroke();
                }
            }
            if (this.isHidden){
                this.lightness = 0.97;
                this.chroma = 0.01;
                ctx.beginPath();
                ctx.roundRect(this.x, this.y, this.cardWidth, this.cardHeight, 15);
                ctx.fill(); 
            }
            
            

            
            

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

        this.getWordIndex = function() { return (this.wordIndex); }
        this.getWordType = function() { return (this.wordType); }

        this.containsPoint = function(px, py) {
            const r = 15; // same radius you use in roundRect
            const x = this.x;
            const y = this.y;
            const w = this.cardWidth;
            const h = this.cardHeight;

            // First: quick reject (outside bounding box)
            if (px < x || px > x + w || py < y || py > y + h) {
                return false;
            }

            // Check central rectangle (no corner areas)
            if (
                (px >= x + r && px <= x + w - r) ||
                (py >= y + r && py <= y + h - r)
            ) {
                return true;
            }

            // Check the four corner circles
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
        }

        this.setHoverState = function(b) {
            this.mouseOverCard = b;
            // console.log("Card: ", this.word);
        }

        this.handleClick = function() {
            console.log("Card clicked: ", this.word);
            this.isSelected = !this.isSelected;

            if (this.isSelected){ //should be there
                selectedCards.push(this.element); //add
            }
            else if (!this.isSelected){ //should not be there
                for (let i = 0; i < selectedCards.length; i++){
                    if (selectedCards[i] === this.element){
                        selectedCards.splice(i, 1); //remove
                    }
                }
            }
            return;


            if (this.checkSelected()){
                for (let i = 0; i < selectedCards.length; i++){
                    if (selectedCards[i] === this.element){
                        selectedCards.splice(i, 1);
                    }
                }
            }
            else if (!this.checkSelected()){
                selectedCards.push(this.element);
            }
            
        }
        this.checkSelected = function() {
            for (let i = 0; i < selectedCards.length; i++) {
                if (selectedCards[i] === this.element){
                    return true;
                }
            }
            return false;
        }
        
        this.hideCard = function() {
            this.isHidden = true;
            this.isSelected = false;
            this.lightness = 0.97;
            this.chroma = 0.01;
        }
    
    
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
                    console.log(selectedCards.length);

                    if (selectedCards.length >= 2){
                        if (checkCards()){
                            for (let i = 0; i < 2; i++){
                                let cardObj = selectedCards[i];
                                cardObj.hideCard();
                            }

                            console.log(selectedCards[0].isHidden);
                            console.log(selectedCards[1].isHidden);
                            console.log("cards hidden");
                        }
                        selectedCards.length = 0;
                    }

                    return; // stop after first hit
                }
            }
        }
    });
    gameArea.canvas.addEventListener("mousemove", function(e) {
        const rect = gameArea.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let foundHover = false;

        for (let r = 0; r < cardArray.length; r++){
            for (let c = 0; c < cardArray[r].length; c++){
                let card = cardArray[r][c];

                if (!foundHover && card.containsPoint(mouseX, mouseY)) {
                    card.setHoverState(true);
                    foundHover = true; // only first card gets hover
                } else {
                    card.setHoverState(false);
                }
            }
        }
    });

}

function checkCards() {
    if (selectedCards[0].wordIndex === selectedCards[1].wordIndex){
        return true;
    }
    return false;
}

startGame();





/*TO-DO
- Make the cards hide when correctly paired
- Issue may be "selectedCards[0].isHidden = true"
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