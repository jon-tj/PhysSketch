
// If youre looking for list of objects in simulation,
// refer to 'world' in [render.js] ;)

var dt = 0.01/*[s]*/ // increase loop interval for more stable simulation

// Set up main simulation loop
setInterval(()=>{
    
    if(simulation.playing){
        var sim_dt = dt/simulation.verletSubsteps

        
        for(var s=0; s<simulation.verletSubsteps; s++){

            // Integration step: all physics objects step using Velvet integration.
            for(var i=0; i<world.length; i++){
                world[i].step(sim_dt)
                world[i].accelerateY(-environment.g)
                if(simulation.enableDrag) world[i].drag()
            }

            // Apply forces from force fields ...
            for(var i=0; i<world.length; i++)
                forces.forEach((f)=>f.apply(world[i]))
            // ... and links ...
            for(var i=0; i<links.length; i++)
                links[i].apply()
            // ... and grab
            if(tool.type=="grab" && tool.tempObj!=null){
                if(tool.tempObj.accelerate!=null && tool.tempObj.kinematic!=true)
                    tool.tempObj.accelerate(Vector.diff(tool.tempObj.currPos,mouse.worldLocation).scale(-10))
                else{
                    tool.tempObj.currPos.x=mouse.worldLocation.x
                    tool.tempObj.currPos.y=mouse.worldLocation.y
                    tool.tempObj.prevPos.x=mouse.worldLocation.x
                    tool.tempObj.prevPos.y=mouse.worldLocation.y
                }
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
                        if(world[i].currPos.y<viewport.bottom){
                            world[i].currPos.y=viewport.bottom
                            world[i].prevPos.x+=(world[i].currPos.x-world[i].prevPos.x)*dt
                        }
                        world[i].currPos.y=Math.min(world[i].currPos.y,viewport.top)
                        world[i].currPos.x=Math.max(world[i].currPos.x,viewport.left)
                        world[i].currPos.x=Math.min(world[i].currPos.x,viewport.right)
                        break
                    case systemClosure.floor:
                        if(world[i].currPos.y<viewport.bottom){
                            world[i].currPos.y=viewport.bottom
                            world[i].prevPos.x+=(world[i].currPos.x-world[i].prevPos.x)*dt
                        }
                        break
                }
            }
        }

        render()
    }else{
        if(tool.type=="grab" && tool.tempObj!=null){
            if(tool.tempObj.start){
                var offset=Vector.diff(mouse.worldLocation,tool.tempObj.currPos)
                tool.tempObj.start=Vector.sum(offset,tool.tempObj.start)
                tool.tempObj.end=Vector.sum(offset,tool.tempObj.end)
            }
            tool.tempObj.currPos.x=mouse.worldLocation.x
            tool.tempObj.currPos.y=mouse.worldLocation.y
            if(tool.tempObj.prevPos){
                tool.tempObj.prevPos.x=mouse.worldLocation.x
                tool.tempObj.prevPos.y=mouse.worldLocation.y
            }
            render()
        }
    }
},dt*1000) 