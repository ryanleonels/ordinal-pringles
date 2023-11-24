const purificationData = [
    {
        name: "Eternity",
        alt: "Eternal",
        desc: "Each Factor Boost yields only one Booster and Darkness Upgrades are useless",
        boostDesc: "Boosting the effect base of the first Darkness Upgrade by",
        eff: () => 1
    },
    {
        name: "Infinity",
        alt: "Infinite",
        desc: "Alephs except ℵ<sub>1</sub> are useless, Dynamic Factor divides AutoBuyer speed, and RUP2, RUP3, and IUP3 are disabled",
        boostDesc: "Boosting ℵ<sub>1</sub>, ℵ<sub>2</sub>, and ℵ<sub>8</sub> by",
        eff: () => 1,
        special: () => inPurification(1) ? data.dy.level : 1
    },
    {
        name: "Obscurity",
        alt: "Obscure",
        desc: "Your Markup AutoBuyer is equivalent to your FGH successor, your Hierarchies cannot grow, and Charge boosts FGH Successor",
        boostDesc: "Boosting Overcharge gain, Booster Power gain, and both Hierarchy Successors by",
        eff: () => 1,
    },
    {
        name: "Inferiority",
        alt: "Inferior",
        desc: "Incrementy, its upgrades, Charge, and Hierarchies are disabled",
        boostDesc: "Boosting the first and fifth Cardinal Upgrade by",
        eff: () => 1
    }
]
const aoRebuyableData = [
    {
        desc: "ℵ<sub>0</sub> SLIGHTLY boosts ℶ<sub>&omega;</sub> gain",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>0</sub> boosts ℵ<sub>&omega;</sub> gain",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> divides Dynamic Factor gain while Purification 02 is active",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> reduces the Boost req scaling increases while Purification 03 is active",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> multiplies AutoBuyer speed AGAIN while Purification 01 or 04 are active",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> boosts Purification 01 and 04s effects",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> boosts the second BUP in the second column",
        eff: () => 1
    },
    {
        desc: "ℵ<sub>&omega;</sub> boosts the last Cardinal Upgrade",
        eff: () => 1
    },
    /*{
        desc: "ℵ<sub>&omega;</sub> boosts RUP1",
        eff: () => 1
    }
     */
]
const aoMilestoneData = [
    {
        desc: "The first three Singularity Functions are now always active, and unlock a new Singularity Function",
        req: 1
    },{
        desc: "Purification 02 now boosts ℵ<sub>5</sub>",
        req: 96
    },{
        desc: "Purification 03 now boosts the first Overcharge effect",
        req: 96
    },{
        desc: "Unlock a new row of Incrementy Rebuyables",
        req: 96
    },{
        desc: "ℵ<sub>0</sub> now also boosts the RUP2 base and the SGH Successor at a reduced rate",
        req: 96,
        eff: () => 1
    },{
        desc: "Unlock Ω Purification",
        req: 96
    },
]

function initPurification(){
    initPurifications()
    initAORebuyables()
    initAOMilestones()
}
function initPurifications(){
    const container = DOM('purificationContainer')
    for (let i = 0; i < data.omega.purificationIsActive.length; i++) {
        let el = document.createElement('button')
        el.className = 'purification'
        el.id = `purification${i}`
        el.addEventListener("click", ()=>enterPurification(i))
        container.append(el)
        updatePurificationHTML(i)
    }
}
function initAORebuyables(){
    const container = DOM('aoRebuyableContainer')
    for (let i = 0; i < data.omega.aoRebuyables.length/4; i++) {
        let row = document.createElement('div')
        row.className = `aoRow`
        row.id = `aoRRow${i}`
        for (let j = 0; j < 4; j++ ){
            let id = i*4+j
            let el = document.createElement('button')
            el.className = 'aoRebuyable'
            el.id = `aoR${id}`
            el.innerHTML = `<span style="color: #ce280b">${aoRebuyableData[id].desc} (${formatWhole(data.omega.aoRebuyables[id])})</span><br>Cost: ${96} ℵ<sub>&omega;</sub><br>Currently: ${format(aoRebuyableData[id].eff())}x`
            //el.addEventListener("click", ()=>enterPurification(i))
            row.append(el)
        }
        container.append(row)
    }
}
function initAOMilestones(){
    const container = DOM('aoMilestoneContainer')
    for (let i = 0; i < aoMilestoneData.length/3; i++) {
        let row = document.createElement('div')
        row.className = `aoRow`
        row.id = `aoMRow${i}`
        for (let j = 0; j < 3; j++ ){
            let id = i*3+j
            let el = document.createElement('button')
            el.className = 'aoMilestone'
            el.id = `aoM${id}`
            el.innerHTML = `<span style="color: #c2052c">${aoMilestoneData[id].desc}</span><br>Requires: ${aoMilestoneData[id].req} ℶ<sub>&omega;</sub>`
            //el.addEventListener("click", ()=>enterPurification(i))
            row.append(el)
        }
        container.append(row)
    }
}

function updatePurificationTabHTML(){
    DOM(`alephOmega`).innerHTML = `<span style="font-size: 1.1rem">You have <span style="color: #ce0b0b">${format(data.omega.alephOmega)} ℵ<sub>&omega;</sub></span>, multiplying <span style="color: #ce0b0b">AutoBuyer Speed by ${format(aoEffects[0]())}x</span>, <span style="color: #ce0b0b">ℵ<sub>0</sub> gain by ${format(aoEffects[1]())}x</span>, and the <span style="color: #ce0b0b">Hierarchy Effect Cap by ${format(aoEffects[2]())}x</span></span><br>You have <span style="color: #ce0b0b">${format(data.omega.remnants)} ℶ<sub>&omega;</sub></span>, producing <span style="color: #ce0b0b">${format(aoGain())} ℵ<sub>&omega;</sub>/s</span>`
}
function updatePurificationHTML(i){
    DOM(`purification${i}`).innerHTML = `<span style="color: #ce0b0b">Purification of ${purificationData[i].name}</span><br><span style="color: #ce390b">Highest ${purificationData[i].alt} Boost: <b>${data.omega.bestFBInPurification[i]}</b></span><br><span style="color: darkred">${purificationData[i].desc}</brspan><br><span style="color: #ce460b">${purificationData[i].boostDesc} ${format(purificationData[i].eff())}x</span>`
    DOM(`purification${i}`).style.backgroundColor = data.omega.purificationIsActive[i] ? `#120303` : `black`
}

function enterPurification(i){
    if(inAnyPurification() && (i === data.omega.whichPurification)) return exitPurification(i)
    if(inAnyPurification()) exitPurification(i,true)

    collapseReset()
    data.omega.whichPurification = i
    data.omega.purificationIsActive[i] = true

    updatePossiblePurificationHTML()
    updatePurificationHTML(i)
    updateHeaderHTML()
}
function exitPurification(i, swap = false){
    data.omega.remnants += remnantGain()
    if(data.boost.times > data.omega.bestFBInPurification[data.omega.whichPurification]) data.omega.bestFBInPurification[data.omega.whichPurification] = data.boost.times
    if(!swap) collapseReset()

    data.omega.purificationIsActive = Array(data.omega.purificationIsActive.length).fill(false)

    if(swap) updatePurificationHTML(data.omega.whichPurification)
    updatePossiblePurificationHTML()

    data.omega.whichPurification = -1

    updatePurificationHTML(i)
    updateHeaderHTML()
}
function updatePossiblePurificationHTML(){
    if(data.omega.whichPurification === 0) updateAllDUPHTML()
    if(data.omega.whichPurification === 1) updateAllAlephHTML()
    if(data.omega.whichPurification === 2) updateAllBUPHTML()
}

let aoGain = () => data.omega.remnants/1000
let aoEffects = [
    () => 1,
    () => 1,
    () => 1
]

let remnantGain = () => 0
let hasAOMilestone = (i) => data.omega.remnants >= aoMilestoneData[i].req
let inAnyPurification = () => data.omega.purificationIsActive.includes(true)
let inPurification = (i) => data.omega.purificationIsActive[i]
let purificationEffect = (i) => Math.max(purificationData[i].eff(), 1)
