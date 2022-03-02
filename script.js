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
