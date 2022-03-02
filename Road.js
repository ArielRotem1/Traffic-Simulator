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