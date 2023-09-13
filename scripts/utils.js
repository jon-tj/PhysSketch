function remap(x,min1,max1,min2,max2){
    return (x-min1)/(max1-min1)*(max2-min2)+min2
}
class Vector{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    static dot(u,v){
        return u.x*v.x + u.y*v.y
    }
    static cross(u,v){
        return u.x*v.y-u.y*v.x
    }
    static project(u,v){
        return v.scaled(Vector.dot(u,v)/v.magnitudeSqr)
    }
    static diff(u,v){
        return new Vector(u.x-v.x, u.y-v.y)
    }
    static sum(u,v){
        return new Vector(u.x+v.x, u.y+v.y)
    }
    static get zero(){
        return new Vector(0,0)
    } 
    static down(magnitude){ return new Vector(0,-magnitude) }
    reset(){this.x=0;this.y=0}
    normal(){
        return new Vector(-this.y,this.x).normalize()
    }
    get magnitude(){ return Math.sqrt(this.magnitudeSqr) }
    get magnitudeSqr(){ return this.x*this.x+this.y*this.y }
    get normalized(){ return this.scaled(1/this.magnitude) }
    normalize(){ return this.scale(1/this.magnitude) }
    scaled(s){ return new Vector(this.x*s,this.y*s) }
    scale(s){ this.x*=s;this.y*=s;return this }
    rotated(a){
        var c=Math.cos(a), s=Math.sin(a)
        return new Vector(this.x*c+this.y*s,this.y*c-this.x*s)
    }
    clone(){
        return new Vector(this.x,this.y)
    }
}

const Space = {
    local:'local',
    global:'global',
    centripetal:'centripetal',
}