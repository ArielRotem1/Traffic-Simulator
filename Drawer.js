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

        size = sizeOfSquareRatio;
        borderWidth = lineWidth;

        grid = new Array(Math.floor(this.canvasHeight / size));

        for (let i = 0; i < grid.length; i++) {
            grid[i] = new Array(Math.floor(this.canvasWidth / size)).fill(undefined);
        }

        gridWidth = grid[0].length;
        gridHeight = grid.length;

        this.addEventListenersToAllowUserToUseCanvas();
    }

    addEventListenersToAllowUserToUseCanvas() {
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

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    canvasHasBeenClicked(mousePos) {
        //update the start location of the canvas if the window has been changed
        let rect = this.canvas.getBoundingClientRect();
        this.xoffset = rect.left;
        this.yoffset = rect.top;

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
                if (grid[rowOfMouse][columnOfMouse].roadType == Road.RoadType.HORIZONTAL && grid[rowOfMouse][columnOfMouse].hasNoCars()) {
                    grid[rowOfMouse][columnOfMouse].setRoadType(Road.RoadType.VERTICAL);
                }
                else if (grid[rowOfMouse][columnOfMouse].roadType == Road.RoadType.VERTICAL && grid[rowOfMouse][columnOfMouse].hasNoCars()) {
                    grid[rowOfMouse][columnOfMouse] = new JunctionWithTrafficLights(rowOfMouse, columnOfMouse, Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT);
                }
                else if (grid[rowOfMouse][columnOfMouse].roadType == Road.RoadType.JUNCTION_WITH_TRAFFIC_LIGHT && grid[rowOfMouse][columnOfMouse].hasNoCars()) {
                    grid[rowOfMouse][columnOfMouse] = new Road(rowOfMouse, columnOfMouse, Road.RoadType.HORIZONTAL);
                }
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

            if (grid[rowOfMouse][columnOfMouse].roadType == Road.RoadType.HORIZONTAL) {
                grid[rowOfMouse][columnOfMouse].addCar(new Car(speed, 0, 0, 0, "green"));
            }
            else if (grid[rowOfMouse][columnOfMouse].roadType == Road.RoadType.VERTICAL) {
                grid[rowOfMouse][columnOfMouse].addCar(new Car(0, speed, 0, 0, "green"));
            }
            else {
                if (Math.random() < 0.5) {
                    grid[rowOfMouse][columnOfMouse].addCar(new Car(speed, 0, 0, 0, "green"));
                }
                else {
                    grid[rowOfMouse][columnOfMouse].addCar(new Car(0, speed, 0, 0, "green"));
                }
            }
        }
    }
}

