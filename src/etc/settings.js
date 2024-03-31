const SETTINGS_DESCS = [
    "Booster Refund Confirmation", "Challenge Confirmation", "Challenge Completion Popup", "Factor Shift confirmation",
    "Factor Boost confirmation", "Charge Refund Confirmation", "Boost Progress Bar", "ability to Bulk Boost",
    "Baselessness Confirmation", "Collapse Confirmation", "Booster Refund in C5 and C7", "Darkness Confirmation",
    "Charge Sacrifice Confirmation", "Hardy Value Display for Ordinals >= 1.8e308",
    "<img src='https://cdn.discordapp.com/emojis/853002327362895882.webp?size=24'> Display"
]
const settingsDefaults = [true, true, true, true, true, true, true, true, true, true, true, true, false, false]
function settingsToggle(i){
    if (i === -1){
        data.offline = !data.offline
        DOM(`offlineProgressToggle`).innerHTML = `Toggle Offline Progress ${settingsColor(data.offline)}`
        return save()
    }

    i === 14 ? data.gword.enabled = !data.gword.enabled : data.sToggles[i] = !data.sToggles[i]
    if (i === 6) DOM(`progressBarContainer`).style.display = data.sToggles[i] ? `flex` : `none`

    let display = i === 14 ? data.gword.enabled : data.sToggles[i]
    DOM(`settingsToggle${i}`).innerHTML = `${i > 12 ? '' : 'Toggle the'} ${SETTINGS_DESCS[i]} ${settingsColor(display)}`
    save()
}
function settingsColor(bool){
    return bool
        ? `<span style="color: #2da000">[${formatBool(bool)}]</span>`
        : `<span style="color: #ce0b0b">[${formatBool(bool)}]</span>`
}

function toggleOrdColor(){
    data.ord.color = !data.ord.color
    DOM(`changeOrdColor`).children[0].innerHTML = data.ord.color ? `[Shifting]` : `[Normal]`
    DOM(`changeOrdColor`).children[0].style.color = data.ord.color ? 'goldenrod' : '#2da000'
}

function changeOrdDisplayHTML(){
    DOM(`changeOrdDisplay`).children[0].innerHTML = `[${data.ord.displayType}]`
    DOM(`changeOrdDisplay`).children[0].style.color =
        data.ord.displayType === "Buchholz" ? '#2da000' :
        data.ord.displayType === "Veblen" ? '#02b9b4' :
        data.ord.displayType === "BMS" ? '#c203bf' : '#d76205'
}

function toggleOrdDisplay(){
    let nextType =
        data.ord.displayType === "Buchholz" ? "Veblen" :
        data.ord.displayType === "Veblen" ? "BMS" :
        data.ord.displayType === "BMS" ? "Y-Sequence" : "Buchholz"

    data.ord.displayType = nextType
    changeOrdDisplayHTML()
}

function toggleBase2(){
    data.base2 = !data.base2
    DOM(`base2Toggle`).innerHTML = `Toggle Base 2 and Factor 8 ${settingsColor(data.base2)}`
    if (data.base2) addFactor8()
    if (!data.base2) {
        removeFactor8()
        if (data.markup.shifts === 8) {
            data.markup.shifts = 7
            if (data.boost.hasBUP[2] && checkAllIndexes(data.chal.active, true)) {
                data.ord.base = bup2Effect()
            } else {
                data.ord.base = (data.chal.active[2]?15:10) - (data.chal.active[3]?0:data.markup.shifts)
            }
            fsReset()
        }
        if (data.baseless.shifts === 8) {
            data.baseless.shifts = 7
            data.ord.base /= 2
            fsReset()
        }
    }
    return save()
}

function toggleOmegaMode(){
    data.omegaMode = !data.omegaMode
    DOM(`omegaModeToggle`).innerHTML = `Toggle Omega Mode ${settingsColor(data.omegaMode)}`
    if (data.omegaMode && data.ord.isPsi) {
        data.ord.isPsi = false
        data.ord.ordinal = (data.ord.base === 2 ? D(4) : D(PSI_VALUE));
        fsReset()
    }
    if (!data.omegaMode && ((data.ord.base === 3 && data.ord.ordinal.gte(PSI_VALUE)) || (data.ord.base === 2 && data.ord.ordinal.gte(4)))) {
        data.ord.isPsi = true
        data.ord.ordinal = (data.ord.base === 2 ? D(2) : D(4));
        fsReset()
    }
    return save()
}

function loadSettings(){
    DOM(`offlineProgressToggle`).innerHTML = `Toggle Offline Progress ${settingsColor(data.offline)}`
    DOM(`base2Toggle`).innerHTML = `Toggle Base 2 and Factor 8 ${settingsColor(data.base2)}`
    DOM(`omegaModeToggle`).innerHTML = `Toggle Omega Mode ${settingsColor(data.omegaMode)}`
    DOM(`changeOrdLength`).children[0].innerHTML = `[${data.ord.trim}]`

    DOM(`changeOrdColor`).children[0].innerHTML = data.ord.color ? `[Shifting]` : `[Normal]`
    DOM(`changeOrdColor`).children[0].style.color = data.ord.color ? 'goldenrod' : '#2da000'

    changeOrdDisplayHTML()

    for (let i = 0; i < SETTINGS_DESCS.length; i++) {
        DOM(`settingsToggle${i}`).innerHTML = `${i > 12 ? '' : 'Toggle the'} ${SETTINGS_DESCS[i]} ${settingsColor(data.sToggles[i])}`
    }
}
