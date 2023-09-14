
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

        var renderRadius=this.radius*view.dy
        if(tool.hoverObj==this)
            renderRadius+=2
        
        ctx.beginPath();
        ctx.arc(xT, yT, renderRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class ForceField{
    constructor(x,y,radius=3,forceSpace=Space.centripetal){
        this.currPos = new Vector(x,y)
        this.radius = radius
        this.forceSpace = forceSpace
        this.axis = new Vector(5,0)
        this.color = '#f22'
    }
    apply(particle){
        var dir = Vector.diff(this.currPos,particle.currPos)
        // May need to adjust the tiny value here to achieve stability (since 2d /= 3d)
        var multiplier = 1/(1e-1 + particle.mass*dir.magnitudeSqr)
        switch(this.forceSpace){
            default:
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
        var xT=view.transformX(this.currPos.x)
        var yT=view.transformY(this.currPos.y)
        var radius=this.radius*view.dx
        ctx.beginPath();
        ctx.arc(xT, yT, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.stroke()
        
        ctx.beginPath();
        var circleRadius=tool.hoverObj==this?7:5
        ctx.arc(xT, yT, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()

        switch(this.forceSpace){
            default:
                renderVector(this.axis.scaled(0.3*view.dy),xT,yT,this.color)
                break
            case Space.centripetal:
                renderVector(this.axis.scaled(0.3*view.dy),xT,yT,this.color)
                break
        }

    }
}

class Pole{
    /*
        Similar to link, except collides with other objects.
    */

    constructor(a,b,length){
        this.a=a
        this.b=b
        this.length=length
        this.color = 'white'
    }
    apply(){
        var axis=Vector.diff(this.a.currPos,this.b.currPos)
        var dist=axis.magnitude
        var halves = this.a.kinematic || this.b.kinematic? 1:0.5
        axis.scale(halves*(this.length-dist)/(dist))
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
    dependsOn(particle){
        return this.a==particle || this.b==particle
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
    dependsOn(particle){
        return this.a==particle || this.b==particle
    }

}
class Spring extends Link {
    constructor(a,b,length){
        super(a,b,length,0.005)
        this.color="#2f2"
    }
    render(view){
        ctx.beginPath()
        var pos = this.a.currPos.clone()
        var steps=30
        var incPos = Vector.diff(this.b.currPos, this.a.currPos).scale(1/(steps+1))
        var norm = incPos.normal().scale(view.dy)
        var incI=2*Math.PI/(steps+1)
        ctx.moveTo(view.transformX(pos.x),view.transformY(pos.y))
        for(var i=incI;i<=2*Math.PI; i+=incI){
            pos=Vector.sum(pos,incPos)
            var y=Math.sin(i*2.5)*0.001
            ctx.lineTo(view.transformX(pos.x+norm.x*y),view.transformY(pos.y+norm.y*y))
        }
        ctx.strokeStyle=this.color
        ctx.stroke()
    }
}

class Piston extends VerletObject {
    constructor(x,y,mass,size,color="#ddd"){
        super(x,y,mass,true)
        this.size=size
        this.color=color
        this.extendedState=0 //goes from 0 to 1
        this.extended=false
        this.angle=Math.PI/4
        this.powerInlet=new Vector(0,-0.3)
    }
    render(view){
        var xT=view.transformX(this.currPos.x)
        var yT=view.transformY(this.currPos.y)

        body:renderBox(view,xT,yT,0,0,this.size,this.size*0.6,this.angle,this.color)
        axis:renderBox(view,xT,yT,0,(0.3+this.extendedState*0.3)*this.size,this.size*0.2,this.size*this.extendedState*0.6,this.angle,this.color)
        face:renderBox(view,xT,yT,0,(0.35+this.extendedState*0.6)*this.size,this.size,this.size*0.1,this.angle,this.color,true)
        
        // center
        ctx.beginPath();
        var circleRadius=tool.hoverObj==this&&tool.hoverObjType!="action"?7:5
        ctx.arc(xT, yT, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()
        
        // power inlet
        ctx.save();
        ctx.translate(xT, yT);
        ctx.rotate(this.angle);
        this.powerInlet.y=-this.powerInlet.y
        var pT=this.powerInlet.scaled(this.size*view.dy)
        this.powerInlet.y=-this.powerInlet.y
        ctx.translate(pT.x, pT.y);
        ctx.beginPath();
        var circleRadius=tool.hoverObj==this&&tool.hoverObjType=="action"?7:5
        ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#ff2";
        ctx.stroke()
        ctx.restore()
    }
    activate(){
        this.extended=!this.extended
    }
    step(dt){
        super.step(dt)
        if(this.extended){
            this.extendedState+=dt*20
            this.extendedState=Math.min(this.extendedState,1)
        }else{
            this.extendedState-=dt*20
            this.extendedState=Math.max(this.extendedState,0)
        }
    }
    extend
}

class Generator extends VerletObject{
    constructor(x,y,radius=0.1,density=0.5,color="white"){
        super(x,y,density*Math.PI*radius*radius,true)
        this.density = density
        this.radius=radius
        this.color=color
        this.time=0
        this.interval=0.5
        this.enabled=true
        this.powerInlet=new Vector(0,-0.2)
        this.weakCollision=true
        this.velocity=10
        this.angle=Math.PI/4
        this.spread=Math.PI/3
    }
    step(dt){
        super.step(dt)
        if(!this.enabled) return
        this.time+=dt
        if(this.time>this.interval){
            this.time=0
            var fwd=this.forward
            var p=new Particle(this.currPos.x+fwd.x*this.radius*2,this.currPos.y+fwd.y*this.radius*2,this.radius,this.density)
            p.currPos=Vector.sum(p.currPos,fwd.scale(this.velocity*dt))
            p.color=this.color
            world.push(p)
        }
    }
    get forward(){
        return new Vector(Math.sin(this.angle),Math.cos(this.angle));
    }
    render(view){
        var xT=view.transformX(this.currPos.x)
        var yT=view.transformY(this.currPos.y)

        // center
        ctx.beginPath();
        var circleRadius=tool.hoverObj==this&&tool.hoverObjType!="action"?7:5
        ctx.arc(xT, yT, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill()

        var target=Vector.sum(this.currPos,this.forward.scale(this.velocity*0.1))
        
        var xTarget=view.transformX(target.x)
        var yTarget=view.transformY(target.y)
        ctx.moveTo(xT,yT)
        ctx.lineTo(xTarget,yTarget)
        ctx.strokeStyle = this.color;
        ctx.stroke()
        ctx.beginPath();
        circleRadius=this.spread*view.dy*0.3
        ctx.arc(xTarget, yTarget, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke()
        
        // power inlet
        ctx.save();
        ctx.translate(xT, yT);
        ctx.rotate(this.angle);
        this.powerInlet.y=-this.powerInlet.y
        var pT=this.powerInlet.scaled(view.dy)
        this.powerInlet.y=-this.powerInlet.y
        ctx.translate(pT.x, pT.y);
        ctx.beginPath();
        var circleRadius=tool.hoverObj==this&&tool.hoverObjType=="action"?7:5
        ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "#ff2";
        ctx.stroke()
        ctx.restore()
    }
    activate(){
        this.enabled=!this.enabled
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