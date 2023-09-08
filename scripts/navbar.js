/*
    Contains endpoints for navbar and toolbox buttons.
*/

const navbar={
    title:document.querySelector('input#title'),
    container:document.querySelector('section#navbar'),
    btnPlay:document.querySelector('button#play>img'),
    toolOptions:document.querySelector('#tool-options')
}
const toolbox={
    container:document.querySelector('aside#toolbox'),
}

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

function toggleToolbox(){
    if(toolbox.container.style.left =="0px")
        toolbox.container.style.left=-toolbox.container.clientWidth+'px'
    else
        toolbox.container.style.left='0px'
}