class TextGizmo{
    constructor(x,y,text,color='white',font=null){
        this.location = new Vector(x,y);
        this.text=text;
        this.color=color;
        this.font=font;
    }
    render(view){
        var xT=view.transformX(this.location.x)
        var yT=view.transformY(this.location.y)
        ctx.fillStyle=this.color
        if(this.font) ctx.font=this.font
        ctx.fillText(this.text,xT,yT)
    }
}