// ==========================================
// AULA 1: VARIÁVEIS E CONSTANTES
// O que é: Espaços na memória para guardar dados.
// ==========================================

// 'let' cria uma variável que pode mudar (ex: pontos)
let pontos = 0

// 'const' cria um valor fixo que não muda (ex: largura da tela)
const NOME_JOGADOR = 'Jesus'

console.log('Iniciando:', NOME_JOGADOR)

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#4488aa',
  scene: {
    preload: preload,
    create: create
  }
}

new Phaser.Game(config)

function preload() {
  // Carregamos a imagem para a memória do computador
  this.load.image('player', 'assets/IDLE.PNG')
}

function create() {
  // Usamos as variáveis para mostrar textos e imagens
  this.add.image(400, 300, 'player')

  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  this.add.text(10, 40, 'Pontos Iniciais: ' + pontos, { fontSize: '20px' })
}
