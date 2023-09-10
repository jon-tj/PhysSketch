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

class Rigidbody extends VerletObject{
    constructor(x=0,y=0,polygon=null){
        if(polygon==null){
            polygon=[
                {x:-1,y:-1},
                {x:1,y:-1},
                {x:1,y:1},
                {x:-1,y:1},
            ]
        }
        const collider =new Collider(this,(c,d)=>{
            //..?
        },true); // Set to convex for debugging purposes
        super(x,y,collider)
        this.polygon = polygon
    }
    step(env,world,dt){
        super.step(env,world,dt)
    }
}
class Softbody extends VerletObject {
    // Can be modeled with springs connecting all the convex shapes, that is:
    // For each vertice of the polygon, every other vertice that can be hit by raycasting
    // without leaving the polygon should be connected with a spring.
    // For computational efficiency, we put weights on the spring and remove springs
    // that are anchored close together/are almost parallel.
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