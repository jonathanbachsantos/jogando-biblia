/*
EXEMPLO DE VARIÁVEIS COM VAR E LET

let noite = true

if (noite) {
  var luaVar = "Cheia"
  let luaLet = "Nova"

  console.log("Lua (var): " + luaVar) // Funciona
  console.log("Lua (let): " + luaLet) // Funciona
}

console.log("Lua (var): " + luaVar) // Funciona
console.log("Noite (let): " + noite) // Funciona
//console.log("Lua (let): " + luaLet) // Erro: luaLet is not defined
*/

// CURSO JOGANDO BÍBLIA - AULA 1
// VARIÁVEIS E CONSTANTES

// 'let' cria uma variável flexível que muda durante o jogo
let pontos = 0

// 'const' cria uma constante que não muda durante o jogo
const NOME_JOGADOR = "Jesus"


console.log("Iniciando jogo: " + NOME_JOGADOR)


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#4488aa',
  scene: {
    preload, create
  }
}

new Phaser.Game(config);

function preload() {
  // Carregamos uma imagem para o personagem
  this.load.image('personagem', 'assets/IDLE.PNG')
}

function create() {
  // Desenhamos o personagem no centro da tela
  // Cordenadas X 400 (metade de 800) e Y 300 (metade de 600)

  this.add.image(400, 300, 'personagem')

  // Exibir textos combinando mensagens fixas com nossas variáveis
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px', fill: '#ffffff' })

  this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px', fill: '#ffffff' })
}