/*enum*/ const systemClosure={
    closed:'closed',
    floor:'floor',
    open:'open',
}
const environment={
    g:9.81,
    systemClosure:systemClosure.floor
}

const simulation={
    playing:false,
    enableDrag:false,
    verletSubsteps:4
}
