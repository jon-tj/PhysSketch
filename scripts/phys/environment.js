const simulation={
    playing:false,
}
const systemClosure={
    closed:'closed',
    floor:'floor',
    open:'open',
}
var environment={ // environment is kept variable to make fast switching easier
    g:9.81,
    systemClosure:systemClosure.floor
}