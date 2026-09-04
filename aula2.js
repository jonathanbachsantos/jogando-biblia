// ==========================================
// AULA 2: OPERADORES E COORDENADAS
// O que é: Como o computador entende posições no espaço usando matemática.
// EVOLUÇÃO: Mantemos a Aula 1 e adicionamos MOVIMENTO.
// ==========================================

// Variáveis da Aula 1
let player
let cursors // Nova variável para o teclado
const NOME_JOGADOR = 'Jesus'
let pontos = 0

console.log('Iniciando:', NOME_JOGADOR)

// Nova CONSTANTE para a velocidade
const velocidade = 5

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#4488aa', // Mantendo a cor de fundo definida na Aula 1
  physics: { default: 'arcade' }, // Ativamos a física para o personagem se mover
  scene: { preload, create, update }
}

new Phaser.Game(config)

function preload() {
  // Carregamos a imagem do personagem
  this.load.image('player', 'assets/IDLE.PNG')
}

function create() {
  // COORDENADAS: O centro da tela é X=400 e Y=300
  player = this.physics.add.sprite(400, 300, 'player')

  player.setCollideWorldBounds(true)

  // Prepara o computador para ouvir as setas do teclado
  cursors = this.input.keyboard.createCursorKeys()

  // Mantendo os elementos da Aula 1 para mostrar a evolução do projeto
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })

  this.add.text(10, 70, 'Aula 2: Movimento com Operadores (+ -)', {
    fill: '#ffff00'
  })
}

function update() {
  // A função UPDATE roda 60 vezes por segundo.
  // É aqui que usamos os OPERADORES para mudar a posição.

  // SE a seta para ESQUERDA for pressionada:
  if (cursors.left.isDown) {
    // Subtraímos (-) do X para ir para a esquerda
    player.x = player.x - velocidade
  } else if (cursors.right.isDown) {
    // Somamos (+) ao X para ir para a direita
    player.x = player.x + velocidade
  }

  if (cursors.up.isDown) {
    // Subtraímos (-) do Y para subir (no computador, o 0 é no topo!)
    player.y = player.y - velocidade
  } else if (cursors.down.isDown) {
    // Somamos (+) ao Y para descer
    player.y = player.y + velocidade
  }
}
