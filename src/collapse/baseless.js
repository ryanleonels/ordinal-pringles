function initANRebuyables(){
    const container = DOM('anRebuyableContainer')
    for (let i = 0; i < data.baseless.anRebuyables.length/4; i++) {
        let row = document.createElement('div')
        row.className = `aoRow`
        row.id = `anRRow${i}`
        for (let j = 0; j < 4; j++ ){
            let id = i*4+j
            let el = document.createElement('button')
            el.className = 'anRebuyable'
            el.id = `anR${id}`
            el.addEventListener("click", ()=>buyANR(i))
            row.append(el)
        }
        container.append(row)
    }
    for (let i = 0; i < data.baseless.anRebuyables.length; i++) {
        updateANRHTML(i)
    }
}

function updateAlephNullHTML(){
    DOM(`alephNull`).innerHTML = `You have <span style="color: red; font-family: DosisSemiBold">${format(data.baseless.alephNull)} ℵ<sub>0</sub></span>, increasing the RUP1 effect base by <span style="color: red; font-family: DosisSemiBold">${format(alephNullEffects[0]())}</span> and providing <span style="color: red; font-family: DosisSemiBold">${format(alephNullEffects[1]())}</span> free levels of the last Darkness Buyable</span><br>Your <span style="color: #80ce0b; font-family: DosisSemiBold">Singularity</span> is multiplying AutoClicker Speed in the Baseless Realms by <span style="color: #80ce0b; font-family: DosisSemiBold">${singBoostToBaseless(true)}x</span>`
}
function updateDynamicShiftHTML(){
    DOM(`dynamicShift`).style.display = `${data.baseless.baseless ? 'block' : 'none'}`
    DOM(`baselessMultiplierText`).style.display = `${data.baseless.baseless ? 'block' : 'none'}`
    if(data.baseless.baseless){
        DOM(`dynamicShift`).innerHTML = data.baseless.shifts < 7
            ? `<span style="font-size: 1rem">Perform a <span style="color: darkred">Dynamic Shift</span><br>Requires: &omega;<sup>&omega;</sup></span><br>This will unlock Factor ${data.baseless.shifts+1}, perform a Factor Shift reset, multiply your ℵ<sub>0</sub> gain multiplier by ${format(dynamicShiftMultipliers[0](data.baseless.shifts+1))}, multiply your Dynamic gain by ${format(dynamicShiftMultipliers[1](data.baseless.shifts+1))}, and <span style="color: darkred">double your Base</span>`
            : `Perform a <span style="color: darkred; font-size: 1rem"">Dynamic Shift</span><br>The Future Remains Unknown`
        DOM(`baselessMultiplierText`).innerHTML = `Your ℵ<sub>0</sub> gain multiplier is ${format(getBaselessMult(data.baseless.mode)*dynamicShiftMultipliers[0]())}`
    }
}
function updateANRHTML(i){
    DOM(`anR${i}`).innerHTML = `<span style="color: #ce5c0b">${anRebuyableData[i].desc} (${formatWhole(data.baseless.anRebuyables[i])})</span><br>Requires: ${format(getANRCost(i))} ℵ<sub>0</sub><br>Currently: ${format(anRebuyableData[i].eff())}x`
}
function checkANRUnlockHTML(){
    for (let i = 0; i < data.baseless.anRebuyables.length; i++) {
        DOM(`anR${i}`).style.display = anRebuyableData[i].unl() ? `block` : `none`
    }
}

function updateBaselessEnterHTML(id, load=false) {
    if(data.baseless.baseless && !load){
        DOM(`baseless`).children[1].selectedIndex = data.baseless.mode
        return createAlert('Illegal Move!', 'You cannot change the Realm you\'re already in!', 'Dang it!')
    }
    if(load){
        DOM(`baseless`).children[1].selectedIndex = data.baseless.mode
    }

    data.baseless.mode = id
    DOM(`baseless`).children[2].innerHTML = `<br><br>You will be trapped in <span style="color: darkred">Base ${baselessLocks[id]}</span> with Dynamic Shifts providing a ${getBaselessMult(id)}x multiplier to ℵ<sub>0</sub> gain`
}

const baselessMultipliers = [2, 100, 10000]
const baselessLocks = [10, 20, 100]
const baselessNames = ['Baseless', 'Obliterated', 'Forgotten']

const anRebuyableData = [
    {
        desc: "Cardinals boost AutoClickers while in a Baseless Realm",
        eff: () => data.baseless.baseless ? 1 : 1,
        cost: () => 96*data.baseless.anRebuyables[0],
        unl: () => true
    },
    {
        desc: "Boost the Singularity boost to AutoClickers while in Baseless Realms",
        eff: () => 1,
        cost: () => 96*data.baseless.anRebuyables[0],
        unl: () => true
    },

    // Unlocked by a Remnant / Beth Omega Milestone
    {
        desc: "Boost both Hierarchy Successors",
        eff: () => inPurification(1) ? 1 : 1,
        cost: () => 96*data.baseless.anRebuyables[0],
        unl: () => hasAOMilestone(4)
    },
    {
        desc: "Boost the multiplier to ℵ<sub>0</sub> in higher Baseless Realms",
        eff: () => inPurification(0) ? 1 : 1,
        cost: () => 96*data.baseless.anRebuyables[0],
        unl: () => hasAOMilestone(4)
    },
]

function baselessControl(){
    if(!data.baseless.tutorial) createAlert('Welcome!', 'This popup will not be shown again!\nYou cannot respec Booster Upgrades while in this Realm. However, Dynamic Factor is unlocked immediately and the Max All AutoBuyer works all the time! I\'d recommend checking the Dynamic Factor tab, there are some things there that only exist in this realm.', 'Thanks?')
    const gain = data.baseless.baseless ? alephNullGain() : 0

    if(!data.baseless.baseless){
        if(cardinalGain() > data.collapse.bestCardinalsGained) data.collapse.bestCardinalsGained = cardinalGain()
        data.collapse.cardinals += cardinalGain()
    }
    collapseReset()

    data.baseless.tutorial = true
    data.baseless.baseless = !data.baseless.baseless

    DOM(`baseless`).children[0].innerHTML = `${data.baseless.baseless ? 'Exit' : 'Enter'}`

    if(data.baseless.baseless){
        data.ord.base = baselessLocks[data.baseless.mode]
        data.dy.gain = 0.002
    }
    else{
        data.baseless.shifts = 0
        data.baseless.alephNull += gain
        data.ord.base = 10
        DOM(`baseless`).children[2].innerHTML = `<br><br>You will be trapped in <span style="color: darkred">Base ${baselessLocks[data.baseless.mode]}</span> with Dynamic Shifts providing a ${getBaselessMult(data.baseless.mode)}x multiplier to ℵ<sub>0</sub> gain`
    }

    updateDynamicShiftHTML()
    updateAlephNullHTML()
    updateHeaderHTML()
}

function dynamicShift(){
    if(data.ord.ordinal.lt(numberFromOrdinal('&omega;<sup>&omega;</sup>', data.ord.base)) || data.baseless.shifts > 6) return
    ++data.baseless.shifts
    data.ord.base *= 2
    fsReset()
    updateDynamicShiftHTML()
}

function buyANR(i){
    if(data.baseless.alephNull < getAORCost(i)) return
    ++data.baseless.anRebuyables[i]
    updateANRHTML(i)
}

let dynamicShiftMultipliers = [
    (i = data.baseless.shifts) => Math.max(1, getBaselessMult(data.baseless.mode)**i),
    (i = data.baseless.shifts) => Math.max(1, 1000**(i+data.baseless.mode))
]

let alephNullGain = () =>  Math.max(1, Decimal.log10(Decimal.max(data.ord.ordinal,1)).toNumber()*dynamicShiftMultipliers[0]())
let alephNullEffects = [
    () => Math.max(0, Math.log10(data.baseless.alephNull)/10),
    () => Math.max(0, Math.floor(Math.log10(data.baseless.alephNull)))
]
let getBaselessMult = (i) => baselessMultipliers[i]*getANREffect(3)
let singBoostToBaseless = (display = false) => data.baseless.baseless || display
    ? Math.max(1, data.sing.level*getANREffect(1))
    : 1
let getANRCost = (i) => anRebuyableData[i].cost()
let getANREffect = (i) => Math.max(1, anRebuyableData[i].eff())