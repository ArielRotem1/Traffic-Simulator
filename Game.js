var size, borderWidth, user, interval;
var grid, gridWidth, gridHeight;
var drawer = undefined;

class Game{

    constructor(){

        window.onload = () => {
            drawer = new Drawer();
        
            drawer.setup("canvas", 50, 0);
            drawer.drawGrid();
        
            this.start();
        };
    }

    start(){
        user = new User();

        this.setNavButtonsClick();
    
        interval = setInterval(this.game, 50);
    }

    game(){
        drawer.drawSquare(0, 0, drawer.canvasWidth, drawer.canvasHeight, "AliceBlue");//clearCanvas();
        
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

    clearCanvas(){
        
    }

    setNavButtonsClick(){
        let nav_button_road = document.getElementById("nav_button_road");
        let nav_button_car = document.getElementById("nav_button_car");
        let nav_button_clear = document.getElementById("nav_button_clear");

        nav_button_road.addEventListener("click", (event) => {
            if (!user.isAddingRoad) {
                user.isAddingRoad = true;
                user.isClearing = false;
                user.isAddingCar = false;

                nav_button_car.classList.remove("active");
                nav_button_clear.classList.remove("active");
                nav_button_road.classList.add("active");
            }
            else {
                user.isAddingRoad = false;

                nav_button_road.classList.remove("active");
            }
        }, false);

        nav_button_car.addEventListener("click", (event) => {
            if (!user.isAddingCar) {
                user.isAddingRoad = false;
                user.isClearing = false;
                user.isAddingCar = true;

                nav_button_road.classList.remove("active");
                nav_button_clear.classList.remove("active");
                nav_button_car.classList.add("active");
            }
            else {
                user.isAddingCar = false;

                nav_button_car.classList.remove("active");
            }
        }, false);

        nav_button_clear.addEventListener("click", (event) => {
            if (!user.isClearing) {
                user.isAddingRoad = false;
                user.isClearing = true;
                user.isAddingCar = false;

                nav_button_road.classList.remove("active");
                nav_button_car.classList.remove("active");
                nav_button_clear.classList.add("active");
            }
            else {
                user.isClearing = false;
                
                nav_button_clear.classList.remove("active");
            }
        }, false);
    }
}

new Game();