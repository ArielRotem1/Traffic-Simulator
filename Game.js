var size, borderWidth, user, interval;
var grid, gridWidth, gridHeight;
var drawer = undefined;

window.onload = () => {
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
                grid[i][j].calcNextPositionForCars();
                grid[i][j].makeTurn();
            }
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j]) {
                grid[i][j].moveCars();
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

function clearCanvas() {
    drawer.drawSquare(0, 0, drawer.canvasWidth, drawer.canvasHeight, "AliceBlue");
}

function setNavButtonsClick() {
    let nav_button_road = document.getElementById("nav_button_road");
    let nav_button_car = document.getElementById("nav_button_car");
    let nav_button_clear = document.getElementById("nav_button_clear");

    nav_button_road.addEventListener(
        "click",
        function (evt) {
            if (!user.isAddingRoad) {
                user.isAddingRoad = true;
                user.isClearing = false;
                user.isAddingCar = false;

                nav_button_car.classList.remove("active");
                nav_button_clear.classList.remove("active");
                this.classList.add("active");
            } else {
                user.isAddingRoad = false;

                this.classList.remove("active");
            }
        },
        false
    );

    nav_button_car.addEventListener(
        "click",
        function (evt) {
            if (!user.isAddingCar) {
                user.isAddingRoad = false;
                user.isClearing = false;
                user.isAddingCar = true;

                nav_button_road.classList.remove("active");
                nav_button_clear.classList.remove("active");
                this.classList.add("active");
            } else {
                user.isAddingCar = false;

                this.classList.remove("active");
            }
        },
        false
    );

    nav_button_clear.addEventListener(
        "click",
        function (evt) {
            if (!user.isClearing) {
                user.isAddingRoad = false;
                user.isClearing = true;
                user.isAddingCar = false;

                nav_button_road.classList.remove("active");
                nav_button_car.classList.remove("active");
                this.classList.add("active");
            } else {
                user.isClearing = false;
                
                this.classList.remove("active");
            }
        },
        false
    );
}