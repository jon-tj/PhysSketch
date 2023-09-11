var tool = {
    type: null,
    item: null,
    tempObj:null,
    hoverObj:null,
    createRadius:0.1,
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
    
    if(mouse.button==2)
        viewport.pan(mouse.offset.x/viewport.dx,mouse.offset.y/viewport.dy)

    if(tool.tempObj!=null){
        switch(tool.item){
            case 'Rope':
                var createNodeDist=0.25
                var dir = Vector.diff(mouse.worldLocation,tool.tempObj.currPos)
                var dist=dir.magnitude
                if(dist<createNodeDist)return
                dir.normalize()
                var b=new Particle(tool.tempObj.currPos.x+dir.x*createNodeDist,tool.tempObj.currPos.y+dir.y*createNodeDist,tool.createRadius)
                var link=new Link(tool.tempObj,b,createNodeDist) //Vector.diff(tool.tempObj.currPos,b.currPos).magnitude
                link.hide()
                world.push(b)
                staticObjects.push(link)
                links.push(link)
                tool.tempObj=b
                break
        }
    }

    // Find hoverObj
    tool.hoverObj=null
    var minDist=20/*[px]*/ // if distance to higher than this, hoverObj is set to null.
    function findClosestObject(o){
        for(var i=0;i<o.length;i++){
            if(o[i].currPos==null)continue
            var dx = viewport.transformX(o[i].currPos.x)-mouse.location.x
            var dy = viewport.transformY(o[i].currPos.y)-mouse.location.y
            var dist = Math.sqrt(dx * dx + dy * dy)
            //console.log(dist)
            if(dist<minDist){
                minDist=dist
                tool.hoverObj=o[i]
            }
        }
    }
    findClosestObject(staticObjects)
    findClosestObject(world)

    render()
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
                    var p=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                    world.push(p)
                    tool.hoverObj=p
                    break
                case 'Force field':
                    var f=new ForceField(mouse.worldLocation.x,mouse.worldLocation.y)
                    staticObjects.push(f)
                    forces.push(f)
                    tool.hoverObj=f
                    break
                case 'Link':
                case 'Rope':
                    if(tool.hoverObj==null){
                        var a=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                        if(tool.item=='Rope'){
                            a.kinematic=true
                            a.color="#f22"
                        }
                        world.push(a)
                        tool.tempObj=a
                        tool.hoverObj=a
                    }else{
                        tool.tempObj=tool.hoverObj
                    }
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
canvas.addEventListener('mouseup',(e)=>{
    if(mouse.button!=1)return
    if(tool.type!='create') return
    switch(tool.item){
        case 'Link':
            if(tool.hoverObj==null){
                tool.hoverObj=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                world.push(tool.hoverObj)
            }
            
            var link=new Link(tool.tempObj,tool.hoverObj,Vector.diff(tool.tempObj.currPos,tool.hoverObj.currPos).magnitude)
            if(tool.item=='Rope') link.hide()
            staticObjects.push(link)
            links.push(link)
            break
    }
    tool.tempObj=null
    render()
})