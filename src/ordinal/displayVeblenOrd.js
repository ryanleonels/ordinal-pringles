// Displays Ordinals using Veblen when the value of ord is less than NUMBER.MAX_VALUE
function displayVeblenOrd(ord,over,base,trim = data.ord.trim,forcePsi = false) {
    if(data.ord.isPsi || forcePsi) return displayPsiVeblenOrd(ord, trim)
    if(D(ord).eq(data.ord.ordinal) && D(ord).gt(Number.MAX_VALUE)) return displayInfiniteVeblenOrd(ord, over, base, trim)
    if(D(ord).eq(data.ord.ordinal)) ord = Number(ord)

    ord = Math.floor(ord)
    over = Math.floor(over)
    if(trim <= 0) return `...`
    if(ord < base) return ord+over
    const magnitude = Math.floor(Math.log(ord)/Math.log(base)+1e-14)
    const magnitudeAmount = base**magnitude
    const amount = Math.floor(ord/magnitudeAmount)
    let finalOutput = "&phi;(1)"
    if (magnitude > 1) finalOutput = "&phi;("+displayVeblenOrd(magnitude, 0, base)+")"
    if (amount > 1) finalOutput += amount
    const firstAmount = amount*magnitudeAmount
    if(ord-firstAmount > 0) finalOutput += "+" + displayVeblenOrd(ord-firstAmount, over, base, trim - 1)
    return finalOutput
}

// Displays Ordinals using Veblen when the value of ord is greater than NUMBER.MAX_VALUE
function displayInfiniteVeblenOrd(ord, over, base, trim = data.ord.trim){
    ord = Decimal.floor(ord)
    over = Decimal.floor(over)
    if(trim <= 0) return `...`
    if(ord.lt(base)) return ord.plus(over)
    const magnitude = Decimal.floor(Decimal.ln(ord).div(Decimal.ln(base)).plus(D(1e-14)))
    const magnitudeAmount = D(base).pow(magnitude)
    const amount = Decimal.floor(ord.div(magnitudeAmount))
    let finalOutput = "&phi;(1)"
    if (magnitude.gt(1)) finalOutput = "&phi;("+displayInfiniteVeblenOrd(magnitude, 0, base)+")"
    if (amount.gt(1)) finalOutput += amount
    const firstAmount = amount.times(magnitudeAmount)
    if(ord.sub(firstAmount).gt(0)) finalOutput += "+" + displayInfiniteVeblenOrd(ord.sub(firstAmount), over, base, trim - 1)
    return finalOutput
}

// Displays Ordinals using Veblen and Psi when the value of ord is less than NUMBER.MAX_VALUE
function displayPsiVeblenOrd(ord, trim = data.ord.trim, base = data.ord.base, aboveBHO = false) {
    if(base === 2) return displayBase2PsiVeblenOrd(D(ord), trim)
    if(D(ord).gt(Number.MAX_VALUE)) return displayInfinitePsiVeblenOrd(ord, trim, base)
    ord = Math.floor(ord)
    if(trim <= 0) return "..."
    if(ord >= BHO_VALUE) aboveBHO = true
    if(ord === BHO_VALUE) {
        let finalOutput = "&phi;(1@[1,0])"
        return `${finalOutput.replaceAll('undefined', '')}`
    }
    let maxOrdMarks = (3**(ordMarksVeblen.length-1))*4
    if(maxOrdMarks < Infinity && new Decimal(ord).gt(new Decimal(maxOrdMarks.toString()))) {
        return displayPsiVeblenOrd(maxOrdMarks) + "x" + format(ord/Number(maxOrdMarks),2)
    }
    if(ord <= 0) return (aboveBHO ? "1" : "0")
    if(ord < 4) return extraOrdMarksVeblen[ord]
    const magnitude = Math.floor(Math.log(ord/4)/Math.log(3))
    const magnitudeAmount = 4*3**magnitude
    let finalOutput = ordMarksVeblen[Math.min(magnitude,ordMarksVeblen.length-1)]
    if(finalOutput.includes("x"))finalOutput = finalOutput.replace(/x/, displayPsiVeblenOrd(ord-magnitudeAmount, trim-1, base, aboveBHO))
    if(finalOutput.includes("y"))finalOutput = finalOutput.replace(/y/, displayPsiVeblenOrd(Math.max(ord-magnitudeAmount+1, 1), trim-1, base, aboveBHO))
    return `${finalOutput.replaceAll('undefined', '')}`
}

/*
    Displays Ordinals using Veblen and Psi when the value of ord is greater than NUMBER.MAX_VALUE
*/
function displayInfinitePsiVeblenOrd(ord, trim = data.ord.trim, base = data.ord.base, aboveBHO = false) {
    if(base === 2) return displayBase2PsiVeblenOrd(D(ord), trim)
    if (D(ord).mag === Infinity || isNaN(D(ord).mag) || base < 1) return "Ω"
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    if(trim <= 0) return "..."
    if(ord.gte(BHO_VALUE)) aboveBHO = true
    if(ord.eq(BHO_VALUE)) {
        let finalOutput = "&phi;(1@[1,0])"
        return `${finalOutput}`
    }
    /*let maxOrdMarks = (D(3).pow(ordMarksXStart[ordMarksXStart.length-1])).times(4) //(D(3).pow(ordMarks.length-1)).times(4)
    if(D(ord).gt(maxOrdMarks)) {
        return displayInfinitePsiVeblenOrd(maxOrdMarks) + "x" + format(ord.div(maxOrdMarks),2)
    }*/
    if(ord.lte(0)) return (aboveBHO ? "1" : "0")
    if(ord.lt(4)) return extraOrdMarksVeblen[ord]
    const magnitude = Decimal.floor(Decimal.ln(ord.div(4)).div(Decimal.ln(3)))
    const magnitudeAmount = D(4).times(Decimal.pow(3, magnitude))
    let finalOutput = infiniteOrdMarksVeblen(magnitude) //Decimal.min(magnitude,ordMarksXStart[ordMarksXStart.length-1])
    if(finalOutput.includes("x"))finalOutput = finalOutput.replace(/x/, displayInfinitePsiVeblenOrd(ord.sub(magnitudeAmount), trim-1, base, aboveBHO))
    if(finalOutput.includes("y"))finalOutput = finalOutput.replace(/y/, displayInfinitePsiVeblenOrd(Decimal.max(ord.sub(magnitudeAmount).plus(1), D(1)), trim-1, base, aboveBHO))
    return `${finalOutput.replaceAll('undefined', '')}`
}

// Displays Ordinals using Veblen for base 2 psi ordinals
function displayBase2PsiVeblenOrd(ord, trim = data.ord.trim) {
    if(D(ord).lt(0)) return "0"
    if(D(ord).mag === Infinity || isNaN(D(ord).mag)) return "Ω"
    if (trim <= 0) return "..."
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    // Veblen is no longer well-defined past ψ(I), simply return 1 value per I/Ω subscript (much like Hardy) - otherwise lower levels can simply be enumerated
    let veblenOutput = "&phi;(0)"; // 1
    if (ord.gte(1)) veblenOutput = "&phi;(1)"; // ω
    if (ord.gte(2)) veblenOutput = "&phi;(1,0)"; // ψ(Ω)
    if (ord.gte(3)) veblenOutput = "&phi;(1,&phi;(1))"; // ψ(Ωω)
    if (ord.gte(4)) veblenOutput = "&phi;(&phi;(1),0)"; // ψ(Ω^ω)
    if (ord.gte(5)) veblenOutput = "&phi;(&phi;(1,0),0)"; // ψ(Ω^ψ(Ω))
    if (ord.gte(6)) veblenOutput = "&phi;(&phi;(1,&phi;(1)),0)"; // ψ(Ω^ψ(Ωω))
    if (ord.gte(7)) veblenOutput = "&phi;(&phi;(&phi;(1),0),0)"; // ψ(Ω^ψ(Ω^ω))
    if (ord.gte(8)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(1)</sub>)"; // ψ(Ω_ω)
    if (ord.gte(9)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(1,0)</sub>)"; // ψ(Ω_ψ(Ωω))
    if (ord.gte(10)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(1,&phi;(1))</sub>)"; // ψ(Ω_ψ(Ωω))
    if (ord.gte(11)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(&phi;(1),0)</sub>)"; // ψ(Ω_ψ(Ω^ω))
    if (ord.gte(12)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(&phi;(1,0),0)</sub>)"; // ψ(Ω_ψ(Ω^ψ(Ω)))
    if (ord.gte(13)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(&phi;(1,&phi;(1)),0)</sub>)"; // ψ(Ω_ψ(Ω^ψ(Ωω)))
    if (ord.gte(14)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(&phi;(&phi;(1),0),0)</sub>)"; // ψ(Ω_ψ(Ω^ψ(Ω^ω)))
    if (ord.gte(15)) veblenOutput = "&phi;(1@(1,0)<sub>&phi;(1@(1,0)<sub>&phi;(1)</sub>)</sub>)"; // ψ(Ω_ψ(Ω_ω))
    if (ord.gte(16)) veblenOutput = "&phi;(1@(1,0)<sub>I</sub>)"; // ψ(I) level
    if (ord.gte(2**297)) veblenOutput = "&phi;(1@(1,0)<sub>I+1</sub>)"; // ψ(Ω_(I+1)) level
    if (ord.eq(D("ee79.36560556844312"))) veblenOutput = "&phi;(1@(1,0)<sub>I+&phi;(1)</sub>)"; // ψ(Ω_(I+ω)) level
    if (ord.gt(D("ee79.36560556844312"))) veblenOutput = "&phi;(1@(1,0)<sub>I+(1,0)</sub>)"; // ψ(Ω_(I+Ω)) level
    if (ord.gt(D("eee615.9880408921791"))) veblenOutput = "&phi;(1@(1,0)<sub>I+(1,0)+1</sub>)"; // ψ(Ω_(I+Ω+1)) level
    if (ord.eq(D("eeee619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I+(1,0)+&phi;(1)</sub>)"; // ψ(Ω_(I+Ω+ω)) level
    if (ord.gt(D("eeee619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I(1,0)</sub>)"; // ψ(Ω_(IΩ)) level
    if (ord.gte(D("(e^12)619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I<sup>(1,0)</sup></sub>)"; // ψ(Ω_(I^Ω)) level
    if (ord.gte(D("(e^28)619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I<sup>(1,0)</sup>(1,0)</sub>)"; // ψ(Ω_((I^Ω)Ω)) level
    if (ord.gte(D("(e^60)619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I<sup>(1,0)+1</sup></sub>)"; // ψ(Ω_(I^(Ω+1))) level
    if (ord.gte(D("(e^124)619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>I<sup>(1,0)+1</sup>(1,0)</sub>)"; // ψ(Ω_((I^(Ω+1))Ω)) level
    if (ord.gte(D("(e^252)619.299370844483"))) veblenOutput = "&phi;(1@(1,0)<sub>1@(1,0)<sub>I+1</sub></sub>)"; // ψ(Ω_(Ω_(I+1))) level
    if (D(ord.layer).gte(D("3.2317006071311436e616"))) veblenOutput = "&phi;(1@(1,0)<sub>I<sub>&phi;(1)</sub></sub>)"; // ψ(I_ω) level
    return veblenOutput
}
