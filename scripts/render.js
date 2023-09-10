const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const world=[] // Contains all the physics objects to be simulated
const gizmos=[] // Contains text objects, rulers and such
var displayGrid=true

class Viewport{
    constructor(x=0, y=0, width=10, height=null){
        this.x = x
        this.y = y
        this.width = width
        if(!height) height=width*canvas.height/canvas.width
        this.height = height
    }
    transformX(x=0){
        return remap(x,this.x-this.width,this.x+this.width,0,canvas.width)
    }
    transformY(y=0){
        return remap(y,this.y-this.height,this.y+this.height,canvas.height,0)
    }
    revertX(x=0){
        return remap(x,0,canvas.width,this.x-this.width,this.x+this.width)
    }
    revertY(y=0){
        return remap(y,canvas.height,0,this.y-this.height,this.y+this.height)
    }
    get dx(){return canvas.width/(2*this.width)}
    get dy(){return canvas.height/(2*this.height)}

    get bottom(){return this.y-this.height}
    get top(){return this.y+this.height}
    get left(){return this.x-this.width}
    get right(){return this.x+this.width}

    pan(dx,dy){
        this.x-=dx
        this.y+=dy
    }
    zoom(d){
        var factor=1.1
        if(d<0) factor=1/factor
        this.width*=factor
        this.height*=factor
    }
}
const viewport= new Viewport()


function render(){
    ctx.fillStyle = colors['--editor-bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if(displayGrid) renderGrid(viewport)

    for(var i=0; i<world.length; i++){
        world[i].render(viewport)
    }
    for(var i=0; i<gizmos.length; i++)
        gizmos[i].render(viewport)
}

//#region set the canvas size
function resizeCanvas(){
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    viewport.width =viewport.height*canvas.width/canvas.height
    render()
}
resizeCanvas()
window.addEventListener("resize",resizeCanvas)
//#endregion
