var size, borderWidth, user, interval;
var grid, gridWidth, gridHeight;
var drawer = undefined;

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
  clearCanvas();
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

function clearCanvas(){
  drawer.drawSquare(0, 0, drawer.canvasWidth, drawer.canvasHeight, "AliceBlue");
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
  
  drawCircle(x, y, radius, color){
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
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

    //add road
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
    //clear road and cars in this road
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
    //add car
    else if (user.car) {
      if (!grid[rowOfMouse][columnOfMouse])
        grid[rowOfMouse][columnOfMouse] = new Road(
          rowOfMouse,
          columnOfMouse,
          1
        );

      let speed = 0.01//(size / 18) + (size / (Math.floor(Math.random() * 30) + 30));
      let rnd = Math.random();
      if (rnd < 0.5) speed *= -1;
      
      if(grid[rowOfMouse][columnOfMouse].dir == 1){
        grid[rowOfMouse][columnOfMouse].addCar(new Car(speed, 0, 0, 0, "green"));
      }
      else if(grid[rowOfMouse][columnOfMouse].dir == 2){
        grid[rowOfMouse][columnOfMouse].addCar(new Car(0, speed, 0, 0, "green"));
      }
      else{
        if(Math.random() < 0.5){
          grid[rowOfMouse][columnOfMouse].addCar(new Car(speed, 0, 0, 0, "green"));
        }
        else{
          grid[rowOfMouse][columnOfMouse].addCar(new Car(0, speed, 0, 0, "green"));
        }
      }
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


class Car {
  constructor(speedX, speedY, forceX, forceY, color) {
      this.width = 20;
      this.height = 10;
      this.MIN_DIST_BETWEEN_CARS = 20;
      this.MAX_SPEED = (size / 15) + (size / (Math.floor(Math.random() * 100) + 10));
      this.acceleration = (size / 50);
      this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN = 10;
      this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;


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


  canMove(currRoad) {

      //if car is moving right
      if (this.outFrom == 2) {
          //get the index of this car in the cars array of this road
          let indexCar = this.getIndexOfThisInArrayByXY(currRoad.cars);

          //if there is car before this car in this road piece
          if (indexCar - 1 > -1) {
              let carBefore = this.getCarBeforeThisCar(currRoad, indexCar);

              //there is no cars in next road
              if (carBefore == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x + this.width, this.y, carBefore.x, carBefore.y);

              //check if car can move at max speed
              if (distBetweenCars - this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: distBetweenCars - this.MIN_DIST_BETWEEN_CARS, addY: 0, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else if (indexCar - 1 == -1) {
              // get the next road piece
              let nextRoad = currRoad.getNextRoad(this);

              //there is no next road to go to
              if (nextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //check if next road has cars
              if (nextRoad.cars.length == 0) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the first car in next road piece
              let firstCarInNextRoad = this.getCarBeforeThisCar(nextRoad, nextRoad.cars.length);

              //there is no cars in next road
              if (firstCarInNextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x + this.width, this.y, firstCarInNextRoad.x + size, firstCarInNextRoad.y);

              //check if car can move at max speed
              if (distBetweenCars - this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: distBetweenCars - this.MIN_DIST_BETWEEN_CARS, addY: 0, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else {
              //indexCar was not found - shouldn't happen
              console.error("indexCar was not found!");
              return undefined;
          }
      }
      //if car is moving left
      else if (this.outFrom == 4) {
          //get the index of this car in the cars array of this road
          let indexCar = this.getIndexOfThisInArrayByXY(currRoad.cars);

          //if there is car before this car in this road piece
          if (indexCar - 1 > -1) {
              let carBefore = this.getCarBeforeThisCar(currRoad, indexCar);

              //there is no cars in next road
              if (carBefore == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y, carBefore.x + carBefore.width, carBefore.y);

              //check if car can move at max speed
              if (distBetweenCars + this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: -(distBetweenCars - this.MIN_DIST_BETWEEN_CARS), addY: 0, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else if (indexCar - 1 == -1) {
              // get the next road piece
              let nextRoad = currRoad.getNextRoad(this);

              //there is no next road to go to
              if (nextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //check if next road has cars
              if (nextRoad.cars.length == 0) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the first car in next road piece
              let firstCarInNextRoad = this.getCarBeforeThisCar(nextRoad, nextRoad.cars.length);

              if (firstCarInNextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y, firstCarInNextRoad.x - size + firstCarInNextRoad.width, firstCarInNextRoad.y);

              //check if car can move at max speed
              if (distBetweenCars + this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: -(distBetweenCars - this.MIN_DIST_BETWEEN_CARS), addY: 0, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else {
              //indexCar was not found - shouldn't happen
              console.error("indexCar was not found!");
              return { status: "no speed" };
          }
      }
      //if car is moving down
      else if (this.outFrom == 3) {
          //get the index of this car in the cars array of this road
          let indexCar = this.getIndexOfThisInArrayByXY(currRoad.cars);

          //if there is car before this car in this road piece
          if (indexCar - 1 > -1) {
              let carBefore = this.getCarBeforeThisCar(currRoad, indexCar);

              //there is no cars in next road
              if (carBefore == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y + this.height, carBefore.x, carBefore.y);

              //check if car can move at max speed
              if (distBetweenCars - this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: 0, addY: distBetweenCars - this.MIN_DIST_BETWEEN_CARS, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else if (indexCar - 1 == -1) {
              // get the next road piece
              let nextRoad = currRoad.getNextRoad(this);

              //there is no next road to go to
              if (nextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //check if next road has cars
              if (nextRoad.cars.length == 0) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the first car in next road piece
              let firstCarInNextRoad = this.getCarBeforeThisCar(nextRoad, nextRoad.cars.length);

              if (firstCarInNextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y + this.height, firstCarInNextRoad.x, firstCarInNextRoad.y + size);

              //check if car can move at max speed
              if (distBetweenCars - this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: 0, addY: distBetweenCars - this.MIN_DIST_BETWEEN_CARS, status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else {
              //indexCar was not found - shouldn't happen
              console.error("indexCar was not found!");
              return { status: "no speed" };
          }
      }
      //if car is moving up
      else if (this.outFrom == 1) {
          //get the index of this car in the cars array of this road
          let indexCar = this.getIndexOfThisInArrayByXY(currRoad.cars);

          //if there is car before this car in this road piece
          if (indexCar - 1 > -1) {
              let carBefore = this.getCarBeforeThisCar(currRoad, indexCar);

              //there is no cars in next road
              if (carBefore == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y, carBefore.x, carBefore.y + carBefore.height);

              //check if car can move at max speed
              if (distBetweenCars + this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: 0, addY: -(distBetweenCars - this.MIN_DIST_BETWEEN_CARS), status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else if (indexCar - 1 == -1) {
              // get the next road piece
              let nextRoad = currRoad.getNextRoad(this);

              //there is no next road to go to
              if (nextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //check if next road has cars
              if (nextRoad.cars.length == 0) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the first car in next road piece
              let firstCarInNextRoad = this.getCarBeforeThisCar(nextRoad, nextRoad.cars.length);

              if (firstCarInNextRoad == undefined) return { addX: this.speedX, addY: this.speedY, status: "full speed" };

              //get the distance between the cars
              let distBetweenCars = this.getDist(this.x, this.y, firstCarInNextRoad.x, firstCarInNextRoad.y - size + firstCarInNextRoad.height);

              //check if car can move at max speed
              if (distBetweenCars + this.speedX >= this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: this.speedX, addY: this.speedY, status: "full speed" };
              }
              //car can't move at max speed but maybe the car can move by a bit
              if (distBetweenCars > this.MIN_DIST_BETWEEN_CARS) {
                  return { addX: 0, addY: -(distBetweenCars - this.MIN_DIST_BETWEEN_CARS), status: "part speed" };
              }

              //car can't move at all
              return { status: "no speed" };
          }
          else {
              //indexCar was not found - shouldn't happen
              console.error("indexCar was not found!");
              return { status: "no speed" };
          }
      }

  }

  getCarBeforeThisCar(currRoad, indexThisCar) {
      for (let i = indexThisCar - 1; i > -1; i--) {
          if (currRoad.cars[i].outFrom == this.outFrom) {
              return currRoad.cars[i];
          }
      }

      return undefined;
  }

  getDist(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  getIndexOfThisInArrayByXY(cars) {
      for (let i in cars) {
          if (cars[i].x == this.x && cars[i].y == this.y && cars[i].outFrom == this.outFrom) {
              return i;
          }
      }

      return undefined;
  }


  reduceSpeed() {

      this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN;


      if (this.outFrom == 2) {
          this.speedX -= this.acceleration;
          if (this.speedX < 0) this.speedX = 0;
      }
      else if (this.outFrom == 4) {
          this.speedX += this.acceleration;
          if (this.speedX > 0) this.speedX = 0;
      }
      else if (this.outFrom == 3) {
          this.speedY -= this.acceleration;
          if (this.speedY < 0) this.speedY = 0;
      }
      else if (this.outFrom == 1) {
          this.speedY += this.acceleration;
          if (this.speedY > 0) this.speedY = 0;
      }
  }

  increaseSpeed() {

      this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN;

      if (this.outFrom == 2) {
          this.speedX += this.acceleration;
          if (this.speedX > this.MAX_SPEED) this.speedX = this.MAX_SPEED;
      }
      else if (this.outFrom == 4) {
          this.speedX -= this.acceleration;
          if (this.speedX < -this.MAX_SPEED) this.speedX = -this.MAX_SPEED;
      }
      else if (this.outFrom == 3) {
          this.speedY += this.acceleration;
          if (this.speedY > this.MAX_SPEED) this.speedY = this.MAX_SPEED;
      }
      else if (this.outFrom == 1) {
          this.speedY -= this.acceleration;
          if (this.speedY < -this.MAX_SPEED) this.speedY = -this.MAX_SPEED;
      }
  }


  draw(startX, startY) {
      if (this.speedX > 0) {
          drawer.drawSquare(
              startX + this.x,
              startY + this.y - (size / 6) - this.height,
              this.width,
              this.height,
              this.color
          );
      } else if (this.speedX < 0) {
          drawer.drawSquare(
              startX + this.x,
              startY + this.y + (size / 6) + borderWidth,
              this.width,
              this.height,
              this.color
          );
      } else if (this.speedY > 0) {
          drawer.drawSquare(
              startX + this.x + (size / 6) + borderWidth,
              startY + this.y,
              this.height,
              this.width,
              this.color
          );
      } else if (this.speedY < 0) {
          drawer.drawSquare(
              ((startX + this.x) - (size / 6)) - this.height,
              startY + this.y,
              this.height,
              this.width,
              this.color
          );
      }
  }
}


class Road {
  constructor(row, column, dir) {
      this.row = row;
      this.column = column;
      this.dir = dir;
      this.cars = [];


      if (this.dir == 1 || this.dir == 2)
          this.acceptedNextRoadsDir = [this.dir, 3];
      else if (this.dir == 3)
          this.acceptedNextRoadsDir = [1, 2, this.dir];
  }

  // outFrom: 2 - right, 4 - left, 3 - down, 1 - up

  changeDir(newDir) {
      this.dir = newDir;

      if (this.dir == 1 || this.dir == 2)
          this.acceptedNextRoadsDir = [this.dir, 3];
      else if (this.dir == 3)
          this.acceptedNextRoadsDir = [1, 2, this.dir];
  }

  addCar(car) {
      this.cars.push(car);

      if (this.dir == 1) {
          if (car.speedX > 0) {
              car.outFrom = 2;
          }
          else if (car.speedX < 0) {
              car.outFrom = 4;
          }
      }
      else if (this.dir == 2) {
          if (car.speedY > 0) {
              car.outFrom = 3;
          }
          else if (car.speedY < 0) {
              car.outFrom = 1;
          }
      }
      else if (this.dir == 3) {
          //choose side to turn to
          if (car.speedX > 0) {
              car.outFrom = 2;
          }
          else if (car.speedX < 0) {
              car.outFrom = 4;
          }
          else if (car.speedY > 0) {
              car.outFrom = 3;
          }
          else if (car.speedY < 0) {
              car.outFrom = 1;
          }
      }
  }

  moveCars() {
      for (let i = this.cars.length - 1; i > -1; i--) {
          let car = this.cars[i];
          //if the cars has been moved already in this turn then don't move
          if (car.hasBeenMoved) continue;

          //if car can't move
          let maxDistCarCanMove = car.canMove(this);
          if (maxDistCarCanMove.status == "no speed") {
              //can't move at all
              //reduce the speed
              if (car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING == 0) {
                  car.reduceSpeed();
              }
              else car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING--;
              continue;
          }
          else if (maxDistCarCanMove.status == "part speed") {
              //can move a little
              //reduce the speed
              if (car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING == 0)
                  car.reduceSpeed();
              else car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING--;
          }
          else {
              //increase the speed
              if (car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING == 0)
                  car.increaseSpeed();
              else car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING--;
          }

          car.x += maxDistCarCanMove.addX;
          car.y += maxDistCarCanMove.addY;

          car.hasBeenMoved = true;

          //move right
          if (car.outFrom == 2 && car.x >= size) {
              //move to the next road
              this.cars.splice(i, 1);

              let offset = car.x - size;

              car.x = offset;
              car.y = size;

              let nextRoad = this.getNextRoad(car);

              if (nextRoad != undefined) {
                  nextRoad.addCar(car);
              }
          }
          //move left
          else if (car.outFrom == 4 && car.x + car.width <= borderWidth) {
              this.cars.splice(i, 1);

              let offset = car.x + car.width;

              car.x = (size - car.width) + offset;
              car.y = 0;

              let nextRoad = this.getNextRoad(car);

              if (nextRoad != undefined) {
                  nextRoad.addCar(car);
              }
          }
          //move down
          else if (car.outFrom == 3 && car.y >= size) {
              this.cars.splice(i, 1);

              let offset = car.y - size;

              car.x = 0;
              car.y = offset;

              let nextRoad = this.getNextRoad(car);

              if (nextRoad != undefined) {
                  nextRoad.addCar(car);
              }
          }
          //move up
          else if (car.outFrom == 1 && car.y + car.height <= borderWidth) {
              this.cars.splice(i, 1);

              let offset = car.y + car.height;

              car.x = size;
              car.y = (size - car.height) + offset;

              let nextRoad = this.getNextRoad(car);

              if (nextRoad != undefined) {
                  nextRoad.addCar(car);
              }
          }
      }
  }

  getNextRoad(car) {
      if (car.outFrom == 2) {
          if (this.column + 1 < gridWidth && grid[this.row][this.column + 1] &&
              this.acceptedNextRoadsDir.includes(grid[this.row][this.column + 1].dir)) {
              return grid[this.row][this.column + 1];
          }

          if (this.column + 1 == gridWidth && grid[this.row][0] &&
              this.acceptedNextRoadsDir.includes(grid[this.row][0].dir)) {
              return grid[this.row][0];
          }
      }
      else if (car.outFrom == 4) {
          if (this.column - 1 > -1 && grid[this.row][this.column - 1] &&
              this.acceptedNextRoadsDir.includes(grid[this.row][this.column - 1].dir)) {
              return grid[this.row][this.column - 1];
          }

          if (this.column - 1 == -1 && grid[this.row][gridWidth - 1] &&
              this.acceptedNextRoadsDir.includes(grid[this.row][gridWidth - 1].dir)) {
              return grid[this.row][gridWidth - 1];
          }
      }
      else if (car.outFrom == 3) {
          if (this.row + 1 < gridHeight && grid[this.row + 1][this.column] &&
              this.acceptedNextRoadsDir.includes(grid[this.row + 1][this.column].dir)) {
              return grid[this.row + 1][this.column];
          }

          if (this.row + 1 == gridHeight && grid[0][this.column] &&
              this.acceptedNextRoadsDir.includes(grid[0][this.column].dir)) {
              return grid[0][this.column];
          }
      }
      else if (car.outFrom == 1) {
          if (this.row - 1 > -1 && grid[this.row - 1][this.column] &&
              this.acceptedNextRoadsDir.includes(grid[this.row - 1][this.column].dir)) {
              return grid[this.row - 1][this.column];
          }
          if (this.row - 1 == -1 && grid[gridHeight - 1][this.column] &&
              this.acceptedNextRoadsDir.includes(grid[gridHeight - 1][this.column].dir)) {
              return grid[gridHeight - 1][this.column];
          }
      }
  }


  draw() {
      let startX = this.column * size + borderWidth;
      let startY = this.row * size + borderWidth;
      let width = size - borderWidth;
      let height = size - borderWidth;

      let lineInMiddleWidth = 5;
      let lineInMiddleHeight = 10;

      if (this.column == grid[0].length - 1) width -= borderWidth;
      if (this.row == grid.length - 1) height -= borderWidth;

      drawer.drawSquare(startX, startY, width, height, "black");

      if (this.dir == 1) {
          for (let i = lineInMiddleHeight; i < width - lineInMiddleHeight; i += (lineInMiddleHeight * 2)) {
              drawer.drawSquare(startX + i, startY + (height / 2) - (lineInMiddleWidth / 2), lineInMiddleHeight, lineInMiddleWidth, "white");
          }
      }
      else if (this.dir == 2) {
          for (let i = lineInMiddleHeight; i < width - lineInMiddleHeight; i += (lineInMiddleHeight * 2)) {
              drawer.drawSquare(startX + (width / 2) - (lineInMiddleWidth / 2), startY + i, lineInMiddleWidth, lineInMiddleHeight, "white");
          }
      }
      else if (this.dir == 3) {
          drawer.drawCircle(startX + (width / 2), startY + (height / 2), lineInMiddleWidth, "white");
      }
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