
var dt = 0.01/*[s]*/ // increase loop interval for more stable simulation

// Set up main simulation loop
setInterval(()=>{
    if(simulation.playing){
        // Integration step: all physics objects step using Velvet integration.
        for(var i=0; i<world.length; i++){
            world[i].step(dt)
            world[i].accelerateY(-environment.g)
        }

        // Check for collisions
        for(var i=0; i<world.length; i++){
            for(var j=i+1; j<world.length; j++){
                var diff=Vector.diff(world[i].currPos,world[j].currPos)
                var dist=diff.magnitude
                var thresh=world[i].radius+world[j].radius
                if(dist<thresh){
                    diff.scale(thresh-dist)
                    world[i].currPos=Vector.sum(world[i].currPos,diff)
                    world[j].currPos=Vector.diff(world[j].currPos,diff)
                }
            }
            switch(environment.systemClosure){
                default: /*No constraints by default*/ break
                case systemClosure.closed:
                    world[i].currPos.y=Math.max(world[i].currPos.y,viewport.bottom)
                    world[i].currPos.y=Math.min(world[i].currPos.y,viewport.top)
                    world[i].currPos.x=Math.max(world[i].currPos.x,viewport.left)
                    world[i].currPos.x=Math.min(world[i].currPos.x,viewport.right)
                    break
                case systemClosure.floor:
                    world[i].currPos.y=Math.max(world[i].currPos.y,viewport.bottom)
                    break
            }
        }

        render()
    }
},dt*1000) 