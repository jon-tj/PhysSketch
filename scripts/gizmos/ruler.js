class RulerGizmo{
    constructor(x1,y1){
        this.start = new Vector(x1,y1);
        this.currPos=new Vector(x1,y1);
        this.end=new Vector(x1,y1);
    }
    render(view){
        var xT0=view.transformX(this.start.x)
        var xT1=view.transformX(this.end.x)
        var yT0=view.transformY(this.start.y)
        var yT1=view.transformY(this.end.y)
        ctx.strokeStyle="#ddd"
        ctx.fillStyle="#ddd"
        ctx.beginPath()
        //if(this.font) ctx.font=this.font
        ctx.save()
        ctx.translate((xT0+xT1)*0.5,(yT0+yT1)*0.5)
        var angle=Math.atan2(yT1-yT0,xT1-xT0)
        ctx.rotate(angle)
        ctx.textAlign = "center";
        ctx.font=defaultFont
        var diff=Vector.diff(this.start,this.end)
        ctx.fillText(diff.magnitude.toFixed(4)+" m" ,0,-7)
        ctx.restore()
        ctx.beginPath()
        ctx.moveTo(xT0,yT0)
        ctx.lineTo(xT1,yT1)
        var norm=diff.normal()
        ctx.moveTo(xT0+norm.x*5,yT0-norm.y*5)
        ctx.lineTo(xT0-norm.x*5,yT0+norm.y*5)

        ctx.moveTo(xT1+norm.x*5,yT1-norm.y*5)
        ctx.lineTo(xT1-norm.x*5,yT1+norm.y*5)
        ctx.stroke()
    }
}