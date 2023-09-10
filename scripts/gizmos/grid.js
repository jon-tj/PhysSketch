function renderGrid(view){
    var gridX = Gridify(view.left,view.right,11*canvas.width/canvas.height)
    var gridY = Gridify(view.bottom,view.top,11)

    ctx.beginPath()
    gridX.forEach((x)=>{
        var xT=view.transformX(x)
        ctx.moveTo(xT,0)
        ctx.lineTo(xT,canvas.height)
    })
    gridY.forEach((y)=>{
        var yT=view.transformY(y)
        ctx.moveTo(0,yT)
        ctx.lineTo(canvas.width,yT)
    })
    ctx.strokeStyle= colors['--editor-accent']
    ctx.stroke()
}

const gridIntevals=[2,5,10]
function Gridify(min,max,wantedAmount=10){
    var optimalSpacing=(max-min)/wantedAmount
    var orderOfMagnitude = Math.pow(10,Math.floor(Math.log10(optimalSpacing)))
    var inc=orderOfMagnitude
    var minDiff=Math.abs(optimalSpacing-inc)
    gridIntevals.forEach((v)=>{
        var x=v*orderOfMagnitude
        var diff=Math.abs(optimalSpacing-x)
        if(diff<minDiff){
            minDiff=diff
            inc=x
        }
    })   
    min=(Math.floor(min/inc)+1)*inc
    var grid=[]
    while(min<max){
        grid.push(min)
        min+=inc
    }
    return grid
}