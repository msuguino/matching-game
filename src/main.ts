const naipes: Array<string> = ["♠", "♣", "♥", "♦"]
const valores: Array<string> = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

let baralho: Array<string> = []
let cartasSelecionadas: Array<string> = []
const cartasMemoria: Array<string> = new Array(18)
let indicePreencheCartas: number

const selectMatchingCards = document.querySelector<HTMLSelectElement>('[data-cartas="iguais"]')!
const gameBoard = document.querySelector<HTMLDivElement>('.container-board')!
const botaoIniciar = document.querySelector<HTMLButtonElement>("#btnIniciar")!
const mensagensUsuario = document.querySelector<HTMLParagraphElement>("#mensagens-usuario")!


botaoIniciar.onclick = (evento) => {
    evento.preventDefault();
    //Limpa as mensagens do usuário
    mensagensUsuario.textContent = ""

    //O tabuleiro tem 18 posições. Calcula o numero de cartas diferentes a usar
    let qtdeCartas = 18/parseInt(selectMatchingCards.value)

    baralho = []
    montaBaralho()
    embaralha(baralho)
    cartasSelecionadas = baralho.slice(0, qtdeCartas)

    for(let i=0; i<cartasMemoria.length; i++){
        indicePreencheCartas = Math.floor(i / parseInt(selectMatchingCards.value))
        cartasMemoria[i] = cartasSelecionadas[indicePreencheCartas]
    }

    embaralha(cartasMemoria)
    console.log(cartasMemoria)

    //mostra as cartas no front-end
    gameBoard.innerHTML = cartasMemoria.map( (carta, indice) => {
        let valor = carta.split(" ")[0]
        let naipe = carta.split(" ")[1]
        return `
        <div class="card ${naipe === "♥" || naipe === "♦" ? "red": "black"}" data-valor="${carta}" data-position="${indice}">
        ${naipe}
        </div>`
    }).join("")

    //espera 10 segundos para o jogador memorizar as cartas e depois esconde as cartas
    setTimeout(() => {
        Array.from(gameBoard.children).forEach(divCarta => divCarta.classList.add('virada'))
    }, 10000);
}

function montaBaralho() {
    for(let i=0; i<naipes.length; i++){
        for(let j=0; j<valores.length; j++){
            baralho.push(`${valores[j]} ${naipes[i]}`)
        }
    }
}

function embaralha(arrayCartas: Array<string>) {
    for(let i=arrayCartas.length -1; i>0; i--){
        let indiceAleatorio = Math.floor(Math.random() * (i+1))
        let oldValue = arrayCartas[i]
        arrayCartas[i] = arrayCartas[indiceAleatorio]
        arrayCartas[indiceAleatorio] = oldValue
    }
}

let posicoesDasCartasSelecionadas: Array<number> = []
let numeroCartasQueDeuMatch: number = 0


document.onclick = (evento) => {
    const target = evento.target as HTMLDivElement;
    if(target.dataset.position && !target.classList.contains('fora')){
        //Posição da carta clicada
        console.log(target.dataset.position)

        if(posicoesDasCartasSelecionadas.length === 0){
            posicoesDasCartasSelecionadas.push(parseInt(target.dataset.position))
            document.querySelector<HTMLDivElement>(`[data-position="${target.dataset.position}"]`)?.classList.remove('virada')

            console.log(posicoesDasCartasSelecionadas)
        } else if (!posicoesDasCartasSelecionadas.includes((parseInt(target.dataset.position)))){
            posicoesDasCartasSelecionadas.push(parseInt(target.dataset.position))
            document.querySelector<HTMLDivElement>(`[data-position="${target.dataset.position}"]`)?.classList.remove('virada')

            console.log(posicoesDasCartasSelecionadas)
        }

        //checa se o usuario acertou todas as cartas
        if(posicoesDasCartasSelecionadas.length === parseInt(selectMatchingCards.value)){
            let valoresDasCartasSelecionadas = posicoesDasCartasSelecionadas.map( posicao => cartasMemoria[posicao])

            //Aguarda 1 segundo antes de remover/virar as cartas
            setTimeout(() => {
                if(valoresDasCartasSelecionadas.every(val => val === valoresDasCartasSelecionadas[0])){
                    //Se todas as cartas forem iguais
                    posicoesDasCartasSelecionadas.forEach( posicao => {
                        document.querySelector<HTMLDivElement>(`[data-position="${posicao}"]`)?.classList.add('fora')
                    })
    
                    numeroCartasQueDeuMatch += parseInt(selectMatchingCards.value)
                    posicoesDasCartasSelecionadas = []

                    //checa se o jogador acertou todas as cartas
                    if(numeroCartasQueDeuMatch === 18){
                        mensagensUsuario.textContent = "Parabéns, você finalizou o jogo! Clique em Iniciar para jogar novamente."
                        numeroCartasQueDeuMatch = 0
                    }
            
                } else {
                    //Se as cartas não forem iguais
                    posicoesDasCartasSelecionadas.forEach( posicao => {
                        document.querySelector<HTMLDivElement>(`[data-position="${posicao}"]`)?.classList.add('virada')
                    })
    
                    posicoesDasCartasSelecionadas = []
                }
    
            }, 1000);
        }

    }
}



export {}