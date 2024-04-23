function mainLoop() {
    // Calculate diff and usableDiff
    if(data.lastTick === 0) data.lastTick = Date.now()
    let unadjusted = data.offline ? Math.max((Date.now() - data.lastTick), 0) : data.ms
    let diff = unadjusted * (data.x1000 ? 1000 : 1); // x1000 here!
    // Used for Offline Progress
    let uDiff = diff/1000

    if(D(data.dy.gain).gt(0) && D(data.dy.level).lt(data.dy.cap)) data.dy.level = Decimal.min(data.dy.cap, data.dy.level.add(D(uDiff).mul(dyGain())))
    if(data.boost.hasBUP[11]) data.markup.powers = D(data.markup.powers).add(D(uDiff).mul(bup9Effect()))

    if(data.chal.active[7]) data.chal.decrementy = Decimal.max(1, data.chal.decrementy.mul(decrementyGain().pow(uDiff)))

    if(data.ord.isPsi && data.boost.unlocks[1]) {
        data.incrementy.amt = data.incrementy.amt.plus(incrementyGain().times(uDiff))
        if (data.incrementy.amt.gte(data.incrementy.bestAmt)) data.incrementy.bestAmt = data.incrementy.amt
    }
    if(data.boost.unlocks[3]) {
        data.overflow.bp += getOverflowGain(0)*uDiff
        data.overflow.oc += getOverflowGain(1)*uDiff
    }

    if(data.collapse.hasCUP[7]) data.collapse.cardinals += (data.collapse.bestCardinalsGained/100)*cupEffect(7)*uDiff
    if(data.collapse.hasSluggish[0] && calculateSimpleHardy().gte(10240) && !data.ord.isPsi && D(data.markup.powers).lt(data.omegaMode ? Decimal.tetrate(Number.MAX_VALUE,Number.MAX_VALUE) : 4e256)) data.markup.powers = D(data.markup.powers).add(D(uDiff).mul(totalOPGain()).div(100))

    if(remnantAmt() > 0 && data.omega.alephOmega < remnantAmt()) data.omega.alephOmega += aoGain()*uDiff
    if(data.omega.alephOmega > remnantAmt()) data.omega.alephOmega = remnantAmt()

    data.darkness.negativeCharge = Math.min(negativeChargeCap(), data.darkness.negativeCharge+negativeChargeGain()*uDiff)

    // Run the tick() function to calculate things that rely on normal diff
    tick(diff)

    // Update lastTick
    data.lastTick = Date.now()

    // Check for hotkey usage
    if (controls["s"].pressed) successor(1, true);
    if (controls["m"].pressed) maximize();
    if (controls["i"].pressed) markup();
    if (controls["f"].pressed) { buyMaxFactor(); buyMaxAuto(); }
    if (controls["h"].pressed && !data.baseless.baseless) factorShift();
    if (controls["h"].pressed && data.baseless.baseless) dynamicShift();
    if (controls["b"].pressed) boost(false, false, true);
    if (controls["c"].pressed) collapseConfirm(true);

    // Update Achievements
    checkAchs()

    // Update HTML
    uHTML.update()
}


window.onload = function () {
    let extra = false
    try { extra = load() } catch(e){ console.log('New Save!\nIf you\'re seeing this, welcome :)') }
    console.log(extra)
    uHTML.load()

    if(extra) fixOldSavesP2()

    if(data.collapse.times > 0) makeExcessOrdMarks()

    window.setInterval(function () {
        mainLoop()
    }, data.ms);
}
