class Road {

    static RoadType = {
        HORIZONTAL: 1,
        VERTICAL: 2,
        JUNCTION_WITH_TRAFFIC_LIGHT: 3
    }

    constructor(row, column, roadType) {
        this.row = row;
        this.column = column;
        this.cars = [];
        if (roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) this.acceptedNextRoadsTypes = [Road.RoadType.HORIZONTAL, Road.RoadType.VERTICAL, roadType];
        else this.setRoadType(roadType);
    }

    setRoadType(roadType) {
        this.roadType = roadType;
        this.acceptedNextRoadsTypes = [this.roadType, Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT];
    }

    addCar(car) {
        this.cars.push(car);

        if (this.roadType == Road.RoadType.HORIZONTAL) {
            if (car.speedX > 0) {
                car.movmentDirection = Car.MovmentDirection.RIGHT;
            }
            else if (car.speedX < 0) {
                car.movmentDirection = Car.MovmentDirection.LEFT;
            }
        }
        else if (this.roadType == Road.RoadType.VERTICAL) {
            if (car.speedY > 0) {
                car.movmentDirection = Car.MovmentDirection.DOWN;
            }
            else if (car.speedY < 0) {
                car.movmentDirection = Car.MovmentDirection.UP;
            }
        }
        else if (this.roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) {
            //choose side to turn to
            if (car.speedX > 0) {
                car.movmentDirection = Car.MovmentDirection.RIGHT;
            }
            else if (car.speedX < 0) {
                car.movmentDirection = Car.MovmentDirection.LEFT;
            }
            else if (car.speedY > 0) {
                car.movmentDirection = Car.MovmentDirection.DOWN;
            }
            else if (car.speedY < 0) {
                car.movmentDirection = Car.MovmentDirection.UP;
            }
        }
    }

    calcNextPositionForCars() {
        for (let i = this.cars.length - 1; i > -1; i--) {
            let car = this.cars[i];

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

            car.nextX = car.x + maxDistCarCanMove.addX;
            car.nextY = car.y + maxDistCarCanMove.addY;
        }
    }

    moveCars() {
        for (let i = this.cars.length - 1; i > -1; i--) {
            let car = this.cars[i];
            //if the cars has been moved already in this turn then don't move
            if (car.hasBeenMoved) continue;

            car.x = car.nextX;
            car.y = car.nextY;

            car.hasBeenMoved = true;

            //move right
            if (car.movmentDirection == Car.MovmentDirection.RIGHT && car.x + car.width >= size) {
                let offset = car.x - size;

                car.x = offset;
                car.y = size;

                let nextRoad = this.getNextRoad(car);

                if (nextRoad != undefined) {

                    if (nextRoad.roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) {
                        if (nextRoad.isTrafficLightGreen(car)) {
                            //console.log("Traffic light is GREEN!")
                            //remove car from current road
                            this.cars.splice(i, 1);
                            nextRoad.addCar(car);
                        }
                        else {
                            //console.log("Traffic light is RED!")
                            car.speedX = 0;
                            car.x = size - car.width;
                            car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;
                        }
                    }
                    else {
                        //remove car from current road
                        this.cars.splice(i, 1);
                        nextRoad.addCar(car);
                    }
                }
            }
            //move left
            else if (car.movmentDirection == Car.MovmentDirection.LEFT && car.x <= borderWidth) {
                car.x = size + car.x;
                car.y = 0;

                let nextRoad = this.getNextRoad(car);

                if (nextRoad != undefined) {

                    if (nextRoad.roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) {
                        if (nextRoad.isTrafficLightGreen(car)) {
                            //console.log("Traffic light is GREEN!")
                            //remove car from current road
                            this.cars.splice(i, 1);
                            nextRoad.addCar(car);
                        }
                        else {
                            //console.log("Traffic light is RED!")
                            car.speedX = 0;
                            car.x = 0;
                            car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;
                        }
                    }
                    else {
                        //remove car from current road
                        this.cars.splice(i, 1);
                        nextRoad.addCar(car);
                    }
                }
            }
            //move down
            else if (car.movmentDirection == Car.MovmentDirection.DOWN && car.y + car.width >= size) {

                let offset = car.y - size;

                car.x = 0;
                car.y = offset;

                let nextRoad = this.getNextRoad(car);

                if (nextRoad != undefined) {
                    if (nextRoad.roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) {
                        if (nextRoad.isTrafficLightGreen(car)) {
                            //console.log("Traffic light is GREEN!")
                            //remove car from current road
                            this.cars.splice(i, 1);
                            nextRoad.addCar(car);
                        }
                        else {
                            //console.log("Traffic light is RED!")
                            car.speedY = 0;
                            car.y = size - car.width;
                            car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;
                        }
                    }
                    else {
                        //remove car from current road
                        this.cars.splice(i, 1);
                        nextRoad.addCar(car);
                    }
                }
            }
            //move up
            else if (car.movmentDirection == Car.MovmentDirection.UP && car.y <= borderWidth) {

                car.x = size;
                car.y = size + car.y;

                let nextRoad = this.getNextRoad(car);

                if (nextRoad != undefined) {
                    if (nextRoad.roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT) {
                        if (nextRoad.isTrafficLightGreen(car) && nextRoad.hasNoCarsExecptForCarsMoving(Car.MovmentDirection.UP)) {
                            //console.log("Traffic light is GREEN!")
                            //remove car from current road
                            this.cars.splice(i, 1);
                            nextRoad.addCar(car);
                        }
                        else {
                            //console.log("Traffic light is RED!")
                            car.speedY = 0;
                            car.y = 0;
                            car.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;
                        }
                    }
                    else {
                        //remove car from current road
                        this.cars.splice(i, 1);
                        nextRoad.addCar(car);
                    }
                }
            }
        }
    }

    getNextRoad(car) {
        if (car.movmentDirection == Car.MovmentDirection.RIGHT) {
            if (this.column + 1 < gridWidth && grid[this.row][this.column + 1] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row][this.column + 1].roadType)) {
                return grid[this.row][this.column + 1];
            }

            if (this.column + 1 == gridWidth && grid[this.row][0] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row][0].roadType)) {
                return grid[this.row][0];
            }
        }
        else if (car.movmentDirection == Car.MovmentDirection.LEFT) {
            if (this.column - 1 > -1 && grid[this.row][this.column - 1] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row][this.column - 1].roadType)) {
                return grid[this.row][this.column - 1];
            }

            if (this.column - 1 == -1 && grid[this.row][gridWidth - 1] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row][gridWidth - 1].roadType)) {
                return grid[this.row][gridWidth - 1];
            }
        }
        else if (car.movmentDirection == Car.MovmentDirection.DOWN) {
            if (this.row + 1 < gridHeight && grid[this.row + 1][this.column] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row + 1][this.column].roadType)) {
                return grid[this.row + 1][this.column];
            }

            if (this.row + 1 == gridHeight && grid[0][this.column] &&
                this.acceptedNextRoadsTypes.includes(grid[0][this.column].roadType)) {
                return grid[0][this.column];
            }
        }
        else if (car.movmentDirection == Car.MovmentDirection.UP) {
            if (this.row - 1 > -1 && grid[this.row - 1][this.column] &&
                this.acceptedNextRoadsTypes.includes(grid[this.row - 1][this.column].roadType)) {
                return grid[this.row - 1][this.column];
            }
            if (this.row - 1 == -1 && grid[gridHeight - 1][this.column] &&
                this.acceptedNextRoadsTypes.includes(grid[gridHeight - 1][this.column].roadType)) {
                return grid[gridHeight - 1][this.column];
            }
        }
    }


    hasNoCars() {
        return this.cars.length == 0;
    }

    hasNoCarsExecptForCarsMoving(carMovmentDirection) {
        for(let car of this.cars)
            if(car.movmentDirection != carMovmentDirection) return false;
        return true;
    }

    makeTurn() {
        this.draw();
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

        if (this.roadType == Road.RoadType.HORIZONTAL) {
            for (let i = lineInMiddleHeight; i < width - lineInMiddleHeight; i += (lineInMiddleHeight * 2)) {
                drawer.drawSquare(startX + i, startY + (height / 2) - (lineInMiddleWidth / 2), lineInMiddleHeight, lineInMiddleWidth, "white");
            }
        }
        else if (this.roadType == Road.RoadType.VERTICAL) {
            for (let i = lineInMiddleHeight; i < width - lineInMiddleHeight; i += (lineInMiddleHeight * 2)) {
                drawer.drawSquare(startX + (width / 2) - (lineInMiddleWidth / 2), startY + i, lineInMiddleWidth, lineInMiddleHeight, "white");
            }
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