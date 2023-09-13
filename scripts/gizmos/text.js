class TextGizmo{
    constructor(x,y,text,color='white',font=null){
        this.currPos = new Vector(x,y);
        this.text=text;
        this.color=color;
        if(font==null) font=defaultFont;
        this.font=font;
        ctx.font=font;
        this.width=this.calculateWidth();
    }
    calculateWidth(){
        this.width=ctx.measureText(this.text).width;
        return this.width;
    }
    render(view){
        ctx.textAlign = "center";
        var xT=view.transformX(this.currPos.x)
        var yT=view.transformY(this.currPos.y)
        if(tool.hoverObj==this){
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.4;
            ctx.fillRect(xT-this.width/2-5, yT-15, this.width+10,22);
            ctx.globalAlpha = 1;
        }
        ctx.fillStyle=this.color
        if(this.font) ctx.font=this.font
        ctx.fillText(this.text,xT,yT)
    }
}