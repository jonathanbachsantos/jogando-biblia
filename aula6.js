// ==========================================
// AULA 6: CONDICIONAIS (IF / ELSE)
// O que é: O computador tomando decisões baseadas em perguntas (Verdadeiro ou Falso).
// EVOLUÇÃO: Mantemos o mundo da Aula 5 e adicionamos o Sistema de Vidas e Dano.
// ==========================================

let player, cursors, itens, scoreText, heartsText

// Variáveis mantidas das aulas anteriores
const NOME_JOGADOR = 'Jesus'
let pontos = 0
const VELOCIDADE = 5

// Novas variáveis para a Aula 6
let vidas = 3
let invencivel = false // Tipo de dado: Booleano (true/false)
let gameOver = false // NOVIDADE: Flag para controlar o estado do jogo

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
  // Assets das aulas anteriores
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

  // Itens (Aula 5)
  itens = this.physics.add.group()
  gerarItemAleatorio(3) // Pão
  gerarItemAleatorio(4) // Peixe
  gerarItemAleatorio(1) // Pedra (Agora vamos usar como obstáculo!)

  // UI (Evoluída com Vidas)
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  scoreText = this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })
  heartsText = this.add.text(10, 70, '❤️ Vidas: ' + vidas, {
    fontSize: '20px',
    color: '#ff0000'
  })

  this.add.text(10, 100, 'Aula 6: Condicionais (Clique ou bata na Pedra)', {
    fill: '#ffff00'
  })

  // Colisão para coletar (Aula 4/5)
  this.physics.add.overlap(
    player,
    itens,
    (p, item) => {
      // Callback de colisão
      if (!gameOver) {
        // Só processa se o jogo não acabou
        // Se for o frame 1 (Pedra), chamamos receberDano
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

  // Evento de clique para testar a condição
  this.input.on('pointerdown', () => {
    if (!gameOver) {
      // Só processa se o jogo não acabou
      receberDano(this)
    }
  })
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
  // PERGUNTA: O jogador é invencível?
  if (invencivel === true) {
    console.log('Protegido! Não perdeu vida.')
    return // Para a função aqui
  }

  // Efeito Visual: Piscar o personagem
  player.setTint(0xff0000)
  cena.time.delayedCall(200, () => {
    player.clearTint()
  })

  // Se chegou aqui, ele não era invencível
  vidas = vidas - 1
  console.log('Vidas restantes:', vidas)

  // Outra pergunta: As vidas acabaram?
  if (vidas <= 0) {
    gameOver = true // Ativa o estado de fim de jogo
    cena.physics.pause() // Pausa a física para evitar o loop de alertas
    player.setTint(0xff0000) // Pinta o jogador de vermelho para feedback visual
    console.log('Fim de Jogo!')
    alert('Game Over')
    window.location.reload()
  } else {
    // Ativamos a invencibilidade temporária
    invencivel = true
    console.log('Ficou invencível por 2 segundos...')
    heartsText.setText('❤️ Vidas: ' + vidas)
    player.setAlpha(0.5) // Transparência para indicar proteção

    cena.time.delayedCall(2000, () => {
      invencivel = false
      player.setAlpha(1)
    })
  }
}

function update() {
  if (gameOver) {
    // Se o jogo acabou, não processa mais nada
    return
  }
  let movendo = false // Lógica de Movimento (Aula 3)

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
