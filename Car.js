class Car {

    static MovmentDirection = {
        UP: 0,
        LEFT: 1,
        DOWN: 2,
        RIGHT: 3
    }

    constructor(speedX, speedY, forceX, forceY, color) {
        this.width = 20;
        this.height = 10;
        this.MIN_DIST_BETWEEN_CARS = 20;
        this.MAX_SPEED = (size / 15) + (size / (Math.floor(Math.random() * 100) + 10));
        this.acceleration = (size / 50);
        this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN = 10;
        this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = 0;

        this.movmentDirection = -1;

        this.hasBeenMoved = false;

        if (speedX > 0) {
            this.x = borderWidth;
            this.y = size;
        }
        else if (speedX < 0) {
            this.x = size - this.width;
            this.y = 0;
        }
        else if (speedY > 0) {
            this.x = 0;
            this.y = borderWidth;
        }
        else if (speedY < 0) {
            this.x = size;
            this.y = size - this.height;
        }

        this.speedX = speedX;
        this.speedY = speedY;
        this.forceX = forceX;
        this.forceY = forceY;
        this.color = color;

        this.nextX = 0;
        this.nextY = 0;
    }


    canMove(currRoad) {

        //if car is moving right
        if (this.movmentDirection == Car.MovmentDirection.RIGHT) {
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
        else if (this.movmentDirection == Car.MovmentDirection.LEFT) {
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
        else if (this.movmentDirection == Car.MovmentDirection.DOWN) {
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
        else if (this.movmentDirection == Car.MovmentDirection.UP) {
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
            if (currRoad.cars[i].movmentDirection == this.movmentDirection) {
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
            if (cars[i].x == this.x && cars[i].y == this.y && cars[i].movmentDirection == this.movmentDirection) {
                return i;
            }
        }

        return undefined;
    }


    reduceSpeed() {

        this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN;


        if (this.movmentDirection == Car.MovmentDirection.RIGHT) {
            this.speedX -= this.acceleration;
            if (this.speedX < 0) this.speedX = 0;
        }
        else if (this.movmentDirection == Car.MovmentDirection.LEFT) {
            this.speedX += this.acceleration;
            if (this.speedX > 0) this.speedX = 0;
        }
        else if (this.movmentDirection == Car.MovmentDirection.DOWN) {
            this.speedY -= this.acceleration;
            if (this.speedY < 0) this.speedY = 0;
        }
        else if (this.movmentDirection == Car.MovmentDirection.UP) {
            this.speedY += this.acceleration;
            if (this.speedY > 0) this.speedY = 0;
        }
    }

    increaseSpeed() {

        this.NUMBER_OF_TIMES_FROM_LAST_ACCELERATING = this.NUMBER_OF_TIMES_BEFORE_ACCELERATING_AGAIN;

        if (this.movmentDirection == Car.MovmentDirection.RIGHT) {
            this.speedX += this.acceleration;
            if (this.speedX > this.MAX_SPEED) this.speedX = this.MAX_SPEED;
        }
        else if (this.movmentDirection == Car.MovmentDirection.LEFT) {
            this.speedX -= this.acceleration;
            if (this.speedX < -this.MAX_SPEED) this.speedX = -this.MAX_SPEED;
        }
        else if (this.movmentDirection == Car.MovmentDirection.DOWN) {
            this.speedY += this.acceleration;
            if (this.speedY > this.MAX_SPEED) this.speedY = this.MAX_SPEED;
        }
        else if (this.movmentDirection == Car.MovmentDirection.UP) {
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
        else {
            if (this.movmentDirection == Car.MovmentDirection.RIGHT) {
                drawer.drawSquare(
                    startX + this.x,
                    startY + this.y - (size / 6) - this.height,
                    this.width,
                    this.height,
                    this.color
                );
            }
            else if (this.movmentDirection == Car.MovmentDirection.LEFT) {
                drawer.drawSquare(
                    startX + this.x,
                    startY + this.y + (size / 6) + borderWidth,
                    this.width,
                    this.height,
                    this.color
                );
            }
            else if (this.movmentDirection == Car.MovmentDirection.DOWN) {
                drawer.drawSquare(
                    startX + this.x + (size / 6) + borderWidth,
                    startY + this.y,
                    this.height,
                    this.width,
                    this.color
                );
            }
            else if (this.movmentDirection == Car.MovmentDirection.UP) {
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
}
