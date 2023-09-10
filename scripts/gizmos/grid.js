function renderGrid(view){
    var xT0 = view.transformX(view.left)
    var xT1 = view.transformX(view.right)
    var yT0 = view.transformY(view.top)
    var yT1 = view.transformY(view.bottom)
    var gridX = Gridify(xT0,xT1,11*canvas.width/canvas.height)
    var gridY = Gridify(yT0,yT1,11)

    ctx.beginPath()
    gridX.forEach((xT)=>{
        ctx.moveTo(xT,0)
        ctx.lineTo(xT,canvas.height)
    })
    gridY.forEach((yT)=>{
        ctx.moveTo(0,yT)
        ctx.lineTo(canvas.width,yT)
    })
    console.log(yT0,yT1)
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