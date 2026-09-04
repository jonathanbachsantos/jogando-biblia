// ==========================================
// AULA 7: ESTRUTURAS DE REPETIÇÃO (LOOPS)
// O que é: Fazer o computador repetir uma tarefa várias vezes automaticamente.
// EVOLUÇÃO: Usamos Loops para criar muitos itens e obstáculos de uma só vez.
// ==========================================

let player, cursors, itens, scoreText, heartsText

// Variáveis mantidas das aulas anteriores
const NOME_JOGADOR = 'Jesus'
let pontos = 0
const VELOCIDADE = 5
let vidas = 3
let invencivel = false
let gameOver = false

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
  this.load.spritesheet('items-sheet', 'assets/ITEMS.PNG', {
    frameWidth: 43.25,
    frameHeight: 46.33
  })
  this.load.spritesheet('hud-world', 'assets/HUD-WORLD.PNG', {
    frameWidth: 44.5,
    frameHeight: 40
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

  itens = this.physics.add.group()

  // --- NOVIDADE AULA 7: O LOOP FOR ---
  // Em vez de chamar a função 10 vezes manualmente, usamos o Loop!
  // Criamos 6 pães (recurso)
  for (let i = 0; i < 6; i++) {
    gerarItemAleatorio(3)
  }

  // Criamos 4 pedras (obstáculo)
  for (let i = 0; i < 4; i++) {
    gerarItemAleatorio(1)
  }

  // UI (Aula 1, 4 e 6)
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  scoreText = this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })
  heartsText = this.add.text(10, 70, '❤️ Vidas: ' + vidas, {
    fontSize: '20px',
    color: '#ff0000'
  })
  this.add.text(10, 100, 'Aula 7: Estruturas de Repetição (Loops For)', {
    fill: '#ffff00'
  })

  // Colisão (Aula 6)
  this.physics.add.overlap(
    player,
    itens,
    (p, item) => {
      if (!gameOver) {
        if (item.frame.name === 1) {
          receberDano(this)
        } else {
          coletarItem(p, item)
        }
      }
    },
    null,
    this
  )
}

function gerarItemAleatorio(frameID) {
  const x = Phaser.Math.Between(100, 700)
  const y = Phaser.Math.Between(100, 500)
  const item = itens.create(x, y, 'items-sheet', frameID)
  item.setScale(2)
}

function coletarItem(p, item) {
  item.destroy()
  pontos += 10
  scoreText.setText('Pontos: ' + pontos)
}

function receberDano(cena) {
  if (invencivel || gameOver) return

  player.setTint(0xff0000)
  cena.time.delayedCall(200, () => {
    player.clearTint()
  })

  vidas = vidas - 1
  heartsText.setText('❤️ Vidas: ' + vidas)

  if (vidas <= 0) {
    gameOver = true
    cena.physics.pause()
    player.setTint(0xff0000)
    alert('Game Over')
    window.location.reload()
  } else {
    invencivel = true
    player.setAlpha(0.5)
    cena.time.delayedCall(2000, () => {
      invencivel = false
      player.setAlpha(1)
    })
  }
}

function update() {
  if (gameOver) return

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
