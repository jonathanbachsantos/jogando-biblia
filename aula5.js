// ==========================================
// AULA 5: FUNÇÕES E PARÂMETROS
// O que é: Blocos de código que podemos "chamar" para realizar tarefas repetitivas.
// EVOLUÇÃO: Organizamos a criação de itens em uma FUNÇÃO para facilitar o trabalho.
// ==========================================

let player, cursors, itens, scoreText

// Variáveis mantidas das aulas anteriores (Aula 1 e 2)
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
  // Assets das aulas anteriores
  this.load.image('background', 'assets/background.png')
  this.load.spritesheet('idle-sheet', 'assets/IDLE.PNG', { frameWidth: 50, frameHeight: 77 })
  this.load.spritesheet('walk-sheet', 'assets/WALK.PNG', { frameWidth: 47.16, frameHeight: 76 })
  this.load.spritesheet('items-sheet', 'assets/ITEMS.PNG', { frameWidth: 43.25, frameHeight: 46.33 })
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
    frameRate: 10, repeat: -1
  })
  this.anims.create({
    key: 'andando',
    frames: this.anims.generateFrameNumbers('walk-sheet', { start: 0, end: 5 }),
    frameRate: 10, repeat: -1
  })

  // Grupo de itens (Aula 4)
  itens = this.physics.add.group()

  // --- NOVIDADE AULA 5: CHAMADA DE FUNÇÃO ---
  // Chamamos a função passando "Parâmetros" (o número do frame do item)
  gerarItemAleatorio(3) // Cria um Pão
  gerarItemAleatorio(3) // Cria outro Pão
  gerarItemAleatorio(4) // Cria um Peixe
  gerarItemAleatorio(4) // Cria outro Peixe
  gerarItemAleatorio(7) // Cria uma Moeda
  gerarItemAleatorio(8) // Cria um Pergaminho

  // UI (Aula 1 e 4)
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { fontSize: '20px' })
  scoreText = this.add.text(10, 40, 'Pontos: ' + pontos, { fontSize: '20px' })
  this.add.text(10, 70, 'Aula 5: Funções (gerarItemAleatorio)', { fill: '#ffff00' })

  // Colisão (Aula 4) - Note que agora usamos uma função externa "coletarItem"
  this.physics.add.overlap(player, itens, coletarItem, null, this)
}

// --- NOVIDADE AULA 5: DEFINIÇÃO DE FUNÇÃO ---
// 'frameID' é o parâmetro que diz qual item deve ser desenhado
function gerarItemAleatorio(frameID) {
  // Usamos lógica de aleatoriedade para a posição
  const x = Phaser.Math.Between(100, 700)
  const y = Phaser.Math.Between(100, 500)

  const item = itens.create(x, y, 'items-sheet', frameID)
  item.setScale(2)
}

// Função para organizar a coleta (Aula 4 organizada em função)
function coletarItem(p, item) {
  item.destroy()
  pontos += 10
  scoreText.setText('Pontos: ' + pontos)
}

function update() {
  // Lógica de Movimento (Aula 2 e 3)
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

  if (movendo) { player.play('andando', true) } 
  else { player.play('parado', true) }
}
