class Snake{
    constructor(options = {}){
        this.mountingPoint = options.mountingPoint || this.backupDiv()
        this.size = options.size || 50
        this.speed = options.speed || 4
        this.grid = []
        this.snakeBody = []
        this.food = []
        this.head = []
        this.direction = null
        this.setDirectionAndMove = this.setDirectionAndMove.bind(this)
        this.reset = this.reset.bind(this)
    }

    backupDiv(){
        const mountingPoint = document.createElement("div")
        mountingPoint.id = "default-game-area"

        document.body.appendChild(mountingPoint)

        return mountingPoint
    }

    tupleCompare(tupA, tupB){
        return tupA[0] === tupB[0] && tupA[1] === tupB[1]
    }
    
    create(){
        const gameArea = document.createElement("table")
        gameArea.id = "game-area"

        for(let i = 0; i < this.size; i++){
            const gridRow = []
            const thisRow = document.createElement("tr")
            for(let j = 0; j < this.size; j++){
                gridRow.push(0)
                const thisCell = document.createElement("td")
                thisRow.appendChild(thisCell)
            }
            this.grid.push(gridRow)
            gameArea.appendChild(thisRow)
        }

        this.mountingPoint.appendChild(gameArea)
        this.createControlPanel()
        this.placeInitial()

        window.addEventListener('keydown', this.setDirectionAndMove)
    }
    
    setDirectionAndMove(event){
        this.direction = `${event.code}`
        this.move()
    }

    reset(){
        window.removeEventListener('keydown', this.setDirectionAndMove)

        while (this.mountingPoint.hasChildNodes()){
            this.mountingPoint.removeChild(this.mountingPoint.childNodes[0])
        }
        
        this.grid = []
        this.snakeBody = []
        this.food = []
        this.head = []
        this.direction = null

        this.create()
    }

    createControlPanel(){
        const controlPanel = document.createElement("div")
        const resetButton = document.createElement("button")
        
        resetButton.id = "reset-button"
        resetButton.innerText = "Reset"
        controlPanel.id = "control-panel"

        resetButton.addEventListener("click", this.reset)

        controlPanel.appendChild(resetButton)
        
        this.mountingPoint.appendChild(controlPanel)
    }

    placeInitial(){
        const y = Math.floor(Math.random() * this.size)
        const x = Math.floor(Math.random() * this.size)

        let foodY = Math.floor(Math.random() * this.size)
        let foodX = Math.floor(Math.random() * this.size)

        this.food = [foodY, foodX]
        this.head = [y, x]

        while(this.tupleCompare(this.food, this.head)){
            console.log("Rare collision placing head and food")

            foodY = Math.floor(Math.random() * this.size)
            foodX = Math.floor(Math.random() * this.size)

            this.food = [foodY, foodX]
        }

        this.grid[y][x] = 1
        this.render()
    }

    render(){
        const gameArea = document.getElementById("game-area")

        this.snakeBody.forEach(tuple => {
            gameArea.childNodes[tuple[0]].childNodes[tuple[1]]
            .classList.remove("snake")

        }) 

        this.snakeBody = []

        this.grid.forEach((row, rowID) => {
            row.forEach((cell, cellID) => {
                if(cell === 1){
                    this.snakeBody.push([rowID, cellID])
                }
            })
        })

        this.snakeBody.forEach(tuple => {
            gameArea.childNodes[tuple[0]].childNodes[tuple[1]]
            .classList.add("snake")

        })   

        gameArea.childNodes[this.food[0]].childNodes[this.food[1]]
        .classList.add("food")

        console.log(this.head)
    }

    move(){
        if(this.direction){
            this.grid[this.head[0]][this.head[1]] = 0
            switch(this.direction){
                case "KeyW":
                    this.head[0] -= 1
                    break
                case "KeyA":
                    this.head[1] -= 1
                    break
                case "KeyS":
                    this.head[0] += 1
                    break
                case "KeyD":
                    this.head[1] += 1
                    break
                default:
                    break
            }

            if(
                this.head[0] < 0 || 
                this.head[0] === this.size || 
                this.head[1] < 0 || 
                this.head[1] === this.size){
                    window.alert("You've run into a wall")
                    this.reset()
                }

            this.grid[this.head[0]][this.head[1]] = 1

            this.render()
        }
    }
}

