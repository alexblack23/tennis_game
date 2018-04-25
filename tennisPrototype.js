let level = 0;
function Tennis(brickRowCount,brickColumnCount,) {
    let canvas = document.getElementById('canvasGame');
    this.context = canvas.getContext('2d');
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.bottomBlockWidth = 80;
    this.bottomBlockHeight = 10;
    this.bottomBlockX = this.canvasWidth/2-this.bottomBlockWidth/2;
    this.bottomBlockY=this.canvasHeight-this.bottomBlockHeight;
    this.brickWidth = 75;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    this.brickRowCount = brickRowCount;
    this.brickColumnCount = brickColumnCount;
    this.ballX = this.canvasWidth/2;
    this.ballY = this.canvasHeight - this.bottomBlockHeight;
    this.ballRad = 10;
    this.marginBrickRight = 10;
    this.marginBrickLeft =20;
    this.speedBallX = 1;
    this.speedBallY = -3;
    this.rightMove = false; // переменны хранят информацию о нажатии левой или правой кнопки , то что мы их не используем
    this.leftMove = false;
    this.score = 0;
    this.lives = 3;
}
Tennis.prototype.createMatrix = function () {
    this.bricks = [];
    for(c=0; c<this.brickColumnCount; c++) {
        this.bricks[c] = [];
        for(r=0; r<this.brickRowCount; r++) {
            this.bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
};

// Tennis.prototype.resetGame = function () {
//     this.
// };


// условия задания клавиш передвижения блока

// функцыии  условий для задания событий движения блока
Tennis.prototype.keyDownHandler = function (key) { // функция которая при зажатии определенных клавиш (кейкод которых мы прописали) будет выполнять действие которое мы зададим
    if(key.keyCode == 39 || key.keyCode == 68) { // keyCode это свойство события keyPress
        this.rightMove = true;
    }
    else if(key.keyCode == 37 || key.keyCode == 65) {
        this.leftMove = true;
    }
}
Tennis.prototype.keyUpHandler = function(key) { // функция которая при отжатии тех же клавиш прекращает действие тех же клавиш
    if(key.keyCode == 39 || key.keyCode == 68) {
        this.rightMove = false;
    }
    else if(key.keyCode == 37 || key.keyCode == 65) {
        this.leftMove = false;
    }
};


Tennis.prototype.buildBricks = function () { // функция отрисовки блоков
    for (let c=0; c< this.brickColumnCount;c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
            if (this.bricks[c][r].status == 1) {
                let brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                let brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                this.bricks[c][r].x = brickX;
                this.bricks[c][r].y = brickY;
                this.rectangle(brickX, brickY, 'green', this.brickWidth, this.brickHeight);
            }
        }
    }
};

Tennis.prototype.collisionDetection = function () {    // функция определения блоков
    for(c=0; c<this.brickColumnCount; c++) {
        for(r=0; r<this.brickRowCount; r++) {
            let b = this.bricks[c][r];
            if(b.status === 1) {
                if(this.ballX + this.ballRad > b.x && this.ballX-this.ballRad < b.x+this.brickWidth && this.ballY+this.ballRad > b.y && this.ballY - this.ballRad < b.y+this.brickHeight) {
                    this.speedBallY = -this.speedBallY;
                    b.status = 0;
                    this.score++;

                }
            }
        }
    }
};


Tennis.prototype.drawScore = function () {
    this.context.font = "16px Arial";
    this.context.fillStyle = "red";
    this.context.fillText(`you did ${this.score} points`, 8, 20);
};
Tennis.prototype.drawLives = function () {
    this.context.font= '16px ArialBlack';
    this.context.fillStyle = 'green';
    this.context.fillText(`you stil have ${this.lives} lives`, 140,20);
};

Tennis.prototype.writeString = function (font,color, text,x,y) {
    this.context.font= font;
    this.context.fillStyle = color;
    this.context.fillText(text, x,y);
};

Tennis.prototype.ballDraw= function (x,y,color,radius) { // рисует шар
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.arc(x,y,this.ballRad,0,2*Math.PI, true);
    this.context.fill();
    this.context.closePath();
};
Tennis.prototype.rectangle = function (x,y,color,width, height) {// рисует платформу
    this.context.fillStyle=color;
    this.context.fillRect(x,y,width,height);
};

Tennis.prototype.moveBall = function () { // создает смещение нашего шарика
    this.ballX+=this.speedBallX;// задаем шаг смещения шара в момент интервала
    this.ballY-=this.speedBallY;


    // условие отскакивания от стен
    if (this.ballX > this.canvasWidth-this.ballRad || this.ballX < this.ballRad) {
        this.speedBallX=-this.speedBallX
    }
    if (this.ballY  < this.ballRad) {
        this.speedBallY=-this.speedBallY
    } else  if (this.ballY> this.canvasHeight-this.ballRad) {
        if (this.ballY> this.canvasHeight-this.bottomBlockHeight && this.ballX > this.bottomBlockX && this.ballX  <this.bottomBlockX + this.bottomBlockWidth) {
            this.speedBallY=-this.speedBallY;
            this.deltaX = this.ballX-(this.bottomBlockX+this.bottomBlockWidth/2);
            console.log(this.ballX);
            console.log(this.bottomBlockX);
            console.log(this.deltaX);
            if (this.deltaX > 20 || this.deltaX< (-20)) {
                this.speedBallX = this.deltaX*0.1
            } else {this.speedBallX  = this.deltaX*0.2;}
            console.log(this.speedBallX);
        }
        else {
            this.lives--;
            if (!this.lives){
                alert('looser');
                document.location.reload();
            } else {
                this.ballX = this.canvasWidth/2;
                this.ballY = this.canvasHeight-30;
                this.speedBallX = 2;
                this.speedBallY = 2;
                this.bottomBlockX = (this.canvasWidth-this.bottomBlockWidth)/2;

            }
        }
    }
    // условие передвижения нашего блока
    if (this.rightMove && this.bottomBlockX < this.canvasWidth - this.bottomBlockWidth ) {
        this.bottomBlockX+=5;
    }
    else if (this.leftMove && this.bottomBlockX > 0) {
        this.bottomBlockX -=5;
    }
};
Tennis.prototype.drawGame = function () { // отрисовует все элементы игры после каждого движения шарика
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // очищает след после шарика, также очищает и весь канвас
    this.buildBricks();
    this.collisionDetection();
    this.drawScore();
    this.drawLives();
    // this.buildBricks();
    this.ballDraw(this.ballX,this.ballY,'red',this.ballRad);
    this.rectangle(this.bottomBlockX,this.bottomBlockY,'blue',this.bottomBlockWidth,this.bottomBlockHeight);
};

Tennis.prototype.startBallSpeed = function () { // задаем скорость смещения
    this.createMatrix();
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false); // блокировка всех клавиш кроме заданых
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);

    let timer = setInterval( () => {
        this.drawGame(); //вызываем функцию и рисуем всю графику после каждого движения мяча, так как происходит очистка всего канваса для удаления следа шара
        this.moveBall(); // вызываем функцию и рисуем движени мяча
        this.collisionDetection();
        // this.changeLevel();
        if (this.score === this.brickColumnCount*this.brickRowCount) {
            level++;
            console.log('test');
            clearInterval(timer);
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // очищает след после шарика, также очищает и весь канвас
            this.writeString('16px Arial','red',`you won`,200,150);
            this.writeString('16px Arial','black', 'click on screen for next lvl',160, 180)

        }
    },10);
};
let but = document.querySelector('#canvasGame').addEventListener('click',function (event) {
    if (level ===1) {
        let game1 = new Tennis(4,5);
        game1.startBallSpeed();
    }
    if (level ===2) {
        let game1 = new Tennis(5,5);
        game1.startBallSpeed();
    }
});

    let game1 = new Tennis(3,5);
    game1.startBallSpeed();






