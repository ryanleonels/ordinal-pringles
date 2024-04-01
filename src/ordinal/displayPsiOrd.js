// Displays Ordinals using Psi when the value of ord is less than NUMBER.MAX_VALUE
function displayPsiOrd(ord, trim = data.ord.trim, base = data.ord.base) {
    if(base === 2) return displayBase2PsiOrd(D(ord), trim)
    if (D(ord).mag === Infinity || isNaN(D(ord).mag)) return "Ω"
    if(D(ord).gt(Number.MAX_VALUE)) return displayInfinitePsiOrd(ord, trim, base)
    ord = Math.floor(ord)
    if(trim <= 0) return "..."
    if(ord === BHO_VALUE) {
        let finalOutput = "&psi;(Ω<sub>2</sub>)"
        return `${finalOutput.replaceAll('undefined', '')}`
    }
    let maxOrdMarks = (3**(ordMarks.length-1))*4
    if(maxOrdMarks < Infinity && new Decimal(ord).gt(new Decimal(maxOrdMarks.toString()))) {
        return displayPsiOrd(maxOrdMarks) + "x" + format(ord/Number(maxOrdMarks),2)
    }
    if(ord === 0) return ""
    if(ord < 4) return extraOrdMarks[ord]
    const magnitude = Math.floor(Math.log(ord/4)/Math.log(3))
    const magnitudeAmount = 4*3**magnitude
    let finalOutput = ordMarks[Math.min(magnitude,ordMarks.length-1)]
    if(finalOutput.includes("x"))finalOutput = finalOutput.replace(/x/, displayPsiOrd(ord-magnitudeAmount, trim-1))
    if(finalOutput.includes("y"))finalOutput = finalOutput.replace(/y/, displayPsiOrd(Math.max(ord-magnitudeAmount+1, 1), trim-1))
    return `${finalOutput.replaceAll('undefined', '')}`
}

// Displays Ordinals using Psi when the value of ord is greater than NUMBER.MAX_VALUE
function displayInfinitePsiOrd(ord, trim = data.ord.trim, base = data.ord.base) {
    if(base === 2) return displayBase2PsiOrd(D(ord), trim)
    if (D(ord).mag === Infinity || isNaN(D(ord).mag) || base < 1) return "Ω"
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    if(trim <= 0) return "..."
    if(ord.eq(BHO_VALUE)) {
        let finalOutput = "&psi;(Ω<sub>2</sub>)"
        return `${finalOutput}`
    }
    /*let maxOrdMarks = (D(3).pow(ordMarksXStart[ordMarksXStart.length-1])).times(4) //(D(3).pow(ordMarks.length-1)).times(4)
    if(D(ord).gt(maxOrdMarks)) {
        return displayInfinitePsiOrd(maxOrdMarks) + "x" + format(ord.div(maxOrdMarks),2)
    }*/
    if(ord.eq(0)) return ""
    if(ord.lt(4)) return extraOrdMarks[ord]
    const magnitude = D(ord.layer).gte(Number.MAX_VALUE) ? ord : Decimal.floor(Decimal.ln(ord.div(4)).div(Decimal.ln(3)))
    const magnitudeAmount = D(4).times(Decimal.pow(3, magnitude))
    let finalOutput = infiniteOrdMarks(magnitude) //Decimal.min(magnitude,ordMarksXStart[ordMarksXStart.length-1])
    if(finalOutput.includes("x"))finalOutput = finalOutput.replace(/x/, displayInfinitePsiOrd(ord.sub(magnitudeAmount), trim-1))
    if(finalOutput.includes("y"))finalOutput = finalOutput.replace(/y/, displayInfinitePsiOrd(Decimal.max(ord.sub(magnitudeAmount).plus(1), D(1)), trim-1))
    return `${finalOutput.replaceAll('undefined', '')}`
}

// Displays Ordinals using Psi for base 2 ordinals
function displayBase2PsiOrd(ord, trim = data.ord.trim) {
    if(D(ord).lt(0)) return "0"
    if(D(ord).mag === Infinity || isNaN(D(ord).mag)) return "Ω"
    if (trim <= 0) return "..."
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    if(ord.eq(0)) return ""
    if(ord.lt(2)) return extraOrdMarks2[ord]
    let finalOutput = ""
    if(ord.lt(D("ee79.36560556844312"))) {
        const magnitude = Decimal.floor(Decimal.ln(ord.div(2)).div(Decimal.ln(2)))
        const magnitudeAmount = D(2).times(Decimal.pow(2, magnitude))
        finalOutput = infiniteOrdMarks2X(magnitude) //ordMarks2[Decimal.min(magnitude,ordMarks2.length-1)]
        if(finalOutput.includes("x"))finalOutput = finalOutput.replace(/x/, displayBase2PsiOrd(ord.sub(magnitudeAmount), trim-1))
        if(finalOutput.includes("y"))finalOutput = finalOutput.replace(/y/, displayBase2PsiOrd(ord.sub(magnitudeAmount).plus(1), trim-1))
    }
    // placeholders while higher ordinals are being prepared
    if (ord.eq(D("ee79.36560556844312"))) finalOutput = "&psi;(Ω<sub>I+ω</sub>)"; // ψ(Ω_(I+ω)) level - TODO: refine per omega subscript at this level onwards
    if (ord.gt(D("ee79.36560556844312"))) finalOutput = "&psi;(Ω<sub>I+Ω</sub>)"; // ψ(Ω_(I+Ω)) level
    if (ord.gt(D("eee615.9880408921791"))) finalOutput = "&psi;(Ω<sub>I+Ω+1</sub>)"; // ψ(Ω_(I+Ω+1)) level
    if (ord.eq(D("eeee619.299370844483"))) finalOutput = "&psi;(Ω<sub>I+Ω+ω</sub>)"; // ψ(Ω_(I+Ω+ω)) level
    if (ord.gt(D("eeee619.299370844483"))) finalOutput = "&psi;(Ω<sub>IΩ</sub>)"; // ψ(Ω_(IΩ)) level
    if (ord.gte(D("(e^12)619.299370844483"))) finalOutput = "&psi;(Ω<sub>I<sup>Ω</sup></sub>)"; // ψ(Ω_(I^Ω)) level
    if (ord.gte(D("(e^28)619.299370844483"))) finalOutput = "&psi;(Ω<sub>I<sup>Ω</sup>Ω</sub>)"; // ψ(Ω_((I^Ω)Ω)) level
    if (ord.gte(D("(e^60)619.299370844483"))) finalOutput = "&psi;(Ω<sub>I<sup>Ω+1</sup></sub>)"; // ψ(Ω_(I^(Ω+1))) level
    if (ord.gte(D("(e^124)619.299370844483"))) finalOutput = "&psi;(Ω<sub>I<sup>Ω+1</sup>Ω</sub>)"; // ψ(Ω_((I^(Ω+1))Ω)) level
    if (ord.gte(D("(e^252)619.299370844483"))) finalOutput = "&psi;(Ω<sub>Ω<sub>I+1</sub></sub>)"; // ψ(Ω_(Ω_(I+1))) level
    if (D(ord.layer).gte(D("3.2317006071311436e616"))) finalOutput = "&psi;(I<sub>ω</sub>)"; // ψ(I_ω) = ψ(Ω_(Ω_(Iω))) level
    return `${finalOutput.replaceAll('undefined', '')}`
}
