class Collider{
    constructor(parent,check,convex){
        this.parent = parent;
        this.check = check // function
        this.convex = convex // bool
        this.colliders = []
        this.params = {}
    }

    Check(collider,step=true){
        // Should be called for each collider in the same world chunk.
        // Uses this.check(collider,distance) to determine if we are colliding.
        var d=Vector.diff(collider.parent.location,this.parent.location)
        var distance=d.magnitude
        d.scale(1/(distance*30))
        d.x/=distance*30
        d.y/=distance*30
        var collides=this.check(collider,distance)
        this.colliders.length=0
        if(collides && step){
            if(this.convex){
                collider.parent.location.x+=d.x
                collider.parent.location.y+=d.y
                this.parent.location.x-=d.x
                this.parent.location.y-=d.y
                this.colliders.push(collider)
            }
        }
        return collides
    }

    //#region primitive colliders
    static Circle(parent,radius){
        var c= new Collider(parent,(c,d)=>{
            if(c.params.radius){
                return d<radius+c.params.radius
            }
        },true)
        c.params.radius=radius
        return c
    }
    //#endregion
}

class Particle extends VerletObject{
    constructor(x=0,y=0,radius=0.1,density=5/*[g/ml]*/){
        super(x,y,density*(Math.PI*radius*radius))
        //this.collider =Collider.Circle(this,radius)
        this.radius=radius
        this.color="white"
        this.density=density
    }
    render(view){
        var xT=view.transformX(this.currPos.x)
        var yT=view.transformY(this.currPos.y)
        
        ctx.beginPath();
        ctx.arc(xT, yT, this.radius*view.dy, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ForceField{
    constructor(x,y,radius=3,forceSpace=Space.centripetal){
        this.location = new Vector(x,y)
        this.radius = radius
        this.forceSpace = forceSpace
        this.axis = new Vector(5,0)
        this.color = '#f22'
    }
    apply(particle){
        var dir = Vector.diff(this.location,particle.currPos)
        // May need to adjust the tiny value here to achieve stability (since 2d /= 3d)
        var multiplier = 1/(1e-1 + particle.mass*dir.magnitudeSqr)
        switch(this.forceSpace){
            case Space.global:
                particle.accelerate(this.axis.scaled(multiplier))
                break
            case Space.local:
                particle.accelerate(this.axis.scaled(multiplier))
                break
            case Space.centripetal:
                dir.scale(multiplier)
                particle.accelerateXY(
                    dir.x*this.axis.x-dir.y*this.axis.y,
                    dir.y*this.axis.x+dir.x*this.axis.y
                )
                break
        }
    }
    render(view){
        var xT=view.transformX(this.location.x)
        var yT=view.transformY(this.location.y)
        var radius=this.radius*view.dx
        ctx.beginPath();
        ctx.arc(xT, yT, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.stroke()
        
        ctx.beginPath();
        ctx.arc(xT, yT, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()
    }
}

class Link{
    /*
        Represents an axis between two particles that can be rigid or springy.
        To make the link rigid, set spring=0.
    */
    constructor(a,b,length,rigidity=1 ){
        this.a=a
        this.b=b
        this.length=length
        this.rigidity=rigidity
        this.color = '#f22'
        this.hidden=false
    }
    hide(){
        this.hidden=true
        return this
    }
    apply(){
        var axis=Vector.diff(this.a.currPos,this.b.currPos)
        var dist=axis.magnitude
        var halves = this.a.kinematic || this.b.kinematic? 1:0.5
        axis.scale(this.rigidity*halves*(this.length-dist)/(dist))
        if(!this.a.kinematic)
            this.a.currPos=Vector.sum(this.a.currPos,axis)
        if(!this.b.kinematic)
            this.b.currPos=Vector.diff(this.b.currPos,axis)
    }
    render(view){
        ctx.beginPath()
        ctx.moveTo(view.transformX(this.a.currPos.x),view.transformY(this.a.currPos.y))
        ctx.lineTo(view.transformX(this.b.currPos.x),view.transformY(this.b.currPos.y))
        ctx.strokeStyle=this.color
        ctx.stroke()
    }

}

class Softbody extends VerletObject{
    /*
        Can be modeled with springs connecting all the convex shapes, that is:
        For each vertice of the polygon, every other vertice that can be hit by raycasting
        without leaving the polygon should be connected with a spring.
        For computational efficiency, we put weights on the spring and remove springs
        that are anchored close together/are almost parallel.
    */
}