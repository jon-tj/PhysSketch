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
    normal(){
        return new Vector(-this.y,this.x)
    }
    magnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
}