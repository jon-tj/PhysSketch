/*
    Contains logic for generating menu stuff, endpoints for navbar and toolbox buttons.
*/

const navbar={
    title:document.querySelector('input#title'),
    container:document.querySelector('section#navbar'),
    btnPlay:document.querySelector('button#play>img'),
    toolOptions:document.querySelector('#tool-options'),
    objectsList:document.querySelector('#objects-list'),
}

const toolbox={
    container:document.querySelector('aside#toolbox'),
}

function generateObjectsList(){
    // Might want to generate items dynamically (?)
    // Set the corresponding click events
    var objs=navbar.objectsList.children
    for(var i=0;i<objs.length;i++)
        objs[i].addEventListener('click',(e)=>setTool('create',e.target.innerText))
}
generateObjectsList()

function togglePlay(){
    simulation.playing = !simulation.playing
    if(simulation.playing) navbar.btnPlay.src="./art/icons/pause.png"
    else navbar.btnPlay.src="./art/icons/play.png"
}

navbar.title.addEventListener("keydown",()=>{
    setTimeout(() => {
        // keydown is called earlier than keyup, but before 
        // the value is updated, so we need to wait a frame.
        var title=navbar.title.value
        if(title.length==0) title="New sketch"
        document.title="PhysSketch | "+title
    }, 1);
})

function setTool(type,item=null) {
    tool.type = type
    if(item) tool.item = item
    toggleSettingsPane(true)
}

function toggleSettingsPane(display=null){
    if(toolbox.container.style.left =="0px"){
        if(display==false || display==null)
            toolbox.container.style.left=-toolbox.container.clientWidth+'px'
    }
    else{
        if(display==true || display==null)
            toolbox.container.style.left='0px'
    }
}

function toggleSystemOpen(sender){
    var img=sender.children[0]
    var i=img.src.split('system_')[1]
    switch(i){
        case 'floor.png':
            environment.floor = false
            img.src='./art/icons/system_open.png'
            break;
        case 'open.png':
            environment.closed=true
            img.src='./art/icons/system_closed.png'
            break;
        case 'closed.png':
            environment.closed=false
            environment.floor = true
            img.src='./art/icons/system_floor.png'
            break;
    }
}
function toggleGrid(){
    displayGrid = !displayGrid
    render()
}