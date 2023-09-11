const keys={
    Shift:false,
    Control:false
}
window.addEventListener('keydown',(e)=>{
    if(Object.keys(keys).includes(e.key))
        keys[e.key]=true
    switch(e.key){
        case ' ': togglePlay(); break
        case 't': setTool('text'); break
        case 'p': setTool('create','Particle'); break
    }
})
window.addEventListener('keyup',(e)=>{
    if(Object.keys(keys).includes(e.key))
        keys[e.key]=false
})