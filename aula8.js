// ==========================================
// A JORNADA DE JESUS
// AULA 8: ORGANIZAÇÃO EM CENAS E CLASSES
// ==========================================

const FRAMES = {
  IDLE: [0, 1, 2, 3, 4],
  WALK: [0, 1, 2, 3, 4, 5],
  RUN: [0, 1, 2, 3, 4, 5],
  SWORD: [0, 1, 2, 3],
  HURT: [0, 1, 2, 3],
  DEATH: [0, 1, 2, 3],

  ITEMS: {
    ROCK: 1,
    BREAD: 3,
    FISH: 4,
    COIN: 7,
    SCROLL: 8
  },

  HUD: {
    HEART: 0, SHIELD: 1, STAR: 2, BRANCH: 3, STAR2: 4, 
    HOURGLASS: 5, CROWN: 6, LIGHTNING: 7
  },

  WORLD: {
    TENT: 8, FIRE: 9, WELL: 10, TREE: 11, 
    MAP: 12, PORTAL: 13, TABLETS: 14, RAINBOW: 15
  }
}

class HubScene extends Phaser.Scene {
  constructor() {
    super('HubScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#17352e')
    this.registry.set('moedas', this.registry.get('moedas') || 0)
    this.registry.set('vidas', this.registry.has('vidas') ? this.registry.get('vidas') : 3)
    this.registry.set('habilidades', this.registry.get('habilidades') || {
      escudo: false,
      velocidade: false
    })

    this.add.text(400, 55, 'ACAMPAMENTO', {
      fontSize: '38px',
      color: '#ffe08a',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    this.add.text(400, 100, 'Prepare-se para entrar na fase', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.balanceText = this.add.text(400, 140, '', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5)
    this.statusText = this.add.text(400, 175, '', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.criarCompra(150, 'VIDA EXTRA', 'Mais um coração (máximo 5)', '20 moedas', () =>
      this.comprar('vida')
    )
    this.criarCompra(400, 'HABILIDADE: ESCUDO', 'E ativa proteção por 5 segundos', '50 moedas', () =>
      this.comprar('escudo')
    )
    this.criarCompra(650, 'HABILIDADE: VELOCIDADE', 'Aumenta sua velocidade ao correr', '40 moedas', () =>
      this.comprar('velocidade')
    )

    this.infoText = this.add.text(400, 410, '', {
      fontSize: '18px',
      color: '#d8eee4',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5)

    this.criarBotao(400, 495, 340, 64, 'ENTRAR NA FASE 1', () =>
      this.entrarNaFase()
    )
    this.add.text(400, 565, 'Setas: mover  |  Shift: correr  |  Espaço: atacar  |  E: escudo', {
      fontSize: '15px',
      color: '#ffffff'
    }).setOrigin(0.5)

    this.atualizarPainel()
    this.input.keyboard.once('keydown-SPACE', () => this.entrarNaFase())
    this.input.keyboard.on('keydown-ONE', () => this.comprar('vida'))
    this.input.keyboard.on('keydown-TWO', () => this.comprar('escudo'))
    this.input.keyboard.on('keydown-THREE', () => this.comprar('velocidade'))
  }

  criarCompra(x, titulo, descricao, preco, acao) {
    const card = this.add.rectangle(x, 290, 220, 180, 0x285548)
      .setStrokeStyle(2, 0x9bc7a8)
    card.setInteractive({ useHandCursor: true })
    card.on('pointerdown', acao)
    card.on('pointerover', () => card.setFillStyle(0x356b58))
    card.on('pointerout', () => card.setFillStyle(0x285548))

    this.add.text(x, 235, titulo, {
      fontSize: '17px',
      color: '#ffe08a',
      align: 'center',
      wordWrap: { width: 200 }
    }).setOrigin(0.5)
    this.add.text(x, 285, descricao, {
      fontSize: '15px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 190 }
    }).setOrigin(0.5)
    this.add.text(x, 345, preco, {
      fontSize: '18px',
      color: '#ffe08a'
    }).setOrigin(0.5)
  }

  criarBotao(x, y, largura, altura, texto, acao) {
    const botao = this.add.rectangle(x, y, largura, altura, 0x9b6b32)
      .setStrokeStyle(3, 0xffe08a)
    botao.setInteractive({ useHandCursor: true })
    botao.on('pointerdown', acao)
    botao.on('pointerover', () => botao.setFillStyle(0xb68143))
    botao.on('pointerout', () => botao.setFillStyle(0x9b6b32))
    this.add.text(x, y, texto, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
  }

  comprar(tipo) {
    const moedas = this.registry.get('moedas')
    const vidas = this.registry.get('vidas')
    const habilidades = this.registry.get('habilidades')
    const compras = {
      vida: { preco: 20, disponivel: vidas < 5 },
      escudo: { preco: 50, disponivel: !habilidades.escudo },
      velocidade: { preco: 40, disponivel: !habilidades.velocidade }
    }
    const compra = compras[tipo]

    if (!compra.disponivel) {
      this.statusText.setText(tipo === 'vida' ? 'Você já tem o máximo de vidas.' : 'Habilidade já comprada.')
      return
    }

    if (moedas < compra.preco) {
      this.statusText.setText('Moedas insuficientes para essa compra.')
      return
    }

    this.registry.set('moedas', moedas - compra.preco)
    if (tipo === 'vida') {
      this.registry.set('vidas', vidas + 1)
    } else {
      habilidades[tipo] = true
      this.registry.set('habilidades', habilidades)
    }

    this.statusText.setText('Compra realizada!')
    this.atualizarPainel()
  }

  atualizarPainel() {
    const habilidades = this.registry.get('habilidades')
    this.balanceText.setText(
      `${this.registry.get('moedas')} moedas  |  ${this.registry.get('vidas')} vidas`
    )
    this.infoText.setText(
      `Escudo: ${habilidades.escudo ? 'comprado' : 'não comprado'}  |  ` +
      `Velocidade: ${habilidades.velocidade ? 'comprada' : 'não comprada'}`
    )
  }

  entrarNaFase() {
    if (this.registry.get('vidas') <= 0) {
      this.statusText.setText('Compre uma vida para entrar na fase.')
      return
    }

    this.scene.start('GameScene')
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  init() {
    this.pontos = 0
    this.vidas = this.registry.get('vidas')
  }

  preload() {
    this.load.image('background', 'assets/background.png')
    this.load.spritesheet('idle-sheet', 'assets/IDLE.PNG', {
      frameWidth: 50,
      frameHeight: 77
    })
    this.load.spritesheet('walk-sheet', 'assets/WALK.PNG', {
      frameWidth: 47.16,
      frameHeight: 76
    })
    this.load.spritesheet('run-sheet', 'assets/RUN.PNG', {
      frameWidth: 48.33,
      frameHeight: 68
    })
    this.load.spritesheet('sword-sheet', 'assets/SWORD.PNG', {
      frameWidth: 64.5,
      frameHeight: 62
    })
    this.load.spritesheet('hurt-sheet', 'assets/HURT.PNG', {
      frameWidth: 54.25,
      frameHeight: 59
    })
    this.load.spritesheet('death-sheet', 'assets/DEATH.PNG', {
      frameWidth: 72.75,
      frameHeight: 49
    })

    this.load.spritesheet('items-sheet', 'assets/ITEMS.PNG', {
      frameWidth: 43.25,
      frameHeight: 46.33
    })
    this.load.spritesheet('hud-world-sheet', 'assets/HUD-WORLD.PNG', {
      frameWidth: 44.5,
      frameHeight: 40
    })
  }

  create() {
    this.add.image(400, 300, 'background')

    this.criarAnimacoes()

    this.player = this.physics.add.sprite(100, 300, 'idle-sheet', 0)

    this.player.setScale(2)
    this.player.setCollideWorldBounds(true)

    // Ajuste da hitbox do jogador: foca apenas na área dos pés (20x20)
    this.player.body.setSize(20, 20)
    this.player.body.setOffset(15, 57) // Centraliza horizontalmente e desce para a base

    this.player.play('idle')

    this.cursors = this.input.keyboard.createCursorKeys()

    this.shift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    )

    this.attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )
    this.shieldKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )
    this.habilidades = this.registry.get('habilidades')

    this.itens = this.physics.add.group()
    this.inimigos = this.physics.add.group()
    this.cenario = this.physics.add.staticGroup()

    this.criarHUD()
    this.criarCenario()
    this.criarItens()
    this.criarInimigos()

    this.physics.add.overlap(this.player, this.itens, this.coletar, null, this)
    this.physics.add.collider(this.player, this.cenario)

    this.physics.add.collider(
      this.player,
      this.inimigos,
      this.tomarDano,
      null,
      this
    )
  }

  criarHUD() {
    this.hearts = []

    for (let i = 0; i < this.vidas; i++) {
      const heart = this.add.sprite(
        30 + i * 40,
        30,
        'hud-world-sheet',
        FRAMES.HUD.HEART
      )

      heart.setScale(2)

      this.hearts.push(heart)
    }

    this.add.sprite(30, 80, 'items-sheet', FRAMES.ITEMS.COIN).setScale(2)

    this.scoreText = this.add.text(60, 68, this.registry.get('moedas').toString(), {
      fontSize: '28px',
      color: '#ffffff'
    })

    this.add.text(30, 115, 'MOEDAS', {
      fontSize: '14px',
      color: '#ffffff'
    })

    this.phaseText = this.add.text(125, 80, `Fase: ${this.pontos}/100`, {
      fontSize: '18px',
      color: '#ffffff'
    })
  }

  criarAnimacoes() {
    const criar = (nome, frames, fps, loop = true, spriteKey = 'sheet') => {
      this.anims.create({
        key: nome,
        frames: frames.map(frame => ({
          key: spriteKey,
          frame
        })),
        frameRate: fps,
        repeat: loop ? -1 : 0
      })
    }

    criar('idle', FRAMES.IDLE, 5, true, 'idle-sheet')
    criar('walk', FRAMES.WALK, 8, true, 'walk-sheet')
    criar('run', FRAMES.RUN, 12, true, 'run-sheet')
    criar('attack', FRAMES.SWORD, 12, false, 'sword-sheet')
    criar('hurt', FRAMES.HURT, 10, false, 'hurt-sheet')
    criar('death', FRAMES.DEATH, 6, false, 'death-sheet')
  }

  criarCenario() {
    // Adicionando árvores em posições estratégicas (bloqueiam passagem)
    const posicoesArvores = [
      { x: 400, y: 120 },
      { x: 150, y: 450 },
      { x: 650, y: 500 }
    ]

    posicoesArvores.forEach(pos => {
      const arvore = this.cenario
        .create(pos.x, pos.y, 'hud-world-sheet', FRAMES.WORLD.TREE)
        .setScale(2)
      // Reduz hitbox da árvore para um ponto central pequeno
      arvore.body.setSize(15, 15)
      arvore.body.setOffset((arvore.width - 15) / 2, (arvore.height - 15) / 2)
      arvore.refreshBody()
    })

    // Acampamento (Barraca e Fogueira)
    const barraca = this.cenario
      .create(650, 150, 'hud-world-sheet', FRAMES.WORLD.TENT)
      .setScale(2)
    barraca.body.setSize(25, 20)
    barraca.body.setOffset((barraca.width - 25) / 2, (barraca.height - 20) / 2)
    barraca.refreshBody()

    const fogueira = this.cenario
      .create(600, 170, 'hud-world-sheet', FRAMES.WORLD.FIRE)
      .setScale(2)
    fogueira.body.setSize(15, 15)
    fogueira.body.setOffset(
      (fogueira.width - 15) / 2,
      (fogueira.height - 15) / 2
    )
    fogueira.refreshBody()

    // Elementos interativos de cenário
    const poco = this.cenario
      .create(400, 500, 'hud-world-sheet', FRAMES.WORLD.WELL)
      .setScale(2)
    poco.body.setSize(25, 25)
    poco.body.setOffset((poco.width - 25) / 2, (poco.height - 25) / 2)
    poco.refreshBody()

    const portal = this.cenario
      .create(750, 300, 'hud-world-sheet', FRAMES.WORLD.PORTAL)
      .setScale(2)
    portal.body.setSize(30, 35)
    portal.body.setOffset((portal.width - 30) / 2, (portal.height - 35) / 2)
    portal.refreshBody()

    // Decorações de fundo (não bloqueiam passagem)
    this.add
      .sprite(400, 60, 'hud-world-sheet', FRAMES.WORLD.RAINBOW)
      .setScale(2)
    this.add
      .sprite(750, 240, 'hud-world-sheet', FRAMES.WORLD.TABLETS)
      .setScale(1.5)
  }

  criarItens() {
    const itensConfig = [
      { key: 'items-sheet', frame: FRAMES.ITEMS.BREAD, pontos: 10 },
      { key: 'items-sheet', frame: FRAMES.ITEMS.FISH, pontos: 10 },
      { key: 'items-sheet', frame: FRAMES.ITEMS.COIN, pontos: 10 },
      { key: 'items-sheet', frame: FRAMES.ITEMS.SCROLL, pontos: 20 },
      { key: 'hud-world-sheet', frame: FRAMES.HUD.CROWN, pontos: 50 },
      { key: 'hud-world-sheet', frame: FRAMES.HUD.SHIELD, powerup: 'escudo' },
      {
        key: 'hud-world-sheet',
        frame: FRAMES.HUD.LIGHTNING,
        powerup: 'velocidade'
      },
      { key: 'hud-world-sheet', frame: FRAMES.WORLD.MAP, pontos: 40 }
    ]

    for (let i = 0; i < 12; i++) {
      const config = Phaser.Utils.Array.GetRandom(itensConfig)
      const item = this.itens.create(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        config.key,
        config.frame
      )

      item.setScale(2)

      // Reduz a área de colisão para 20x20 e centraliza no sprite
      item.body.setSize(20, 20)
      item.body.setOffset((item.width - 20) / 2, (item.height - 20) / 2)

      item.valorPontos = config.pontos || 0
      item.powerup = config.powerup || null
    }
  }

  criarInimigos() {
    for (let i = 0; i < 4; i++) {
      const inimigo = this.inimigos.create(
        Phaser.Math.Between(300, 700),
        Phaser.Math.Between(100, 500),
        'items-sheet',
        FRAMES.ITEMS.ROCK
      )

      inimigo.setScale(2)

      // Reduz a área de colisão dos inimigos (pedras) para facilitar a esquiva
      inimigo.body.setSize(20, 20)
      inimigo.body.setOffset(
        (inimigo.width - 20) / 2,
        (inimigo.height - 20) / 2
      )

      inimigo.setBounce(1)
      inimigo.setCollideWorldBounds(true)

      inimigo.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      )
    }
  }

  coletar(player, item) {
    // Lógica de Power-ups
    if (item.powerup === 'escudo') {
      this.player.invencivel = true
      this.player.setTint(0x00ffff) // Cor azul clara (proteção)
      this.time.delayedCall(5000, () => {
        this.player.invencivel = false
        this.player.clearTint()
      })
    } else if (item.powerup === 'velocidade') {
      this.player.superVelocidade = true
      this.player.setTint(0xffff00) // Cor amarela (raio)
      this.time.delayedCall(5000, () => {
        this.player.superVelocidade = false
        this.player.clearTint()
      })
    }

    // Pontuação
    const bonus = item.valorPontos || 0
    if (bonus > 0) {
      this.pontos += bonus
      this.registry.set('moedas', this.registry.get('moedas') + bonus)
    } else if (!item.powerup) {
      this.pontos += 10
      this.registry.set('moedas', this.registry.get('moedas') + 10)
    }

    item.destroy()
    this.scoreText.setText(this.registry.get('moedas').toString())
    this.phaseText.setText(`Fase: ${this.pontos}/100`)

    if (this.pontos >= 100) {
      this.scene.start('WinScene')
    }
  }

  tomarDano() {
    if (this.player.invencivel) return

    this.player.invencivel = true

    this.player.play('hurt')

    this.vidas--
    this.registry.set('vidas', this.vidas)

    if (this.hearts[this.vidas]) {
      this.hearts[this.vidas].destroy()
    }

    this.player.setAlpha(0.5)

    this.player.setPosition(100, 300)

    this.time.delayedCall(1000, () => {
      this.player.invencivel = false
      this.player.setAlpha(1)
    })

    if (this.vidas <= 0) {
      this.player.play('death')

      this.time.delayedCall(1500, () => {
        this.scene.start('HubScene')
      })
    }
  }

  update() {
    if (!this.player.active) return

    if (Phaser.Input.Keyboard.JustDown(this.shieldKey) && this.habilidades.escudo) {
      this.ativarEscudo()
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.player.play('attack', true)
      return
    }

    let velocidade = this.habilidades.velocidade ? 200 : 150

    if (this.player.superVelocidade) {
      velocidade = 400
    } else if (this.shift.isDown) {
      velocidade = this.habilidades.velocidade ? 300 : 250
    }

    this.player.setVelocity(0)

    let moving = false

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-velocidade)
      this.player.setFlipX(true)
      moving = true
    }

    if (this.cursors.right.isDown) {
      this.player.setVelocityX(velocidade)
      this.player.setFlipX(false)
      moving = true
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-velocidade)
      moving = true
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(velocidade)
      moving = true
    }

    if (moving) {
      if (this.shift.isDown) {
        this.player.play('run', true)
      } else {
        this.player.play('walk', true)
      }
    } else {
      this.player.play('idle', true)
    }
  }

  ativarEscudo() {
    if (this.player.invencivel || this.time.now < (this.proximoEscudo || 0)) return

    this.player.invencivel = true
    this.player.setTint(0x00ffff)
    this.proximoEscudo = this.time.now + 10000
    this.time.delayedCall(5000, () => {
      if (!this.player.active) return
      this.player.invencivel = false
      this.player.clearTint()
    })
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#2d5e2d')

    this.add.text(250, 180, 'PARABÉNS!', {
      fontSize: '48px',
      color: '#00ff00'
    })

    this.add.text(100, 280, 'VOCÊ COMPLETOU A JORNADA!', {
      fontSize: '32px',
      color: '#ffffff'
    })

    this.add.text(120, 420, 'PRESSIONE ESPAÇO PARA VOLTAR AO ACAMPAMENTO', {
      fontSize: '24px',
      color: '#ffff00'
    })

    this.input.keyboard.once('keydown-SPACE', () =>
      this.scene.start('HubScene')
    )
  }
}

const config = {
  type: Phaser.AUTO,

  width: 800,
  height: 600,

  backgroundColor: '#000000',

  pixelArt: true,
  antialias: false,

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: [HubScene, GameScene, WinScene]
}

new Phaser.Game(config)
