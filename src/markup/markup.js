let extraT1 = () => data.collapse.hasSluggish[0] ? 1 : 0
function updateMarkupHTML(){
    var factor8 = document.getElementById('factor7');
    if (data.base2 && !factor8) addFactor8();

    DOM("powersText").innerText = `You have ${formatWhole(data.markup.powers)} Ordinal Powers`

    DOM("markupButton").innerHTML =
        data.ord.isPsi&&data.ord.ordinal.eq(GRAHAMS_VALUE)&&data.boost.times===0&&!data.collapse.hasSluggish[0]&&data.ord.base>=3?`Base 2 is required to go further...`:
        data.ord.isPsi?`Markup and gain ${ordinalDisplay('', data.ord.ordinal.plus(1), data.ord.over, data.ord.base, ((data.ord.displayType === "BMS") || (data.ord.displayType === "Y-Sequence")) ? Math.max(data.ord.trim, 4) : 4)} (I)`:
        data.ord.ordinal.gte(data.ord.base**2)?`Markup and gain ${formatWhole(totalOPGain())} Ordinal Powers (I)`:`${ordinalDisplay("H", data.ord.base**2, 0, data.ord.base, ordinalDisplayTrim(), false)}(${data.ord.base}) is required to Markup...`

    DOM("factorShiftButton").innerHTML = data.ord.base===3&&!data.omegaMode?(data.boost.times>0||data.collapse.hasSluggish[0])&&(!data.base2)?`Perform a Factor Shift<br>Requires: ?????`:`Perform a Factor Shift<br>Requires: Graham's Number (${ordinalDisplay("H", 109, 0, 3, data.ord.trim, true, true)}(3))`:
        `Perform a Factor Shift (H)<br>Requires: ${format(getFSReq())} Ordinal Powers`
    if (data.ord.base===3&&data.base2&&!data.omegaMode&&(data.boost.times>0||data.collapse.hasSluggish[0])) {
        DOM("factorShiftButton").innerHTML =
            data.base2Shift === 1 ? `Perform a Factor Shift<br>Requires: Graham's Number (${ordinalDisplay("H", GRAHAMS_VALUE, 0, 3, data.ord.trim, true, true)}(3))` :
            data.base2Shift === 2 ? `Perform a Factor Shift<br>Requires: BHO (${ordinalDisplay("H", BHO_VALUE, 0, 3, data.ord.trim, true, true)}(3))` :
            data.base2Shift === 3 ? `Perform a Factor Shift<br>Requires: Buchholz's Ordinal (${ordinalDisplay("H", BO_VALUE, 0, 3, data.ord.trim, true, true)}(3))` : `Perform a Factor Shift (H)<br>Requires: ${format(getFSReq())} Ordinal Powers`
    }
    DOM("auto0").innerText = `Successor AutoClicker\nCosts ${format(autoCost(0))} Ordinal Powers`
    DOM("auto1").innerText = `Maximize AutoClicker\nCosts ${format(autoCost(1))} Ordinal Powers`
    let succSpeed = !data.chal.active[4]
        ? D(data.autoLevels[0]).add(extraT1()).mul(t1Auto()).mul(data.dy.level).div(data.chal.decrementy)
        : D(data.autoLevels[0]).add(extraT1()).mul(t1Auto()).div(data.dy.level).div(data.chal.decrementy)
    let maxSpeed = !data.chal.active[4]
        ? D(data.autoLevels[1]).add(extraT1()).mul(t1Auto()).mul(data.dy.level).div(data.chal.decrementy)
        : D(data.autoLevels[1]).add(extraT1()).mul(t1Auto()).div(data.dy.level).div(data.chal.decrementy)
    DOM("autoText").innerText = `Your ${formatWhole(D(data.autoLevels[0]).add(extraT1()))} Successor Autoclickers click the Successor button ${formatWhole(succSpeed)} times/second\nYour ${formatWhole(data.autoLevels[1].add(extraT1()))} Maximize Autoclickers click the Maximize button ${formatWhole(maxSpeed)} times/second`

    for (let i = 0; i < data.factors.length; i++) {
        DOM(`factor${i}`).innerText = hasFactor(i)?`Factor ${i+1} [${data.boost.hasBUP[11]?formatWhole(D(data.factors[i]).add(bup10Effect())):formatWhole(data.factors[i])}] ${formatWhole(factorEffect(i))}x\nCost: ${formatWhole(factorCost(i))} Ordinal Powers`:`Factor ${i+1}\nLOCKED`
    }
    DOM("factorText").innerText = `Your Factors are multiplying AutoClicker speed by a total of ${formatWhole(factorBoost())}x`

    DOM("factorShiftButton").style.borderColor = data.ord.base===3&&data.boost.times===0&&!data.collapse.hasSluggish[0]?`#0000ff`:`#785c13`
    DOM("factorShiftButton").style.color = data.ord.base===3&&data.boost.times===0&&!data.collapse.hasSluggish[0]?`#8080FF`:`goldenrod`

    DOM("dynamicTab").innerText = data.markup.shifts>=(data.dynamicAlwaysOn?0:7)||data.chal.active[4]||data.baseless.baseless?'Dynamic':'???'
    DOM("dynamicText").innerText = `Your Dynamic Factor is ${data.chal.active[4]?'dividing':'multiplying'} AutoClickers by ${format(data.dy.level, 3)}\nIt increases by ${format(dyGain())}/s, and caps at ${format(data.dy.cap)}`
    DOM("dynamicText2").innerText = `Your Dynamic Factor is ${format(data.dy.level, 3)} [+${format(dyGain())}/s]. It caps at ${format(data.dy.cap)}`

    DOM("factorBoostButton").innerHTML = `Perform ${getBulkBoostAmt() < 2 ? `${inAnyPurification() ? `an` : `a`} ${boostName()} Boost` : getBulkBoostAmt()+` ${boostName()} Boosts`} [+${boosterGain()}] (B)<br>Requires ${displayBoostReq()}`
    DOM("factorBoostButton").style.color = data.ord.isPsi&&data.ord.ordinal.gte(boostReq())?'#fff480':'#8080FF'

    if(data.sToggles[6]) updateProgressBar()
}
function boostName(){
    if(!inAnyPurification()) return `Factor`
    return purificationData[data.omega.whichPurification].alt
}
function markup(n=D(1)){
    if(data.boost.times===0 && data.ord.isPsi && data.ord.ordinal.eq(GRAHAMS_VALUE) && !data.collapse.hasSluggish[0] && data.ord.base>=3) return
    if(data.ord.ordinal.lt(data.ord.base**2) && !data.ord.isPsi) return
    if(data.ord.isPsi){
        data.ord.ordinal = data.ord.ordinal.plus(n);
        if (capOrdinalAtBO && data.ord.base===3 && data.ord.ordinal.gt(BO_VALUE)) data.ord.ordinal = D(BO_VALUE)
        return data.markup.powers = Decimal.max(data.markup.powers, D(4e256)) //D('10^^10')
    }

    if(data.chal.active[7]){
        data.markup.powers = D(0)
        data.chal.decrementy = D(1)
    }
    data.ord.isPsi = false
    data.markup.powers = D(data.markup.powers).add(totalOPGain())
    data.ord.ordinal = D(0)
    data.ord.over = D(0)
    data.successorClicks = 0
}
function opMult(){
    let mult = D(bup1Effect())

    let baseReq = data.boost.isCharged[6] ? 4 : 5
    mult = D(mult).add(data.ord.base >= baseReq ? bup6Effect() : 0)

    return mult.mul(alephEffect(2))
}
function opGain(ord = data.ord.ordinal, base = data.ord.base, over = data.ord.over, trim = 0) {
    if(D(ord).eq(data.ord.ordinal) && D(ord).gte(Number.MAX_VALUE) && !data.omegaMode) return D(4e256)
    if(D(D(ord).layer).gt(1000)) {
        if (!data.omegaMode) return D(4e256)
        let ord1 = D(ord)
        ord1.layer = 1000
        let gain1 = opGain(ord1, base, over, trim)
        let layer = D(D(ord).layer)
        let layer1 = D(D(ord1).layer)
        let layerDiff = layer.sub(layer1)
        gain1.layer = Math.min(D(gain1.layer).add(layerDiff).add(0.1).floor().toNumber(), Number.MAX_VALUE)
        return gain1
    }
    if (trim >= 10) return new Decimal(0)
    if(D(ord).eq(data.ord.ordinal)) ord = D(ord)
    //if(data.ord.isPsi && base === 3){
    //    return Math.round(ord / 1e270 + 1) * 1e270
    //}
    if (D(ord).lt(base)) return Decimal.add(ord, over)


    /*if (ord.gte(Decimal.tetrate(base, base))) {
        return Decimal.tetrate(10, opGain(ord.slog(base), base, 0, trim))
    }*/

    let powerOfOmega = Decimal.log(ord.add(0.1), base).floor()
    let highestPower = Decimal.pow(base,powerOfOmega)
    let powerMultiplier = Decimal.floor(ord.add(0.1).div(highestPower))
    let gain = Decimal.pow(10, opGain(powerOfOmega,base,0)).mul(powerMultiplier).add(ord.lt(Decimal.tetrate(base,3)) ? opGain(ord.sub(highestPower.mul(powerMultiplier)),base,over,trim+1) : 0)
    return data.omegaMode ? gain : Decimal.min(4e256, gain);
}
let totalOPGain = () => opGain().mul(opMult()).min(data.omegaMode ? Decimal.tetrate(Number.MAX_VALUE,Number.MAX_VALUE) : 4e256)
function calcOrdPoints(ord = data.ord.ordinal, base = data.ord.base, over = data.ord.over, trim=0) {
    //console.log(ord)
    if (D(ord).toString() === "NaNeNaN") return new Decimal(0)
    if(D(D(ord).layer).gt(1000)) {
        if (!data.omegaMode) return D(4e256)
        let ord1 = D(ord)
        ord1.layer = 1000
        let gain1 = calcOrdPoints(ord1, base, over, trim)
        let layer = D(D(ord).layer)
        let layer1 = D(D(ord1).layer)
        let layerDiff = layer.sub(layer1)
        gain1.layer = Math.min(D(gain1.layer).add(layerDiff).add(0.1).floor().toNumber(), Number.MAX_VALUE)
        return gain1
    }
    let opBase = new Decimal(10)
    if (trim >= 10) return new Decimal(0)
    if (Decimal.lt(ord, base)) {
        return Decimal.add(ord, over)
    } else if (new Decimal(ord).slog(base).lt(base) || data.omegaMode) {
        let powerOfOmega = Decimal.log(new Decimal(ord).add(0.1), base).floor()
        let highestPower = Decimal.pow(base,powerOfOmega)
        let powerMultiplier = Decimal.floor(Decimal.div(new Decimal(ord).add(0.1),highestPower))
        return Decimal.add(Decimal.mul(Decimal.pow(opBase, calcOrdPoints(powerOfOmega,base,0)), powerMultiplier), new Decimal(ord).lt(Decimal.tetrate(base, 3)) ? calcOrdPoints(new Decimal(ord).sub(Decimal.mul(highestPower,powerMultiplier)),base,over,trim+1) : 0)
    } else {
        return new Decimal(opBase).tetrate(calcOrdPoints(new Decimal(ord).slog(base),base,0,trim+1))
    }
}
const fsReqs = [200, 1000, 1e4, 3.5e5, 1e12, 1e21, 5e100, 1e256, Infinity]
function getFSReq(){
    if (data.markup.shifts >= (data.base2 ? 8 : 7) && (data.ord.base != 3 || data.omegaMode)) return Infinity // avoid phantom 1e256 on FS7/FS8
    if (data.ord.isPsi && data.ord.ordinal.gte(GRAHAMS_VALUE) && data.boost.times === 0 && !data.collapse.hasSluggish[0]) return D(0) // avoid being stuck on Graham's Number
    const reqScale = data.chal.active[6] ? (totalBUPs()/2)+1.5 : 1
    const req = fsReqs[data.markup.shifts]**reqScale

    return req > 1e256 ? 1e256 : req
}

function factorShiftConfirm(){
    if(data.baseless.baseless || D(data.markup.powers).lt(getFSReq())) return

    createConfirmation('Are you sure?', 'Performing a Factor Shift will reduce your Base by 1 and unlock a new Factor, but it will reset your Ordinal, Ordinal Powers, Factors, and Automation!', 'No Way!', 'Yes, lets do this.', factorShift)
}

function factorShift(isAuto = false){
    if(data.baseless.baseless) return
    if(data.markup.shifts === 7 && (!isAuto || data.base2)){
        if(data.ord.isPsi && data.ord.ordinal.gte(GRAHAMS_VALUE) && data.boost.times === 0 && !data.collapse.hasSluggish[0]) return boost(true)
        else {
            if (!data.base2) return //createAlert("Failure", "Insufficient Ordinal", "Dang.")
        }
    }

    const req = getFSReq()

    let base2ShiftPoint =
        data.base2Shift === 1 ? GRAHAMS_VALUE :
        data.base2Shift === 2 ? BHO_VALUE :
        data.base2Shift === 3 ? BO_VALUE : 0

    if (data.markup.shifts === 7 && data.ord.base === 3 && !data.omegaMode) {
        if(base2ShiftPoint && (!data.ord.isPsi || data.ord.ordinal.lt(base2ShiftPoint) || !data.base2)) return //createAlert("Failure", "Insufficient Ordinal", "Dang.")
    }
    if(D(data.markup.powers).lt(req)) return //createAlert("Failure", "Insufficient Ordinal Powers", "Dang.")
    if(data.markup.shifts >= 7 + data.base2) return
    if(!data.chal.active[3] && !(data.boost.hasBUP[2] && checkAllIndexes(data.chal.active, true)) && (data.ord.base > (3 - data.base2))) --data.ord.base
    if(data.markup.shifts < 7 + data.base2) ++data.markup.shifts

    if(data.markup.shifts === 7 && !data.dynamicAlwaysOn && !data.chal.active[4]){
        data.dy.level = D(4)
        data.dy.gain = D(0.002)
    }

    if(data.chal.active[4]) data.dy.gain = D(0.002)

    fsReset()
}

function fsReset(){
    data.ord.ordinal = D(0)
    data.ord.over = D(0)
    data.ord.isPsi = false
    data.markup.powers = D(0)
    for (let i = 0; i < data.autoLevels.length; i++) {
        data.autoLevels[i] = D(0)
    }
    for (let i = 0; i < data.factors.length; i++) {
        data.factors[i] = D(0)
    }
}
