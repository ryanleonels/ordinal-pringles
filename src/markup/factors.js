function autoCost(n) {
    return D(100).mul(D(2).pow(data.autoLevels[n]))
}

function buyAuto(n) {
    if(data.chal.active[0] && D(data.autoLevels[n]).gte(1)) return
    if (D(data.markup.powers).lt(autoCost(n))) return
    data.markup.powers = D(data.markup.powers).sub(autoCost(n))
    data.autoLevels[n] = D(data.autoLevels[n]).add(1)
}
function buyMaxAuto() {
    buyAuto(0)
    buyAuto(1)

    if (data.chal.active[0]) return

    let bulkSucc = Decimal.floor(Decimal.log2(Decimal.add(1, D(data.markup.powers).div(Decimal.mul(100, Decimal.pow(2, data.autoLevels[0]))))))
    if (D(data.markup.powers).lte('ee15')) data.markup.powers = D(data.markup.powers).sub(Decimal.pow(2, bulkSucc).sub(1).mul(100).mul(Decimal.pow(2, data.autoLevels[0])))
    data.autoLevels[0] = D(data.autoLevels[0]).add(bulkSucc)

    let bulkMax = Decimal.floor(Decimal.log2(Decimal.add(1, D(data.markup.powers).div(Decimal.mul(100, Decimal.pow(2, data.autoLevels[1]))))))
    if (D(data.markup.powers).lte('ee15')) data.markup.powers = D(data.markup.powers).sub(Decimal.pow(2, bulkMax).sub(1).mul(100).mul(Decimal.pow(2, data.autoLevels[1])))
    data.autoLevels[1] = D(data.autoLevels[1]).add(bulkMax)
}

let maxFactors = [9,8,7,7,6,6,6,6]

function factorCost(n){
    if (!data.omegaMode && data.factors[n].gte(maxFactors[n])) return D(Infinity)
    return Decimal.pow(D(10).pow(n+1), D(2).pow(data.factors[n]))
}
function hasFactor(n){
    return data.markup.shifts >= n+1 || data.baseless.shifts >= n+1
}
function factorEffect(n){
    const mult = bup0Effect()
    const add = hasFactor(n)?D(bup10Effect()):D(0)
    if(data.chal.active[1] || D(data.factors[n]).lt(1)) return D(1).plus(D(add).times(mult))
    return D(data.factors[n]).add(add.add(1)).mul(mult).mul(bup7Effect()).mul(Decimal.pow(Math.max(1+(data.markup.shifts-n-1)/10, 1), [1, 1, 1, 1, 1.3, 1.9, 2.2, 2.3, 2.4][data.markup.shifts]))
}
function factorBoost(){
    let mult = D(1)
    for (let i = 0; i < data.factors.length; i++) {
        mult = mult.mul(factorEffect(i))
    }
    return mult
}
function buyFactor(n){
    if(D(data.markup.powers).lt(factorCost(n)) || data.chal.active[1] || !hasFactor(n)) return
    data.markup.powers = D(data.markup.powers).sub(factorCost(n))
    data.factors[n] = D(data.factors[n]).add(1)
}
function buyMaxFactor(){
    if(data.chal.active[1]) return
    if(data.ord.isPsi) {
        for (let i = 0; i < data.markup.shifts; i++) data.factors[i] = Decimal.max(data.factors[i], maxFactors[i])
        return
        /*for (let i = 0; i < data.factors.length; i++){
            let factorsBuyable = D('10^^10').log10().div(i+1).log2().floor().add(1)
            data.factors[i] = factorsBuyable
        }
        return*/
    }
    let shifts = data.baseless.baseless ? data.baseless.shifts : data.markup.shifts;
    for (let i = shifts-1; i >= 0; i--){
        if(!hasFactor(i)||D(data.markup.powers).lt(1)) break
        let factorsBuyable = D(data.markup.powers).log10().div(i+1).log2().floor().add(1)
        //if (factorsBuyable.gte(1e20)) factorsBuyable = D(1e20)
        let oomDifference = D(i+1).mul(Decimal.pow(2, factorsBuyable).sub(Decimal.pow(2, data.factors[i])));
        if (oomDifference.lt(16) && D(data.markup.powers).lte('ee15')) {
            while (D(data.markup.powers).gte(Decimal.pow(Decimal.pow(10,(i+1)),Decimal.pow(2,data.factors[i])))) {
                buyFactor(i)
            }
        } else {
            if (!data.omegaMode) {
                data.factors[i] = Decimal.max(data.factors[i], Decimal.min(factorsBuyable, maxFactors[i]));
            }
            if (data.omegaMode && factorsBuyable.gte(data.factors[i])) {
                if (D(data.markup.powers).lte('ee15')) data.markup.powers = D(data.markup.powers).sub(Decimal.pow(10, Decimal.mul(i+1, Decimal.pow(2, factorsBuyable.sub(1)))));
                data.factors[i] = factorsBuyable;
            }
        }
    }
}
function buyMaxT1(){
    if(D(data.autoLevels[0]).eq(0) && data.collapse.times === 0) buyAuto(0)
    if(D(data.autoLevels[1]).eq(0) && data.collapse.times === 0) buyAuto(1)
    buyMaxFactor()
    buyMaxAuto()
}

function dyGain(){
    if(data.chal.active[6]) return 0

    //Could move this to a separate function if needed
    data.dy.cap = D(40).mul(iup5Effect()).mul(alephEffect(4)).mul(dupEffect(1)).mul(getSingFunctionEffect(4));

    let boost = 1
    if(data.ord.base < 6 || data.boost.isCharged[11]) boost = bup11Effect()

    if(data.chal.active[4]) {
        let m = 0
        let m2 = data.chal.active[5]?1:(5**data.chal.completions[4])
        for (let i = 0; i < data.boost.hasBUP.length; i++) if(data.boost.hasBUP[i]) ++m
        m = Math.max(m, 1)
        data.dy.cap = D(40).mul(5**m).mul(5**data.chal.completions[4])
        return data.dy.gain.mul((5**m)*m2)
    }

    if(data.chal.active[0]||data.chal.active[1]||data.chal.active[2]||data.chal.active[3]||data.chal.active[5]) return D(data.dy.gain).mul(boost).mul(iup2Effect()).mul(bup3Effect())

    return calcDyGain()
}

/*
 NOTE: The above function contains special logic for challenge cases, as this function was not added until v0.3
*/
function calcDyGain(){
    let chargeBoost = data.boost.isCharged[3] ? bup3Effect() : 1
    let ao2 = inPurification(1) ? getAOREffect(2) : 1
    let boost = (data.ord.base < 6 || data.boost.isCharged[11]) ? bup11Effect() : 1
    return D(data.dy.gain).mul(boost).mul(iup2Effect()).mul(dynamicShiftMultipliers[1]()).mul(chargeBoost).div(ao2)
}

function addFactor8(){
    if (data.factors.length <= 7) data.factors[7] = 0
    var factor8 = document.getElementById("factor7");
    if (!factor8) {
        let button = document.createElement('button');
        button.setAttribute("class", "factor");
        button.setAttribute("id", `factor7`);
        button.setAttribute("onclick", `buyFactor(7)`);
        let text = document.createTextNode(`Factor 8`);
        button.appendChild(text);
        DOM("factorSubPage").appendChild(button);
    } else {
        factor8.style.display = "";
    }
}

function removeFactor8(){
    data.factors.length = 7
    var factor8 = document.getElementById("factor7");
    factor8.style.display = "none";
}
