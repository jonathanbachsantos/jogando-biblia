// ==========================================
// AULA 3: OBJETOS E ANIMAÇÕES
// O que é: Organizar dados em grupos e trocar imagens rápido para criar movimento.
// EVOLUÇÃO: Mantemos o movimento da Aula 2, mas trocamos a imagem por uma SpriteSheet.
// ==========================================

let player
let cursors
const NOME_JOGADOR = 'Jesus'
let pontos = 0
const VELOCIDADE = 5

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#4488aa',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
}

new Phaser.Game(config)

function preload() {
  // Um SpriteSheet é um "Objeto" complexo: imagem + divisões de largura/altura
  this.load.spritesheet('idle-sheet', 'assets/IDLE.PNG', {
    frameWidth: 50,
    frameHeight: 77
  })
  this.load.spritesheet('walk-sheet', 'assets/WALK.PNG', {
    frameWidth: 47.16,
    frameHeight: 76
  })
}

function create() {
  // Criamos o personagem usando a física (Aula 2)
  player = this.physics.add.sprite(400, 300, 'idle-sheet')
  player.setCollideWorldBounds(true)

  // Teclado (Aula 2)
  cursors = this.input.keyboard.createCursorKeys()

  // Criamos uma animação usando uma "lista" de frames (Array: [0, 1, 2...])
  this.anims.create({
    key: 'parado',
    frames: this.anims.generateFrameNumbers('idle-sheet', {
      start: 0,
      end: 4
    }),
    frameRate: 10,
    repeat: -1 // -1 significa "repetir para sempre"
  })

  this.anims.create({
    key: 'andando',
    frames: this.anims.generateFrameNumbers('walk-sheet', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  })

  // UI mantida e evoluída
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })

  this.add.text(10, 70, 'Aula 3: SpriteSheets e Animações', { fill: '#ffff00' })
}

function update() {
  // LÓGICA DE MOVIMENTO (Vinda da Aula 2)
  let movendo = false

  if (cursors.left.isDown) {
    player.x -= VELOCIDADE
    player.setFlipX(true) // Espelha a imagem
    movendo = true
  } else if (cursors.right.isDown) {
    player.x += VELOCIDADE
    player.setFlipX(false)
    movendo = true
  }

  // Adicionando o movimento vertical da Aula 2
  if (cursors.up.isDown) {
    player.y -= VELOCIDADE
    movendo = true
  } else if (cursors.down.isDown) {
    player.y += VELOCIDADE
    movendo = true
  }

  // LÓGICA DE ANIMAÇÃO (Nova desta aula)
  if (movendo) {
    player.play('andando', true)
  } else {
    player.play('parado', true)
  }
}
