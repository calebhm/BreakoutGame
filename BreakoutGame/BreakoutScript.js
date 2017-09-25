/*jslint browser: true*/
/*global $, jQuery*/
/*jslint plusplus: true */

$(document).ready(function () {
       
    var canvas = document.getElementById("myCanvas"),
        ctx = canvas.getContext("2d"),
        ballRadius = 8,
        x = canvas.width / 2,
        y = canvas.height - 30,
        dx = 3,
        dy = -3,
        ballSpeed = 1.0,
        newSpeed = 0,
        paddleHeight = 10,
        paddleWidth = 75,
        paddleX = (canvas.width - paddleWidth) / 2,
        rightPressed = false,
        leftPressed = false,
        brickRowCount = 4,
        brickColumnCount = 6,
        brickWidth = 62,
        brickHeight = 20,
        brickPadding = 10,
        brickOffsetTop = 30,
        brickOffsetLeft = 30,
        bricks = [],
        c = 0,
        r = 0,
        score = 0,
        lives = 3,
        colorChange = Math.floor(1 + Math.random() * 6);

    for (c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    
    function keyDownHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = true;
        } else if (e.keyCode === 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode === 39) {
            rightPressed = false;
        } else if (e.keyCode === 37) {
            leftPressed = false;
        }
    }
    
    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }
    
    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        ballSpeed += 0.022;
                        if (score < 8) {
                            dy = -dy * ballSpeed;
                            dx *= ballSpeed;
                            newSpeed = Math.abs(dx);
                        } else {
                            dy = -dy;
                        }
                        b.status = 0;
                        score++;
                        colorChange = Math.floor(1 + Math.random() * 6);
                        if (score === brickRowCount * brickColumnCount) {
                            score += lives * 12;
                            alert("YOU WON! SCORE: " + );
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
    
    function drawScore() {
        ctx.font = "16px Helvetica";
        ctx.fillStyle = "#FF0";
        ctx.fillText("Score: " + score, 8, 20);
    }
    
    function drawLives() {
        ctx.font = "16px Helvetica";
        ctx.fillStyle = "#FF0";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }
    
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        
        switch (colorChange) {
        case 1:
            ctx.fillStyle = "#DB0000";
            break;
        case 2:
            ctx.fillStyle = "#DB6400";
            break;
        case 3:
            ctx.fillStyle = "#DBDB00";
            break;
        case 4:
            ctx.fillStyle = "#00DB37";
            break;
        case 5:
            ctx.fillStyle = "#0095DB";
            break;
        case 6:
            ctx.fillStyle = "#DB00DB";
            break;
        }
        
        ctx.fill();
        ctx.closePath();
    }
    
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#EEE";
        ctx.fill();
        ctx.closePath();
    }
    
    function drawBricks() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft,
                        brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#EEE";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();
        
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
            colorChange = Math.floor(1 + Math.random() * 6);
        }
        
        if (y + dy < ballRadius) {
            dy = -dy;
            colorChange = Math.floor(1 + Math.random() * 6);
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                colorChange = Math.floor(1 + Math.random() * 6);
            } else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    if (score > 0) {
                        dx = newSpeed;
                        dy = -newSpeed;
                    } else {
                        dx = 3 * ballSpeed;
                        dy = -3 * ballSpeed;
                    }
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
        
        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }

    draw();

});