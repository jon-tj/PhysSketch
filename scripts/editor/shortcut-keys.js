window.addEventListener('keydown',(e)=>{
    switch(e.key){
        case ' ': togglePlay(); break
        case 't': setTool('text'); break
    }
})