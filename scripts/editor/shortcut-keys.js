window.addEventListener('keydown',(e)=>{
    switch(e.key){
        case ' ': togglePlay(); break
        case 't': setTool('text'); break
        case 'p': setTool('create','Particle'); break
    }
})