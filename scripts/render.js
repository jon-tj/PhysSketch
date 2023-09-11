const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const world=[] // Contains objects that are affected by forces
const staticObjects=[] // Contains text objects, rulers, etc...
const forces=[] // Contains force fields
const links=[]
var displayGrid=true
var tool={} //suppress error on initial render

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

function renderArrow(x1,y1,x2,y2,color="#f22"){
    ctx.beginPath()
    ctx.strokeStyle=color
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    var dir=new Vector(x2-x1,y2-y1).normalize()
    var norm=dir.normal()
    var arrowSize=15
    ctx.lineTo(x2-(dir.x+norm.x)*arrowSize,y2-(dir.y+norm.y)*arrowSize)
    ctx.moveTo(x2,y2)
    ctx.lineTo(x2-(dir.x-norm.x)*arrowSize,y2-(dir.y-norm.y)*arrowSize)
    ctx.stroke()
}
function renderVector(vec,x,y,color="#f22"){
    renderArrow(x,y,x+vec.x,y+vec.y,color)
}

function renderBox(view, xT, yT,dX,dY, width, height, angle=0, color="#f22", fill=false) {
    var size = view.dy;
    ctx.beginPath();
    ctx.save();
    ctx.translate(xT, yT);
    ctx.rotate(angle);
    ctx.translate(dX*size, -dY*size);

    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;

    if (fill) {
        ctx.fillStyle = color;
        ctx.fillRect(-halfWidth * size, -halfHeight * size, width * size, height * size);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(-halfWidth * size, -halfHeight * size, width * size, height * size);
    }
    ctx.restore();
}

function render(){
    ctx.fillStyle = colors['--editor-bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if(displayGrid) renderGrid(viewport)

    for(var i=0; i<world.length; i++){
        world[i].render(viewport)
    }
    for(var i=0; i<staticObjects.length; i++)
        if(!staticObjects[i].hidden)staticObjects[i].render(viewport)
    
    for(var i=0; i<links.length; i++)
        if(!links[i].hidden)links[i].render(viewport)

    if(tool.tempObj!=null && mouse.location.x>0){
        ctx.beginPath()
        ctx.moveTo(viewport.transformX(tool.tempObj.currPos.x), viewport.transformY(tool.tempObj.currPos.y))
        ctx.lineTo(mouse.location.x,mouse.location.y)
        ctx.strokeStyle="#f22"
        ctx.stroke()
    }
    if(tool.type=="create"){
        ctx.globalAlpha=0.5
        ctx.beginPath()
        ctx.arc(mouse.location.x,mouse.location.y,tool.createRadius*viewport.dy,0,2*Math.PI)
        ctx.closePath()
        ctx.strokeStyle="#f22"
        ctx.stroke()
        ctx.globalAlpha=1
    }
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
