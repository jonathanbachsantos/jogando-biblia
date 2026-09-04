// ==========================================
// AULA 4: EXPRESSÕES MATEMÁTICAS E PONTUAÇÃO
// O que é: Usar matemática para mudar valores (ex: somar pontos).
// EVOLUÇÃO: Mantemos tudo da Aula 3 e adicionamos ITENS COLETÁVEIS.
// ==========================================

let player, cursors, itens, scoreText

// Variáveis mantidas das aulas anteriores
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
  this.load.image('background', 'assets/background.png')
  this.load.spritesheet('idle-sheet', 'assets/IDLE.PNG', {
    frameWidth: 50,
    frameHeight: 77
  })
  this.load.spritesheet('walk-sheet', 'assets/WALK.PNG', {
    frameWidth: 47.16,
    frameHeight: 76
  })

  // Carregamos a folha de itens (Aula 4)
  this.load.spritesheet('items-sheet', 'assets/ITEMS.PNG', {
    frameWidth: 43.25,
    frameHeight: 46.33
  })
}

function create() {
  this.add.image(400, 300, 'background')

  player = this.physics.add.sprite(400, 300, 'idle-sheet')
  player.setCollideWorldBounds(true)
  cursors = this.input.keyboard.createCursorKeys()

  // Animações (Aula 3)
  this.anims.create({
    key: 'parado',
    frames: this.anims.generateFrameNumbers('idle-sheet', { start: 0, end: 4 }),
    frameRate: 10,
    repeat: -1
  })
  this.anims.create({
    key: 'andando',
    frames: this.anims.generateFrameNumbers('walk-sheet', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  })

  // NOVOS ITENS (Aula 4)
  itens = this.physics.add.group()

  // Criamos 2 pães (Frame 3 da folha ITEMS.PNG)
  itens.create(200, 200, 'items-sheet', 3).setScale(2)
  itens.create(600, 400, 'items-sheet', 3).setScale(2)

  // UI (Evoluída)
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  scoreText = this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })
  this.add.text(
    10,
    70,
    'Aula 4: Expressões Matemáticas (Pontos = Pontos + 10)',
    { fill: '#ffff00' }
  )

  // COLISÃO: Quando o player encosta no item
  this.physics.add.overlap(
    player,
    itens,
    (p, item) => {
      item.destroy() // Remove o item da tela

      // EXPRESSÃO MATEMÁTICA: O valor novo é o valor antigo + 10
      pontos = pontos + 10

      // Atualiza o texto na tela
      scoreText.setText('Pontos: ' + pontos)
    },
    null,
    this
  )
}

function update() {
  // LÓGICA DE MOVIMENTO (Aula 3)
  let movendo = false

  if (cursors.left.isDown) {
    player.x -= VELOCIDADE
    player.setFlipX(true)
    movendo = true
  } else if (cursors.right.isDown) {
    player.x += VELOCIDADE
    player.setFlipX(false)
    movendo = true
  }

  if (cursors.up.isDown) {
    player.y -= VELOCIDADE
    movendo = true
  } else if (cursors.down.isDown) {
    player.y += VELOCIDADE
    movendo = true
  }

  if (movendo) {
    player.play('andando', true)
  } else {
    player.play('parado', true)
  }
}
