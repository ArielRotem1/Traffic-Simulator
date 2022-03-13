class JunctionWithTrafficLights extends Road {

    constructor(row, column, roadType) {
        super(row, column, roadType);
        this.roadType = roadType;

        this.CHANGE_LIGHT_EVERY_X_TURNS = 70;
        this.RED_FOR_ALL_FOR_X_TURNS = 45;
        this.countToChangeLight = 0;
        this.countToStayRedLight = -1;

        this.connectedRoads = [undefined, undefined, undefined, undefined];
        this.greenLightForSide = -1;

        this.updateConnectedRoads();
    }

    updateConnectedRoads() {

        this.connectedRoads = [undefined, undefined, undefined, undefined];

        //check if there is road to the - top
        if (this.row - 1 > -1 && grid[this.row - 1][this.column] != undefined) this.connectedRoads[0] = grid[this.row - 1][this.column];
        //check if there is road to the - left
        if (this.column - 1 > -1 && grid[this.row][this.column - 1] != undefined) this.connectedRoads[1] = grid[this.row][this.column - 1];
        //check if there is road to the - bottom
        if (this.row + 1 < gridHeight && grid[this.row + 1][this.column] != undefined) this.connectedRoads[2] = grid[this.row + 1][this.column];
        //check if there is road to the - right
        if (this.column + 1 < gridWidth && grid[this.row][this.column + 1] != undefined) this.connectedRoads[3] = grid[this.row][this.column + 1];

        this.greenLightForSide = -1;
        this.changeGreenLightSide()
    }

    makeTurn() {

        // console.log("this.countToStayRedLight: " + this.countToStayRedLight)
        // console.log("this.countToChangeLight: " + this.countToChangeLight)
        // console.log("this.greenLightForSide: " + this.greenLightForSide)
        //check if there is red light for all
        if (this.countToStayRedLight != -1) {

            //check if red light for all needs to be over
            if (this.countToStayRedLight == this.RED_FOR_ALL_FOR_X_TURNS) {
                //turn off red light for all
                this.countToStayRedLight = -1;
                return;
            }

            this.countToStayRedLight++;
            return;
        }

        //check if need to change green light side
        if (this.countToChangeLight == this.CHANGE_LIGHT_EVERY_X_TURNS) {
            this.countToChangeLight = 0;
            this.changeGreenLightSide();
        }
        else this.countToChangeLight++;



        this.draw();
    }

    changeGreenLightSide() {
        let i = (this.greenLightForSide + 1) % this.connectedRoads.length;
        let mone = 0;

        while (mone < 4) {
            if (this.connectedRoads[i] != undefined) {
                this.greenLightForSide = i;
                break;
            }

            mone++;
            i = (i + 1) % this.connectedRoads.length;
        }
    }

    isTrafficLightGreen(car) {
        return car.movmentDirection == this.greenLightForSide;
    }

    draw() {
        let startX = this.column * size + borderWidth;
        let startY = this.row * size + borderWidth;
        let width = size - borderWidth;
        let height = size - borderWidth;

        let lineInMiddleWidth = 5;

        if (this.column == grid[0].length - 1) width -= borderWidth;
        if (this.row == grid.length - 1) height -= borderWidth;

        drawer.drawSquare(startX, startY, width, height, "black");
        drawer.drawCircle(startX + (width / 2), startY + (height / 2), lineInMiddleWidth, "white");
        this.drawLightsForSides(this.greenLightForSide, startX, startY, width, height);
    }

    drawLightsForSides(currSideGreen, startX, startY, width, height){
        let lightLineWidth = 3;

        for(let i = 0; i < this.connectedRoads.length; i++){
            if(this.connectedRoads[i] != undefined){ //check if there is road connected
                let lightColor = "red";
                if(i == currSideGreen){ //check if this side should be green
                    lightColor = "green";
                }
                
                switch (i) {
                    case 0: drawer.drawSquare(startX, startY + height - lightLineWidth, width, lightLineWidth, lightColor); break;
                    case 1: drawer.drawSquare(startX + width - lightLineWidth, startY, lightLineWidth, height, lightColor); break;
                    case 2: drawer.drawSquare(startX, startY, width, lightLineWidth, lightColor); break;
                    case 3: drawer.drawSquare(startX, startY, lightLineWidth, height, lightColor); break;
                }
            }
        }
    }
}

