const colors={}
const stylesheetElement = document.querySelector('link#theme')
const colorLabels=[
    "--editor-bg",
    "--editor-primary",
    "--editor-accent"
]

function getStyleColors(){
    var c=getComputedStyle(document.documentElement)
    colorLabels.forEach(s => {
        colors[s]=c.getPropertyValue(s);
    });
}

function setTheme(theme){
    stylesheetElement.href = './styles/themes/'+theme+'.css'
    setTimeout(()=>{
        getStyleColors()
        if(render) render()
    },1)
}

getStyleColors()