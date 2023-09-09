const tool = {
    type: null,
    item: null,
}

function setTool(type,item=null) {
    tool.type = type
    if(item) tool.item = item
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

canvas.addEventListener('mousemove',(e)=>{
    setMouseAttributes(e)

})
canvas.addEventListener('mousedown',(e)=>{
    if(tool.type=='create'){
        switch(tool.item){
            case 'Particle':
                var p=new Particle(mouse.worldLocation.x,mouse.worldLocation.y)
                world.push(p)
                break
        }
        render()
    }
})

var dt = 0.01 // increase loop interval for more stable simulation
// Set up main simulation loop
setInterval(()=>{
    if(simulation.playing){
        for(var i=0; i<world.length; i++){
            world[i].step(environment,world,dt)
        }
        render()
    }
},dt*1000) 