function trimBMSFinalOutput(output, trim = data.ord.trim) {
    let trimmed = false
    let outputList = output.replace("...", "").split(")(")
    let n = outputList.length
    if (output.includes("...") || n > trim) trimmed = true
    if (n > trim) outputList.length = trim
    return outputList.join(")(") + (n > trim ? ")" : "") + (trimmed ? "..." : "")
}

// Displays Ordinals using BMS when the value of ord is less than NUMBER.MAX_VALUE
function displayBMSOrd(ord, over, base, trim = data.ord.trim, depth = 0, final = true, forcePsi = false) {
    if(data.ord.isPsi || forcePsi) return displayPsiBMSOrd(ord, trim)
    if(D(ord).eq(data.ord.ordinal) && D(ord).gt(Number.MAX_VALUE)) return displayInfiniteBMSOrd(ord, over, base, trim)
    if(D(ord).eq(data.ord.ordinal)) ord = Number(ord)

    ord = Math.floor(ord)
    over = Math.floor(over)
    if (final && ord === 0) return "0"
    if (trim <= 0) return `...`
    if (ord < base) {
        let n = ord+over
        if (over>trim) n = ord+trim // preventing the ordinal display from extend without limit
        let curBMS = "("+depth+")"
        let finalOutput = ""
        for (let i = 0; i < n; i++) finalOutput += curBMS
        if (over>trim) finalOutput += "..."
        return final ? trimBMSFinalOutput(finalOutput, trim) : finalOutput
    }
    const magnitude = Math.floor(Math.log(ord)/Math.log(base)+1e-14)
    const magnitudeAmount = base**magnitude
    const amount = Math.floor(ord/magnitudeAmount)
    let curBMS = "("+depth+")"
    if (magnitude >= 1) curBMS += displayBMSOrd(magnitude, 0, base, trim, depth + 1, false)
    let finalOutput = ""
    for (let i = 0; i < amount; i++) finalOutput += curBMS
    const firstAmount = amount*magnitudeAmount
    if(ord-firstAmount > 0) finalOutput += displayBMSOrd(ord-firstAmount, over, base, trim - 1, depth, false)
    return final ? trimBMSFinalOutput(finalOutput, trim) : finalOutput
}

// Displays Ordinals using BMS when the value of ord is greater than NUMBER.MAX_VALUE
function displayInfiniteBMSOrd(ord, over, base, trim = data.ord.trim, depth = 0, final = true, recursionDepth = 0){
    let maxRecursionDepth = 1000 // needed as the recursion can be very deep in certain cases
    ord = Decimal.floor(ord)
    over = Decimal.floor(over)
    if (final && ord.toNumber() === 0) return "0"
    if(trim <= 0 || recursionDepth >= maxRecursionDepth) return `...`
    if(ord.lt(base)) {
        let n = ord.plus(over)
        if (over>trim) n = ord.plus(trim) // preventing the ordinal display from extend without limit
        let curBMS = "("+depth+")"
        let finalOutput = ""
        for (let i = 0; i < n.toNumber(); i++) finalOutput += curBMS
        if (over>trim) finalOutput += "..."
        return final ? trimBMSFinalOutput(finalOutput, trim) : finalOutput
    }
    const magnitude = Decimal.floor(Decimal.ln(ord).div(Decimal.ln(base)).plus(D(1e-14)))
    const magnitudeAmount = D(base).pow(magnitude)
    const amount = Decimal.floor(ord.div(magnitudeAmount))
    let curBMS = "("+depth+")"
    if (magnitude.gte(1)) curBMS += displayInfiniteBMSOrd(magnitude, 0, base, trim, depth + 1, false, recursionDepth + 1)
    let finalOutput = ""
    for (let i = 0; i < amount.toNumber(); i++) finalOutput += curBMS
    const firstAmount = amount.times(magnitudeAmount)
    if(ord.sub(firstAmount).gt(0)) finalOutput += displayInfiniteBMSOrd(ord-firstAmount, over, base, trim - 1, depth, false, recursionDepth)
    return final ? trimBMSFinalOutput(finalOutput, trim) : finalOutput
}

function renderBMS(ordMarks, depth = 0, skip = 0) {
    let ordMarksList = ordMarks.split(")(")
    let n = ordMarksList.length
    ordMarksList[0] = ordMarksList[0].replace("(", "")
    ordMarksList[n-1] = ordMarksList[n-1].replace(")", "")
    let finalOutput = ""
    for (let i = skip; i < n; i++) {
        let ab = ordMarksList[i].split(",")
        let a = parseInt(ab[0]) + depth - skip
        let b = parseInt(ab[1])
        let output = "(" + a.toString() + "," + b.toString() + ")"
        finalOutput += output
    }
    return finalOutput
}

function removeLastBMSEntry(output) {
    let outputList = output.replace("...", "(...)").split(")(")
    outputList.length -= 1
    return (outputList.join(")(") + (outputList.length > 0 ? ")" : "")).replace("(...)", "...")
}

// Displays Ordinals using BMS and Psi when the value of ord is less than NUMBER.MAX_VALUE
function displayPsiBMSOrd(ord, trim = data.ord.trim, base = data.ord.base, depth = 0, final = true) {
    if(base === 2) return displayBase2PsiBMSOrd(D(ord), trim)
    if(ord < 0) return ""
    if (D(ord).mag === Infinity || isNaN(D(ord).mag)) return "Ω"
    if(D(ord).gt(Number.MAX_VALUE)) return displayInfinitePsiBMSOrd(ord, trim, base)
    ord = Math.floor(ord)
    if(trim <= 0) return "..."
    if(ord === BHO_VALUE) {
        let finalOutput = renderBMS("(0,0)(1,1)(2,2)", depth)
        if (final) finalOutput = trimBMSFinalOutput(finalOutput, trim)
        return `${finalOutput.replaceAll('undefined', '')}`
    }
    let maxOrdMarks = (3**(ordMarksBMS.length-1))*4
    if(maxOrdMarks < Infinity && new Decimal(ord).gt(new Decimal(maxOrdMarks.toString()))) {
        return displayPsiBMSOrd(maxOrdMarks, trim, base, depth, true) + "x" + format(ord/Number(maxOrdMarks),2)
    }
    if(ord === 0) return (depth === 0 ? "(0,0)" : "")
    if(ord < 4) return (depth === 0 ? "(0,0)" + renderBMS(extraOrdMarksBMS[ord], depth+1) : renderBMS(extraOrdMarksBMS[ord], depth))
    const magnitude = Math.floor(Math.log(ord/4)/Math.log(3))
    const magnitudeAmount = 4*3**magnitude
    let buchholzOutput = ordMarks[Math.min(magnitude,ordMarks.length-1)]
    let finalOutput = renderBMS(ordMarksBMS[Math.min(magnitude,ordMarksBMS.length-1)], depth)
    let finalOutput1 = ordMarksBMS[Math.min(magnitude,ordMarksBMS.length-1)].split(")(")
    let finalOutputX = parseInt(finalOutput1[finalOutput1.length-1].split(")")[0].split(",")[0])
    let finalOutputY = parseInt(finalOutput1[finalOutput1.length-1].split(")")[0].split(",")[1])
    let add = (ord >= BHO_VALUE) ? 3 : 2;
    switch (finalOutputY) {
        case 0:
            add = finalOutputX - 1;
            break;
        case 1:
            while (add <= finalOutputX - 2) add += 2;
            break;
        case 2:
            while (finalOutputX > add) add += 2;
            break;
    }
    if(buchholzOutput.includes("x"))finalOutput = finalOutput + displayPsiBMSOrd(ord-magnitudeAmount, trim-1, base, depth+add, false)
    if(buchholzOutput.includes("y"))finalOutput = removeLastBMSEntry(finalOutput) + displayPsiBMSOrd(Math.max(ord-magnitudeAmount+1, 1), trim-1, base, depth+add+1, false)
    if (final) finalOutput = trimBMSFinalOutput(finalOutput, trim)
    return `${finalOutput.replaceAll('undefined', '')}`
}

//Displays Ordinals using BMS and Psi when the value of ord is greater than NUMBER.MAX_VALUE
function displayInfinitePsiBMSOrd(ord, trim = data.ord.trim, base = data.ord.base, depth = 0, final = true) {
    if(base === 2) return displayBase2PsiBMSOrd(D(ord), trim)
    if(ord.lt(0)) return ""
    if (D(ord).mag === Infinity || isNaN(D(ord).mag) || base < 1) return "Ω"
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    if(trim <= 0) return "..."
    if(ord.eq(BHO_VALUE)) {
        let finalOutput = renderBMS("(0,0)(1,1)(2,2)", depth)
        if (final) finalOutput = trimBMSFinalOutput(finalOutput, trim)
        return `${finalOutput}`
    }
    /*let maxOrdMarks = (D(3).pow(ordMarksXStart[ordMarksXStart.length-1])).times(4) //(D(3).pow(ordMarks.length-1)).times(4)
    if(D(ord).gt(maxOrdMarks)) {
        return displayInfinitePsiBMSOrd(maxOrdMarks, trim, base, depth, true) + "x" + format(ord.div(maxOrdMarks),2)
    }*/
    if(ord.eq(0)) return (depth === 0 ? "(0,0)" : "")
    if(ord.lt(4)) return (depth === 0 ? "(0,0)" + renderBMS(extraOrdMarksBMS[ord], depth+1) : renderBMS(extraOrdMarksBMS[ord], depth))
    if (D(ord.layer).gte(Number.MAX_VALUE)) return trimBMSFinalOutput(infiniteOrdMarksBMS(ord), trim) // return 3-row BMS for ordinals above F1.80e308 as is
    const magnitude = Decimal.floor(Decimal.ln(ord.div(4)).div(Decimal.ln(3)))
    if (magnitude.gte(ordMarksBO)) return trimBMSFinalOutput(infiniteOrdMarksBMS(magnitude), trim) // return 3-row BMS for ordinals above ψ(Ω_ω) as is
    const magnitudeAmount = D(4).times(Decimal.pow(3, magnitude))
    let buchholzOutput = infiniteOrdMarks(magnitude) //Decimal.min(magnitude,ordMarksXStart[ordMarksXStart.length-1])
    let finalOutput = renderBMS(infiniteOrdMarksBMS(magnitude), depth) //Decimal.min(magnitude,ordMarksXStart[ordMarksXStart.length-1])
    let finalOutput1 = infiniteOrdMarksBMS(magnitude).split(")(") //Decimal.min(magnitude,ordMarksXStart[ordMarksXStart.length-1])
    let finalOutputX = parseInt(finalOutput1[finalOutput1.length-1].split(")")[0].split(",")[0])
    let finalOutputY = parseInt(finalOutput1[finalOutput1.length-1].split(")")[0].split(",")[1])
    let add = (ord >= BHO_VALUE) ? 3 : 2;
    switch (finalOutputY) {
        case 0:
            add = finalOutputX - 1;
            break;
        case 1:
            while (add <= finalOutputX - 2) add += 2;
            break;
        case 2:
            while (finalOutputX > add) add += 2;
            break;
    }
    if(buchholzOutput.includes("x"))finalOutput = finalOutput + displayInfinitePsiBMSOrd(ord.sub(magnitudeAmount), trim-1, base, depth+add)
    if(buchholzOutput.includes("y"))finalOutput = removeLastBMSEntry(finalOutput) + displayInfinitePsiBMSOrd(Decimal.max(ord.sub(magnitudeAmount).plus(1), D(1)), trim-1, base, depth+add+1)
    if (final) finalOutput = trimBMSFinalOutput(finalOutput, trim)
    return `${finalOutput.replaceAll('undefined', '')}`
}

// Displays Ordinals using BMS for base 2 psi ordinals
function displayBase2PsiBMSOrd(ord, trim = data.ord.trim) {
    if(D(ord).lt(0)) return "0"
    if(D(ord).mag === Infinity || isNaN(D(ord).mag)) return "Ω"
    if (trim <= 0) return "..."
    ord = D(Decimal.floor(D(ord).add(0.000000000001)))
    // 3-row BMS is too complicated, simply return 1 value per ordinal level (much like Hardy) - otherwise lower levels can simply be enumerated
    let bmsOutput = "(0)"; // 1
    if (ord.gte(1)) bmsOutput = "(0)(1)"; // ω
    if (ord.gte(2)) bmsOutput = "(0,0)(1,1)"; // ψ(Ω)
    if (ord.gte(3)) bmsOutput = "(0,0)(1,1)(2,0)"; // ψ(Ωω)
    if (ord.gte(4)) bmsOutput = "(0,0)(1,1)(2,1)(3,0)"; // ψ(Ω^ω)
    if (ord.gte(5)) bmsOutput = "(0,0)(1,1)(2,1)(3,0)(4,1)"; // ψ(Ω^ψ(Ω))
    if (ord.gte(6)) bmsOutput = "(0,0)(1,1)(2,1)(3,0)(4,1)(5,0)"; // ψ(Ω^ψ(Ωω))
    if (ord.gte(7)) bmsOutput = "(0,0)(1,1)(2,1)(3,0)(4,1)(5,1)(6,0)"; // ψ(Ω^ψ(Ω^ω))
    if (ord.gte(8)) bmsOutput = "(0,0,0)(1,1,1)"; // ψ(Ω_ω)
    if (ord.gte(9)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)"; // ψ(Ω_ψ(Ωω))
    if (ord.gte(10)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)(5,0,0)"; // ψ(Ω_ψ(Ωω))
    if (ord.gte(11)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)(5,1,0)(6,0,0)"; // ψ(Ω_ψ(Ω^ω))
    if (ord.gte(12)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)(5,1,0)(6,0,0)(7,1,0)"; // ψ(Ω_ψ(Ω^ψ(Ω)))
    if (ord.gte(13)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)(5,1,0)(6,0,0)(7,1,0)(8,0,0)"; // ψ(Ω_ψ(Ω^ψ(Ωω)))
    if (ord.gte(14)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,0)(5,1,0)(6,0,0)(7,1,0)(8,1,0)(9,0,0)"; // ψ(Ω_ψ(Ω^ψ(Ω^ω)))
    if (ord.gte(15)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,0,0)(4,1,1)"; // ψ(Ω_ψ(Ω_ω))
    if (ord.gte(16)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)"; // ψ(I)
    if (ord.gte(17)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)"; // ψ(Iω) level
    if (ord.gte(32)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)"; // ψ(IΩ) level
    if (ord.gte(4096)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(1,1,1)"; // ψ(I.Ω_ω) level
    if (ord.gte(8192)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)"; // ψ(I.ψI(I)) level
    if (ord.gte(2097152)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(1,1,1)(2,1,1)(3,1,0)(2,1,1)(3,1,0)(1,1,1)"; // ψ(I.ψI(I.Ω_ω)) level
    if (ord.gte(4194304)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(3,0,0)"; // ψ(I^ω) level
    if (ord.gte(2**164)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(3,1,0)(1,1,1)(2,1,1)(3,1,0)(3,0,0)"; // ψ(I^(ψI(I^ω))) level
    if (ord.gte(2**297)) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)"; // ψ(Ω_(I+1)) level
    if (ord.gte(D("ee79.36560556844312"))) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,1)"; // ψ(Ω_(I+ω)) level
    if (ord.gte(D("eeee619.299370844483"))) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,1)(5,2,1)(6,1,0)(2,0,0)"; // ψ(Ω_(I+I)) level
    if (ord.gte(D("(e^252)619.299370844483"))) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,1)"; // ψ(I_ω) level
    if (ord.gte(D("(e^253)619.299370844483"))) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(2,1,1)(3,1,0)"; // ψ(I_Ω) level
    if (D(D(ord.layer).layer).gte(D("(e^252)619.299370844483"))) bmsOutput = "(0,0,0)(1,1,1)(2,1,1)(3,1,1)(2,1,1)(3,1,0)(2,0,0)"; // ψ(I_I) = ψ(M) level
    return trimBMSFinalOutput(bmsOutput, trim)
}
