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
        d=d.scale(1/(distance*30))
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

class PhysicsObject{
    constructor(x,y,collider=null){
        this.location = new Vector(x,y)
        this.velocity = new Vector()
        this.collider = collider
        this.conductive = false
        this.temperature = 293 // 20'C
        this.drag = 0.3
        this.rotation = 0
        this.bounce=0.5
        this.mass=1
        this.density=1
    }

    render(view){
        // Is called by the render function. Each class that extends
        // PhysicsObject should override this method to render correctly. 
    }

    step(env,world,dt){
        // Represents a simulation step. Basic forces are modeled by the base class.
        this.location.x += dt*this.velocity.x
        this.location.y += dt*this.velocity.y
        this.velocity.x -= this.drag*dt*this.velocity.x*this.velocity.x
        this.velocity.y -= this.drag*dt*this.velocity.y*this.velocity.y
        this.velocity.y -= env.g*dt
        if(env.closed){
            if(this.location.y<viewport.bottom){
                this.location.y=Math.max(this.location.y,viewport.bottom)
                this.velocity.y*=-this.bounce
            }
            if(this.location.y>viewport.top){
                this.location.y=Math.min(this.location.y,viewport.top)
            }
            if(this.location.x<viewport.left){
                this.location.x=Math.min(this.location.x,viewport.left)
                this.velocity.x*=-this.bounce
            }
            if(this.location.x>viewport.right){
                this.location.x=Math.min(this.location.x,viewport.right)
                this.velocity.x*=-this.bounce
            }
        }else{
            if(this.location.y<viewport.bottom && env.floor){
                this.location.y=Math.max(this.location.y,viewport.bottom)
                this.velocity.y*=-this.bounce
            }
        }
        for(var i=0;i<world.length;i++)
            if(world[i]!=this) this.collider.Check(world[i].collider)
    }
}
class Rigidbody extends PhysicsObject{
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
class Softbody extends PhysicsObject {
    // Can be modeled with springs connecting all the convex shapes, that is:
    // For each vertice of the polygon, every other vertice that can be hit by raycasting
    // without leaving the polygon should be connected with a spring.
    // For computational efficiency, we put weights on the spring and remove springs
    // that are anchored close together/are almost parallel.
}

class Particle extends PhysicsObject{
    constructor(x=0,y=0,radius=0.2,density=0.3,bounce=0.2){
        super(x,y)
        this.collider =Collider.Circle(this,radius)
        this.radius=radius
        this.color="white"
        this.mass=density*(Math.PI*radius*radius)
        this.density=density
    }
    render(view){
        var xT=view.transformX(this.location.x)
        var yT=view.transformY(this.location.y)
        
        ctx.beginPath();
        ctx.arc(xT, yT, this.radius*view.dy, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    step(env,world,dt){
        super.step(env,world,dt)
    }
}