class VerletObject{
    /*
        Represents the basic Physics particle primitve.
    */
    constructor(x,y,mass,kinematic=false){
        this.mass = mass/*[kg]*/
        // We store both current and previous positions to *deduce* velocity.
        // This has the bonus of being able to constrain the particle without
        // needing to worry about velocity.
        this.currPos = new Vector(x,y)/*[m]*/
        this.prevPos = new Vector(x,y)/*[m]*/
        this.acc = new Vector()/*[m/s^2]*/
        this.kinematic = kinematic
    }
    
    step(dt/*[s]*/){
        if(this.kinematic) return
        var velocity = Vector.diff(this.currPos,this.prevPos)
        this.prevPos = this.currPos
        this.currPos = Vector.sum(
            this.currPos,
            Vector.sum(
                velocity,
                this.acc.scale(dt*dt)
            )
        )
        this.acc.reset()
    }
    
    accelerateY(y){ this.acc.y+=y }
    accelerateX(x){ this.acc.x+=x }
    accelerateXY(x,y){
        this.acc.x+=x
        this.acc.y+=y
    }
    accelerate(a){
        this.acc.x+=a.x
        this.acc.y+=a.y
    }

    /* Some densities (in kg/m^3):
        Water: ~ 1000 kg/m^3
        Air: 1.293 kg/m^3
    */
    drag(fluid_density=1.293/*[kg/m^3]*/){
        var velocity = Vector.diff(this.currPos,this.prevPos)
        this.accelerate(velocity.scale(-500*fluid_density*velocity.magnitude/this.mass))
    }

    buoyancy(fluid_density=1.29/*[kg/m^3]*/){
        var velocity = Vector.diff(this.currPos,this.prevPos)
        this.accelerate(velocity.scale(-fluid_density*velocity.magnitude))
    }
}