const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')


class Viewport{
    constructor(x=0, y=0, width=10, height=null){
        this.x = x
        this.y = y
        this.width = width
        if(!height) height=width*canvas.height/canvas.width
        this.height = height
    }
    transformX(x=0){
        return remap(x,this.x-this.width,this.x+this.width,0,this.canvas.width)
    }
    transformY(y=0){
        return remap(y,this.y-this.height,this.y+this.height,this.canvas.height,0)
    }
}
const viewport= new Viewport()


function render(){
    ctx.fillStyle = colors['--editor-bg']
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
}

//#region set the canvas size
function resizeCanvas(){
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight-navbar.container.clientHeight
    canvas.style.top=navbar.container.clientHeight+'px'
    render()
}
resizeCanvas()
window.addEventListener("resize",resizeCanvas)
//#endregion
