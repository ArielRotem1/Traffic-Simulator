var size, borderWidth, user, interval;
var grid, gridWidth, gridHeight;

var drawer = undefined;

class Road {
  constructor(row, column, dir) {
    this.row = row;
    this.column = column;
    this.dir = dir;
    this.cars = [];
    if(this.dir == 1 || this.dir == 2)
      this.acceptedNextRoadsDir = [this.dir, 3];
    else if(this.dir == 3)
      this.acceptedNextRoadsDir = [1, 2, this.dir];
  }
  
  changeDir(newDir){
    this.dir = newDir;
    
    if(this.dir == 1 || this.dir == 2)
      this.acceptedNextRoadsDir = [this.dir, 3];
    else if(this.dir == 3)
      this.acceptedNextRoadsDir = [1, 2, this.dir];
  }

  addCar(car){
    this.cars.push(car);
    
    if(this.dir == 1){
      if(car.speedX > 0){
        car.outFrom = 2;
      }
      else if(car.speedX < 0){
        car.outFrom = 4;
      }
    }
    else if(this.dir == 2){
      if(car.speedY > 0){
        car.outFrom = 3;
      }
      else if(car.speedY < 0){
        car.outFrom = 1;
      }
    }
    else if(this.dir == 3){
      //choose side to turn to
      if(car.speedX > 0){
        car.outFrom = 2;
      }
      else if(car.speedX < 0){
        car.outFrom = 4;
      }
      else if(car.speedY > 0){
        car.outFrom = 3;
      }
      else if(car.speedY < 0){
        car.outFrom = 1;
      }
    }
  }
  
  moveCars() {
    for (let i = this.cars.length - 1; i > -1; i--) {
      let car = this.cars[i];
      if(car.hasBeenMoved) continue;
      car.x += car.speedX;
      car.y += car.speedY;
      
      car.hasBeenMoved = true;

      if (car.outFrom == 2 && car.x >= size) {
        //move to the next road
        this.cars.splice(i, 1);

        let offset = car.x - size;

        car.x = offset;
        car.y = size;
        
        if (this.column + 1 < gridWidth && grid[this.row][this.column + 1] && 
           this.acceptedNextRoadsDir.includes(grid[this.row][this.column + 1].dir)) {
          // there is road to the right then move the car to there
          grid[this.row][this.column + 1].addCar(car);
        } else if (this.column + 1 == gridWidth && grid[this.row][0] && 
           this.acceptedNextRoadsDir.includes(grid[this.row][0].dir)) {
          //move in a circle
          grid[this.row][0].addCar(car);
        }
      }
      else if (car.outFrom == 4 && car.x + car.width <= borderWidth) {
        this.cars.splice(i, 1);

        let offset = car.x + car.width;

        car.x = (size - car.width) + offset;
        car.y = 0;

        if (this.column - 1 > -1 && grid[this.row][this.column - 1] && 
           this.acceptedNextRoadsDir.includes(grid[this.row][this.column - 1].dir)) {
          // there is road to the left then move the car to there
          grid[this.row][this.column - 1].addCar(car);
        } else if (this.column - 1 == -1 && grid[this.row][gridWidth - 1] && 
           this.acceptedNextRoadsDir.includes(grid[this.row][gridWidth - 1].dir)) {
          //move in a circle
          grid[this.row][gridWidth - 1].addCar(car);
        }
      } 
      if (car.outFrom == 3 && car.y >= size) {
        this.cars.splice(i, 1);

        let offset = car.y - size;

        car.x = 0;
        car.y = offset;

        if (this.row + 1 < gridHeight && grid[this.row + 1][this.column] && 
           this.acceptedNextRoadsDir.includes(grid[this.row + 1][this.column].dir)) {
          // there is road to the bottom then move the car to there
          grid[this.row + 1][this.column].addCar(car);
        } else if (this.row + 1 == gridHeight && grid[0][this.column] && 
           this.acceptedNextRoadsDir.includes(grid[0][this.column].dir)) {
          //move in a circle
          grid[0][this.column].addCar(car);
        }
      }
      else if (car.outFrom == 1 && car.y + car.height <= borderWidth) {
        this.cars.splice(i, 1);

        let offset = car.y + car.height;

        car.x = size;
        car.y = (size - car.height) + offset;

        if (this.row - 1 > -1 && grid[this.row - 1][this.column] && 
           this.acceptedNextRoadsDir.includes(grid[this.row - 1][this.column].dir)) {
          // there is road to the top then move the car to there
          grid[this.row - 1][this.column].addCar(car);
        } else if (this.row - 1 == -1 && grid[gridHeight - 1][this.column] && 
           this.acceptedNextRoadsDir.includes(grid[gridHeight - 1][this.column].dir)) {
          //move in a circle
          grid[gridHeight - 1][this.column].addCar(car);
        }
      }
    }
  }

  draw() {
    let startX = this.column * size + borderWidth;
    let startY = this.row * size + borderWidth;
    let width = size - borderWidth;
    let height = size - borderWidth;

    if (this.column == grid[0].length - 1) width -= borderWidth;
    if (this.row == grid.length - 1) height -= borderWidth;

    if(this.dir == 1) drawer.drawSquare(startX, startY, width, height, "black");
    else if(this.dir == 2) drawer.drawSquare(startX, startY, width, height, "rgb(136,92,92)");
    else if(this.dir == 3) drawer.drawSquare(startX, startY, width, height, "rgb(160,50,50)");
  }

  drawCars() {
    let startX = this.column * size + borderWidth;
    let startY = this.row * size + borderWidth;

    for (let car of this.cars) {
      car.hasBeenMoved = false;
      car.draw(startX, startY);
    }
  }
}

class Car {
  constructor(speedX, speedY, forceX, forceY, color) {
    this.width = 20;
    this.height = 10;
    
    //1 - top, 2 - right, 3 - bottom, 4 - left
    this.outFrom = -1;
    
    this.hasBeenMoved = false;

    if (speedX > 0) {
      this.x = borderWidth;
      this.y = size;
    } else if (speedX < 0) {
      this.x = size - this.width;
      this.y = 0;
    } else if (speedY > 0) {
      this.x = 0;
      this.y = borderWidth;
    } else if (speedY < 0) {
      this.x = size;
      this.y = size - this.height;
    }
    this.speedX = speedX;
    this.speedY = speedY;
    this.forceX = forceX;
    this.forceY = forceY;
    this.color = color;
  }

  draw(startX, startY) {
    if (this.speedX > 0) {
      drawer.drawSquare(
        startX + this.x,
        startY + this.y - (size / 5) - this.height,
        this.width,
        this.height,
        this.color
      );
    } else if (this.speedX < 0) {
      drawer.drawSquare(
        startX + this.x,
        startY + this.y + (size / 5) + borderWidth,
        this.width,
        this.height,
        this.color
      );
    } else if (this.speedY > 0) {
      drawer.drawSquare(
        startX + this.x + (size / 5) + borderWidth,
        startY + this.y,
        this.height,
        this.width,
        this.color
      );
    } else if (this.speedY < 0) {
      drawer.drawSquare(
        ((startX + this.x) - (size / 5)) - this.height,
        startY + this.y,
        this.height,
        this.width,
        this.color
      );
    }
  }
}

class User {
  constructor() {
    this.clear = false;
    this.road = false;
    this.car = false;
  }
}

class Drawer {
  setup(canvasID, sizeOfSquareRatio, lineWidth) {
    this.isMouseDown = false;
    this.mouseDownTileX = -1;
    this.mouseDownTileY = -1;

    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    let rect = this.canvas.getBoundingClientRect();
    this.xoffset = rect.left;
    this.yoffset = rect.top;

    size = sizeOfSquareRatio;
    borderWidth = lineWidth;

    grid = new Array(Math.floor(this.canvasHeight / size));

    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(Math.floor(this.canvasWidth / size)).fill(undefined);
    }

    gridWidth = grid[0].length;
    gridHeight = grid.length;

    this.canvas.addEventListener(
      "mousedown",
      function (evt) {
        drawer.isMouseDown = true;
        drawer.mouseDownTileX = -1;
        drawer.mouseDownTileY = -1;

        let mousePos = {
          x: evt.clientX,
          y: evt.clientY,
        };

        drawer.canvasHasBeenClicked(mousePos);
      },
      false
    );

    this.canvas.addEventListener(
      "mouseup",
      function (evt) {
        drawer.isMouseDown = false;
        drawer.mouseDownTileX = -1;
        drawer.mouseDownTileY = -1;
      },
      false
    );

    this.canvas.addEventListener(
      "mouseout",
      function (evt) {
        drawer.isMouseDown = false;
        drawer.mouseDownTileX = -1;
        drawer.mouseDownTileY = -1;
      },
      false
    );

    this.canvas.addEventListener(
      "mousemove",
      function (evt) {
        if (drawer.isMouseDown) {
          let mousePos = {
            x: evt.clientX,
            y: evt.clientY,
          };

          drawer.canvasHasBeenClicked(mousePos);
        }
      },
      false
    );
  }

  drawGrid() {
    this.ctx.lineWidth = borderWidth;

    this.ctx.fillStyle = "black";

    this.ctx.beginPath();
    for (let i = 0; i < this.canvasWidth; i += size) {
      this.ctx.fillRect(i, 0, borderWidth, this.canvasHeight);
    }
    this.ctx.fillRect(
      this.canvasWidth - borderWidth,
      0,
      borderWidth,
      this.canvasHeight
    );

    for (let i = 0; i < this.canvasHeight; i += size) {
      this.ctx.fillRect(0, i, this.canvasWidth, borderWidth);
    }
    this.ctx.fillRect(
      0,
      this.canvasHeight - borderWidth,
      this.canvasWidth,
      borderWidth
    );

    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawSquare(startX, startY, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(startX, startY, width, height);
  }

  canvasHasBeenClicked(mousePos) {
    var rowOfMouse = Math.floor((mousePos.y - this.yoffset) / size);
    var columnOfMouse = Math.floor((mousePos.x - this.xoffset) / size);

    if (
      this.mouseDownTileX == columnOfMouse &&
      this.mouseDownTileY == rowOfMouse
    )
      return; //already were here

    this.mouseDownTileX = columnOfMouse;
    this.mouseDownTileY = rowOfMouse;

    if (user.road) {
      if (!grid[rowOfMouse][columnOfMouse])
        grid[rowOfMouse][columnOfMouse] = new Road(
          rowOfMouse,
          columnOfMouse,
          1
        );
      else {
        if (grid[rowOfMouse][columnOfMouse].dir == 1) grid[rowOfMouse][columnOfMouse].changeDir(2);
        else if (grid[rowOfMouse][columnOfMouse].dir == 2) grid[rowOfMouse][columnOfMouse].changeDir(3);
        else if (grid[rowOfMouse][columnOfMouse].dir == 3) grid[rowOfMouse][columnOfMouse].changeDir(1);
      }
    }
    else if (user.clear) {
      grid[rowOfMouse][columnOfMouse] = undefined;
      let color = "AliceBlue";

      let startSquareX = columnOfMouse * size + borderWidth;
      let startSquareY = rowOfMouse * size + borderWidth;
      let width = size - borderWidth;
      let height = size - borderWidth;

      if (columnOfMouse == grid[0].length - 1) width -= borderWidth;
      if (rowOfMouse == grid.length - 1) height -= borderWidth;
      this.drawSquare(startSquareX, startSquareY, width, height, color);
    }
    else if (user.car) {
      if (!grid[rowOfMouse][columnOfMouse])
        grid[rowOfMouse][columnOfMouse] = new Road(
          rowOfMouse,
          columnOfMouse,
          1
        );

      let speed = 4//(size / 18) + (size / (Math.floor(Math.random() * 30) + 30));
      let rnd = Math.random();
      if (rnd < 0.5) speed *= -1;
      
      if(grid[rowOfMouse][columnOfMouse].dir == 1){
        grid[rowOfMouse][columnOfMouse].addCar(new Car(speed, 0, 0, 0, "green"));
      }
      else if(grid[rowOfMouse][columnOfMouse].dir == 2){
        grid[rowOfMouse][columnOfMouse].addCar(new Car(0, speed, 0, 0, "green"));
      }
    }
  }
}

window.onload = () => {
  document.body.style.backgroundColor = "AliceBlue";
  document.getElementById("nav").style.backgroundColor = "Bisque";

  drawer = new Drawer();

  drawer.setup("canvas", 50, 0);
  drawer.drawGrid();

  start();
};

function start() {
  user = new User();

  setNavButtonsClick();

  interval = setInterval(game, 50);
}

function game() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) {
        grid[i][j].moveCars();
        grid[i][j].draw();
      }
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j]) {
        grid[i][j].drawCars();
      }
    }
  }
}

function setNavButtonsClick() {
  let nav_button_road = document.getElementById("nav_button_road");
  let nav_button_car = document.getElementById("nav_button_car");
  let nav_button_clear = document.getElementById("nav_button_clear");

  nav_button_road.addEventListener(
    "click",
    function (evt) {
      if (!user.road) {
        user.road = true;
        user.clear = false;
        user.car = false;
        nav_button_car.style.backgroundColor = "#EFEFEF";
        nav_button_clear.style.backgroundColor = "#EFEFEF";
        this.style.backgroundColor = "rgb(65,228,65)";
      } else {
        user.road = false;
        this.style.backgroundColor = "#EFEFEF";
      }
    },
    false
  );

  nav_button_car.addEventListener(
    "click",
    function (evt) {
      if (!user.car) {
        user.road = false;
        user.clear = false;
        user.car = true;
        nav_button_road.style.backgroundColor = "#EFEFEF";
        nav_button_clear.style.backgroundColor = "#EFEFEF";
        this.style.backgroundColor = "rgb(65,228,65)";
      } else {
        user.car = false;
        this.style.backgroundColor = "#EFEFEF";
      }
    },
    false
  );

  nav_button_clear.addEventListener(
    "click",
    function (evt) {
      if (!user.clear) {
        user.road = false;
        user.clear = true;
        user.car = false;
        nav_button_road.style.backgroundColor = "#EFEFEF";
        nav_button_car.style.backgroundColor = "#EFEFEF";
        this.style.backgroundColor = "rgb(65,228,65)";
      } else {
        user.clear = false;
        this.style.backgroundColor = "#EFEFEF";
      }
    },
    false
  );
}
