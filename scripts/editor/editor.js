const tool = {
    type: null,
    item: null,
}

const mouse = {
    location:{x:0,y:0},
    worldLocation:{x:0,y:0},
    offset:{x:0,y:0},
    button:0
}
function setMouseAttributes(e){
    mouse.button = e.buttons
    mouse.offset.x = e.x-mouse.location.x
    mouse.offset.y = e.y-mouse.location.y
    mouse.location.x=e.x
    mouse.location.y=e.y
    mouse.worldLocation.x = viewport.revertX(e.x)
    mouse.worldLocation.y = viewport.revertY(e.y)
}
canvas.oncontextmenu = (e)=> {e.preventDefault()}
canvas.addEventListener('mousemove',(e)=>{
    setMouseAttributes(e)
    if(mouse.button==2){
        viewport.pan(mouse.offset.x/viewport.dx,mouse.offset.y/viewport.dy)
        render()
    }
})
window.addEventListener('wheel',(e)=>{
    viewport.zoom(e.deltaY)
    render()
})
canvas.addEventListener('mousedown',(e)=>{
    setMouseAttributes(e)
    if(mouse.button!=1) return
    switch(tool.type){
        case 'create':
            switch(tool.item){
                case 'Particle':
                    var p=new Particle(mouse.worldLocation.x,mouse.worldLocation.y)
                    world.push(p)
                    break
                case 'Force field':
                    var f=new ForceField(mouse.worldLocation.x,mouse.worldLocation.y)
                    staticObjects.push(f)
                    forces.push(f)
                    break
            }
            break
        case 'text':
            var t=new TextGizmo(mouse.worldLocation.x,mouse.worldLocation.y,"Text")
            staticObjects.push(t)
            break
    }
    render()
})
