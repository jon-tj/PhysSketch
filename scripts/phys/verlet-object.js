class VerletObject{
    /*
        Represents the basic Physics particle primitve.
    */
    constructor(x,y,mass){
        this.mass = mass/*[kg]*/
        // We store both current and previous positions to *deduce* velocity.
        // This has the bonus of being able to constrain the particle without
        // needing to worry about velocity.
        this.currPos = new Vector(x,y)/*[m]*/
        this.prevPos = new Vector(x,y)/*[m]*/
        this.acc = new Vector()/*[m/s^2]*/
    }
    
    step(dt/*[s]*/){
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

    /* Some densities (listed in g/ml):
        Water: ~ 1 g/ml
        Air: 0.001293 g/ml
    */
    drag(fluid_density=0.001293/*[g/ml]*/){
        var velocity = Vector.diff(this.currPos,this.prevPos)
        this.accelerate(velocity.scale(-fluid_density*velocity.magnitude))
    }

    buoyancy(fluid_density=0.001293/*[g/ml]*/){
        var velocity = Vector.diff(this.currPos,this.prevPos)
        this.accelerate(velocity.scale(-fluid_density*velocity.magnitude))
    }
}