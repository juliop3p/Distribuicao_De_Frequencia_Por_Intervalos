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

        //---FR 
        contador = 0
        fr.map(e => contador += casasDecimais(e, 1))
        const somatorioFR = contador

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
        const ma = casasDecimais((somatorioPMxFA / somatorioFA), 1)

        //---MO
        let faEscolhido = fa.reduce((ac, cv, i) => {return ac > cv ? ac : cv})
        let liEscolhido = fa.indexOf(faEscolhido)     
        let mo = casasDecimais((classe[liEscolhido] + [(faEscolhido - fa[liEscolhido - 1]) / ((faEscolhido - fa[liEscolhido - 1]) + (faEscolhido - fa[liEscolhido + 1]))] * intervalo), 1)
        
        //---MD
        const faEscolhidoMd = somatorioFA / 2
        let faaEscolhidoMd
        for(let e of faa) {
            if(e > faEscolhidoMd) {
                faaEscolhidoMd = e
                break
            }
        }
        const indice = faa.indexOf(faaEscolhidoMd)
        const liEscolhidoMd = classe[indice]
        const md = casasDecimais((liEscolhidoMd + [(faEscolhidoMd - faa[indice - 1]) / fa[indice]] * intervalo), 1)
        //---Resultado
        return showAll(somatorioFA, faa, fr, somatorioFR, fra, pm, PMxFA, somatorioPMxFA, ma, mo, md)

    } else {
        alert('Hmmm, algo está errado preencha corretamente ou de um refresh!')
    }
    
}

const showAll = (somatorioFA, faa, fr, somatorioFR, fra, pm, PMxFA, somatorioPMxFA, ma, mo, md) => {
    const selfaa = document.querySelector('#faa')
    const selfr = document.querySelector('#fr')
    const selfra = document.querySelector('#fra')
    const selpm = document.querySelector('#pm')
    const selpmxfa = document.querySelector('#pmxfa')

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
    //---MA-MO-MD
    const result = document.querySelector('#showResult')
    result.style.padding = '30px'
    result.style.width = '500px'
    result.style.marginTop = '20px'
    result.style.background = 'rgb(23, 23, 26)'
    result.innerHTML += `<p>MA = ${ma} | MO = ${mo} | MD = ${md}</p>`
}


function showHelp() {
    document.querySelector('#help').style.opacity = '1'
}

function hidHelp() {
    document.querySelector('#help').style.opacity = '0'
}