/*
 *   Made by Julio Cesar
 */
const classe = []
const fa = []
let contador = 0

function casasDecimais(num, precisao) {
    var casas = Math.pow(10, precisao);
    return Math.floor(num * casas) / casas;
}

const saveClasse = () => {
    let num = document.querySelector('#txtnum')
    const selectClasse = document.querySelector('#classe')
    const opt = document.createElement('option')
    const intervalo = classe[1] - classe[0]
    
    if(num.value.length == 0) {
        alert('Digíte um número!')
    } else if(Number(num.value) !== classe[classe.length-1] + intervalo && !isNaN(intervalo)) {
            alert('Ixiii! Algo está errado pois o intervalo é constante, e o que você acabou de digitar não é!')
        } else {
        classe.push(Number(num.value)) 
        opt.text = num.value 
        selectClasse.appendChild(opt)
        num.value = ''
        num.focus()
    }
    
}

const saveFA = () => {
    let faNum = document.querySelector('#txtfa')
    const selectFA = document.querySelector('#fa')
    const opt = document.createElement('option')
    
    if(faNum.value.length == 0) {
        alert('Digíte um número!')
    } else {
        fa.push(Number(faNum.value))
        opt.text = faNum.value
        selectFA.appendChild(opt)
        faNum.value = ''
        faNum.focus()
    }     
}

const calcular = () => {
    if(fa.length === classe.length-1) {
        const intervalo = classe[1] - classe[0]
        //---Somatório FA
        const somatorioFA = fa.reduce((ac, cv) => ac + cv)

        //---FAA
        contador = 0
        const faa = fa.map(e => contador += e)

        //---FR
        const fr = fa.map(e => casasDecimais((e / somatorioFA * 100), 1))

        //---Somatório FR 
        contador = 0
        fr.map(e => contador += e)
        const somatorioFR = casasDecimais(contador, 1)

        //---FRA
        contador = 0 
        const fra = fr.map(e => (contador += Number(e)).toFixed(1))

        //---PM
        const pm = []
        let firstJump = classe[0] + (intervalo / 2)
        pm.push(firstJump)
        for(let i=0; i<fa.length-1; i++) {
            pm.push(firstJump += intervalo)
        }

        //---PMxFA
        const PMxFA = pm.map((e, i) => pm[i] * fa[i])

        //---Somatório PMxFA
        const somatorioPMxFA = PMxFA.reduce((ac, cv) => ac + cv)

        //---MA
        const ma = Number(casasDecimais((somatorioPMxFA / somatorioFA), 1))

        //--- PM-MA
        const De = pm.map(e => Number((e - ma).toFixed(1)))

        //---D²
        const De2 = De.map(e => Number(Math.pow(e, 2).toFixed(1)))
        
        //---D²xFA
        const D2xFA = De2.map((e, i) => Number((e * fa[i]).toFixed(2)))

        //---Somatório D²xFA
        const somatorioD2xFA = D2xFA.reduce((ac, cv) => Number((ac + cv).toFixed(1)))
        
        //---MO
        const faEscolhido = fa.reduce((ac, cv, i) => {return ac > cv ? ac : cv})
        const liEscolhido = fa.indexOf(faEscolhido) 
        const faAnterior = fa[liEscolhido - 1] || 0
        const faPosterior = fa[liEscolhido + 1]|| 0
        let mo = casasDecimais((classe[liEscolhido] + [(faEscolhido - faAnterior) / ((faEscolhido - faAnterior) + (faEscolhido - faPosterior))] * intervalo), 1)
        
        //---MD
        function MD(bolinha) {
            let faEscolhidoMd = bolinha
            let faaEscolhidoMd
            for(let e of faa) {
                if(e >= faEscolhidoMd) {
                    faaEscolhidoMd = e
                    break
                }
            }
            const indice = faa.indexOf(faaEscolhidoMd)
            const liEscolhidoMd = classe[indice]
            const faaAnterior = faa[indice - 1] || 0
            return Number(casasDecimais((liEscolhidoMd + [(faEscolhidoMd - faaAnterior) / fa[indice]] * intervalo), 1))
        }
        let bolinha = somatorioFA / 2
        const md = MD(bolinha) 
        
        //---Variancia
        const V = Number(casasDecimais(somatorioD2xFA / somatorioFA, 1))

        //---Desvio Padrao
        const DP = Number(casasDecimais(Math.sqrt(V), 1))

        //---Tipo de curva
        const TC = Number(casasDecimais(ma - mo, 1))
        let TcText = ''
        if(TC > 0) {
            TcText = "Curva Assimétrica Positiva"
        } else if(TC < 0) {
            TcText = "Curva Assimétrica Negativa"
        } else {
            TcText = "Curva Simétrica"
        }

        //---Quartiz
        bolinha = somatorioFA / 4
        const qt1 = MD(bolinha)

        const qt2 = md

        bolinha = somatorioFA / 4 * 3
        const qt3 = MD(bolinha)

        //---P10, P90
        bolinha = somatorioFA / 100 * 10
        const p10 = MD(bolinha)

        bolinha = somatorioFA / 100 * 90
        const p90 = MD(bolinha)

        //---Coeficiente de Assimetria
        let AS = Number(casasDecimais(((3 * (ma - md)) / DP) * 1, 2))
        if(AS < 0) {AS *= -1}
        let ASText = ''

        if(AS < 0.15) {
            ASText = 'Assimetria Pequena'
        } else if (AS > 1) {
            ASText = 'Assimetria Elevada'
        } else {
            ASText = 'Assimetria Moderada'
        }
        
        //---Coeficiente de curtose
        const curtose = Number(casasDecimais((qt3 - qt1) / (2 * (p90 - p10)), 3))
        let CText = ''

        if(curtose === 0.263) {
            CText = 'Mesocúrtica'
        } else if(curtose < 0.263) {
            CText = 'Leptocúrtica'
        } else {
            CText = 'Platicúrtica'
        }

        //---Resultado
        return showAll(somatorioFA, faa, fr, somatorioFR, fra, pm, PMxFA, somatorioPMxFA, ma, De, De2, D2xFA, somatorioD2xFA, mo, md, V, DP, TC, TcText, qt1, qt2, qt3, p10, p90, AS, curtose, ASText, CText)

    } else {
        alert('Hmmm, algo está errado preencha corretamente ou de um refresh!')
    }
    
}

const showAll = (somatorioFA, faa, fr, somatorioFR, fra, pm, PMxFA, somatorioPMxFA, ma, De, De2, D2xFA, somatorioD2xFA, mo, md, V, DP, TC, TcText, qt1, qt2, qt3, p10, p90, AS, curtose, ASText, CText) => {
    const selfaa = document.querySelector('#faa')
    const selfr = document.querySelector('#fr')
    const selfra = document.querySelector('#fra')
    const selpm = document.querySelector('#pm')
    const selpmxfa = document.querySelector('#pmxfa')
    const selpm_ma = document.querySelector('#pm-ma')
    const seld = document.querySelector('#d')
    const seld2 = document.querySelector('#d2')
    const seld2xfa = document.querySelector('#d2xfa')

    for(let i in fa) {
        //---FAA
        let opt1 = document.createElement('option')
        opt1.text = faa[i]
        selfaa.appendChild(opt1)
        //---FR
        let opt2 = document.createElement('option')
        opt2.text = fr[i]
        selfr.appendChild(opt2)
        //---FRA
        let opt3 = document.createElement('option')
        opt3.text = fra[i]
        selfra.appendChild(opt3)
        //---PM
        let opt4 = document.createElement('option')
        opt4.text = pm[i]
        selpm.appendChild(opt4)
        //---PMxFA
        let opt5 = document.createElement('option')
        opt5.text = PMxFA[i]
        selpmxfa.appendChild(opt5)
        //---PM-MA
        let opt6 = document.createElement('option')
        opt6.text = `${pm[i]} - ${ma}`
        selpm_ma.appendChild(opt6)
        //---D
        let opt7 = document.createElement('option')
        opt7.text = De[i]
        seld.appendChild(opt7)
        //---D²
        let opt8 = document.createElement('option')
        opt8.text = De2[i]
        seld2.appendChild(opt8)
        //---D²xFA
        let opt9 = document.createElement('option')
        opt9.text = D2xFA[i]
        seld2xfa.appendChild(opt9)
        
    }
    //Somatório FA
    const selectFA = document.querySelector('#fa')
    const opt = document.createElement('option')
    opt.text = `Σ${somatorioFA}`
    selectFA.appendChild(opt)
    //Somatório FR
    let opt2 = document.createElement('option')
    opt2.text = `Σ${somatorioFR}`
    selfr.appendChild(opt2)
    //---Somatório PMxFA
    let opt5 = document.createElement('option')
    opt5.text = `Σ${somatorioPMxFA}`
    selpmxfa.appendChild(opt5)
    //----somatório D2xFA
    let opt9 = document.createElement('option')
    opt9.text = `Σ${somatorioD2xFA}`
    seld2xfa.appendChild(opt9)
    //---MA-MO-MD
    const result = document.querySelector('#showResult')
    result.style.padding = '30px'
    result.style.marginTop = '20px'
    result.style.background = 'rgb(23, 23, 26)'
    result.innerHTML += `<p>MA = ${ma} | MO = ${mo} | MD = ${md} | V = ${V} | DP = ${DP}</p>`
    result.innerHTML += `<h2>TC = ${TC} ${TcText}</h2>`
    result.innerHTML += `<h2>Quartiz Q1 = ${qt1} | Q2 = ${qt2} | Q3 = ${qt3}</h2>`
    result.innerHTML += `<h2>Percentiz P10 = ${p10} | P90 = ${p90}</h2>`
    result.innerHTML += `<h2>Coeficiente de Assimetria AS = ${AS} ${ASText}</h2>`
    result.innerHTML += `<h2>Coeficiente de Curtose C = ${curtose} ${CText}</h2>`
}


function showHelp() {
    document.querySelector('#help').style.opacity = '1'
}

function hidHelp() {
    document.querySelector('#help').style.opacity = '0'
}
