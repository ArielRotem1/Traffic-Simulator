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
            if (!user.road) {
                user.road = true;
                user.clear = false;
                user.car = false;
                nav_button_car.classList.remove("active");
                nav_button_clear.classList.remove("active");
                this.classList.add("active");
            } else {
                user.road = false;
                this.classList.remove("active");
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
                nav_button_road.classList.remove("active");
                nav_button_clear.classList.remove("active");
                this.classList.add("active");
            } else {
                user.car = false;
                this.classList.remove("active");
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
                nav_button_road.classList.remove("active");
                nav_button_car.classList.remove("active");
                this.classList.add("active");
            } else {
                user.clear = false;
                this.classList.remove("active");
            }
        },
        false
    );
}