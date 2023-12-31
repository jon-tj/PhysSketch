var tool = {
    type: null,
    item: null,
    tempObj:null,
    hoverObj:null,
    hoverObjType:'world',
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
canvas.addEventListener("mouseleave",(e)=>{
    mouse.location.x=-100
    render()
})
canvas.addEventListener('mousemove',(e)=>{
    setMouseAttributes(e)
    
    if(mouse.button==2)
        viewport.pan(mouse.offset.x/viewport.dx,mouse.offset.y/viewport.dy)

    switch(tool.type){
        case 'create':
            if(tool.tempObj!=null){
                switch(tool.item){
                    case 'Rope':
                        var createNodeDist=tool.createRadius*2*1.1
                        var dir = Vector.diff(mouse.worldLocation,tool.tempObj.currPos)
                        var dist=dir.magnitude
                        if(dist<createNodeDist)return
                        dir.normalize()
                        var b=new Particle(tool.tempObj.currPos.x+dir.x*createNodeDist,tool.tempObj.currPos.y+dir.y*createNodeDist,tool.createRadius)
                        var link=new Link(tool.tempObj,b,createNodeDist) //Vector.diff(tool.tempObj.currPos,b.currPos).magnitude
                        //link.hide()
                        world.push(b)
                        links.push(link)
                        tool.tempObj=b
                        break
                    case 'Ruler':
                        tool.tempObj.end.x=mouse.worldLocation.x
                        tool.tempObj.end.y=mouse.worldLocation.y
                        tool.tempObj.currPos=Vector.sum(tool.tempObj.start,tool.tempObj.end).scale(0.5)
                        break
                }
            }
            break
        case 'cut':
            if(mouse.button==1) editorCut()
            break
    }

    // Find hoverObj
    tool.hoverObj=null
    var minDist=20/*[px]*/ // if distance to higher than this, hoverObj is set to null.
    function findClosestObject(o,objType){
        for(var i=0;i<o.length;i++){
            if(o[i].currPos==null)continue
            var dx = viewport.transformX(o[i].currPos.x)-mouse.location.x
            var dy = viewport.transformY(o[i].currPos.y)-mouse.location.y
            var dist = Math.sqrt(dx * dx + dy * dy)
            //console.log(dist)
            if(dist<=minDist){
                minDist=dist
                tool.hoverObjType=objType
                tool.hoverObj=o[i]
            }
        }
    }
    findClosestObject(staticObjects,'static')
    findClosestObject(world,'world')
    findClosestObject(forces,'forces')
    for(var i=0;i<world.length;i++){
        if(world[i].powerInlet==null)continue
        var pT=world[i].powerInlet.rotated(world[i].angle)
        var dx = viewport.transformX(world[i].currPos.x+pT.x)-mouse.location.x
        var dy = viewport.transformY(world[i].currPos.y+pT.y)-mouse.location.y
        var dist = Math.sqrt(dx * dx + dy * dy)
        if(dist<=minDist){
            minDist=dist
            tool.hoverObjType='action'
            tool.hoverObj=world[i]
        }
    }

    render()
})
window.addEventListener('wheel',(e)=>{
    if(!keys.Shift){
        viewport.zoom(e.deltaY)
        render()
    }else{
        var factor=1.4
        if(e.deltaY<0) factor=1/factor
        tool.createRadius*=factor
        render()
    }
})
canvas.addEventListener('mousedown',(e)=>{
    setMouseAttributes(e)
    if(mouse.button!=1) return
    switch(tool.type){
        case 'create':
            switch(tool.item){
                case 'Anchor':
                case 'Particle':
                    var p=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                    world.push(p)
                    if(tool.item=="Anchor"){
                        p.color = "#f22"
                        p.kinematic=true
                    }
                    tool.hoverObj=p
                    break
                case 'Force field':
                    var f=new ForceField(mouse.worldLocation.x,mouse.worldLocation.y)
                    staticObjects.push(f)
                    forces.push(f)
                    tool.hoverObjType='forces'
                    tool.hoverObj=f
                    break
                case 'Wind':
                    var f=new ForceField(mouse.worldLocation.x,mouse.worldLocation.y)
                    f.forceSpace=Space.global
                    f.color="#2f2"
                    staticObjects.push(f)
                    forces.push(f)
                    tool.hoverObjType='forces'
                    tool.hoverObj=f
                    break
                case 'Spring':
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
                case 'Piston':
                    var p=new Piston(mouse.worldLocation.x,mouse.worldLocation.y,10,1)
                    world.push(p)
                    break
                case 'Ruler':
                    var t=new RulerGizmo(mouse.worldLocation.x,mouse.worldLocation.y)
                    staticObjects.push(t)
                    tool.tempObj=t
                    break
                case 'Generator':
                    var p=new Generator(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                    world.push(p)
                    break
            }
            break
        case 'cut':
            editorCut()
            break
        case 'grab':
            if(tool.hoverObj!=null && tool.hoverObj.currPos){
                if(tool.hoverObjType=="action")
                    tool.hoverObj.activate()
                else tool.tempObj=tool.hoverObj
            }
            break
    }
    render()
})
canvas.addEventListener('mouseup',(e)=>{
    if(mouse.button!=1)return
    if(tool.type!='create'){
        tool.tempObj=null
        return
    }
    switch(tool.item){
        case 'Link':
            if(tool.hoverObj==null){
                tool.hoverObj=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                world.push(tool.hoverObj)
            }
            var link=new Link(tool.tempObj,tool.hoverObj,Vector.diff(tool.tempObj.currPos,tool.hoverObj.currPos).magnitude)
            links.push(link)
            break
            
        case 'Spring':
            if(tool.hoverObj==null){
                tool.hoverObj=new Particle(mouse.worldLocation.x,mouse.worldLocation.y,tool.createRadius)
                world.push(tool.hoverObj)
            }
            var link=new Spring(tool.tempObj,tool.hoverObj,Vector.diff(tool.tempObj.currPos,tool.hoverObj.currPos).magnitude)
            links.push(link)
            break
        case 'Text': // Needs to be in mouseup to not overwrite the focus set on the text editor!
            if(tool.hoverObj==null || tool.hoverObj.text==null){
                var t=new TextGizmo(mouse.worldLocation.x,mouse.worldLocation.y,"Text")
                staticObjects.push(t)
                tool.tempObj=t
            }else{
                if(tool.hoverObj.text!=null){
                    tool.tempObj=tool.hoverObj
                }
            }
            showTextEditor(tool.tempObj.text,(text)=>{
                if(tool.tempObj!=null){
                    tool.tempObj.text=text
                    tool.tempObj.calculateWidth()
                    render()
                }
            })
            break
    }
    if(tool.item!="Text")
    tool.tempObj=null
    render()
})

function editorCut(){
    if(tool.hoverObj!=null){
        if(tool.hoverObjType=='world'){
            world.splice(world.indexOf(tool.hoverObj),1)
            for(var i=links.length-1;i>=0;i--){
                if(links[i].dependsOn(tool.hoverObj)){
                    links.splice(i,1)
                }
            }
            render()
        }
        if(tool.hoverObjType=='static'){
            staticObjects.splice(staticObjects.indexOf(tool.hoverObj),1)
            render()
        }
        if(tool.hoverObjType=='forces'){
            staticObjects.splice(staticObjects.indexOf(tool.hoverObj),1)
            forces.splice(forces.indexOf(tool.hoverObj),1)
            render()
        }
    }
}

textEditorElement = document.querySelector('#text-editor')
textEditorContainer = document.querySelector('#text-editor-container')
function showTextEditor(text, onchange){
    textEditorElement.value = text
    textEditorElement.setSelectionRange(0, text.length)
    textEditorContainer.style.display = 'block'
    textEditorElement.onchange = ()=>{onchange(textEditorElement.value)}
    textEditorElement.focus()
}