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

    this.infoText = this.add.text(400, 405, '', {
      fontSize: '15px',
      color: '#d8eee4',
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5)

    this.criarBotao(400, 495, 340, 64, 'ENTRAR NA FASE 1', () =>
      this.entrarNaFase()
    )
    this.add.text(400, 552, '← → mover  |  Shift correr  |  Espaço/↑ pular\nE: usar escudo', {
      fontSize: '14px',
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
      `Escudo: ${habilidades.escudo ? 'comprado' : 'não comprado'}\n` +
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
    this.vidas = this.registry.get('vidas')
    this.larguraFase = 1800
    this.totalMoedasFase = 24
    this.moedasColetadas = 0
    this.saidaAberta = false
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
    this.add.tileSprite(900, 300, this.larguraFase, 600, 'background')

    this.criarAnimacoes()
    this.criarTexturaPlataforma()
    this.criarTexturaRomano()
    this.criarTexturasSaida()

    this.player = this.physics.add.sprite(80, 450, 'idle-sheet', 0)

    this.player.setScale(1.5)
    this.player.setCollideWorldBounds(true)
    this.physics.world.setBounds(0, 0, this.larguraFase, 600)
    this.physics.world.gravity.y = 900
    this.cameras.main.setBounds(0, 0, this.larguraFase, 600)
    this.cameras.main.startFollow(this.player, true, 0.08, 0)

    this.player.body.setSize(16, 20)
    this.player.body.setOffset(17, 53)

    this.player.play('idle')

    this.cursors = this.input.keyboard.createCursorKeys()

    this.shift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    )

    this.jumpKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    )
    this.shieldKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    )
    this.habilidades = this.registry.get('habilidades')

    this.itens = this.physics.add.group()
    this.inimigos = this.physics.add.group()
    this.plataformas = this.physics.add.staticGroup()

    this.criarHUD()
    this.criarPlataformas()
    this.criarItens()
    this.criarInimigos()
    this.criarSaida()

    this.physics.add.overlap(this.player, this.itens, this.coletar, null, this)
    this.physics.add.overlap(this.player, this.saida, this.chegarNaSaida, null, this)
    this.physics.add.collider(this.player, this.plataformas)
    this.physics.add.collider(this.inimigos, this.plataformas)

    this.physics.add.collider(
      this.player,
      this.inimigos,
      this.colidirComInimigo,
      null,
      this
    )
  }

  criarTexturaPlataforma() {
    if (this.textures.exists('platform-texture')) return

    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0x765033)
    graphics.fillRect(0, 0, 96, 28)
    graphics.fillStyle(0x4c3525)
    graphics.fillRect(0, 8, 96, 20)
    graphics.fillStyle(0x6eaa48)
    graphics.fillRect(0, 0, 96, 8)
    graphics.fillStyle(0x9bd05b)
    graphics.fillRect(0, 0, 96, 3)
    graphics.generateTexture('platform-texture', 96, 28)
    graphics.destroy()
  }

  criarTexturaRomano() {
    if (this.textures.exists('roman-guard')) return

    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(0x6d2924)
    graphics.fillRoundedRect(10, 21, 21, 22, 4)
    graphics.fillStyle(0xd5a45e)
    graphics.fillRect(12, 21, 17, 4)
    graphics.fillStyle(0xe4b77a)
    graphics.fillCircle(20, 15, 9)
    graphics.fillStyle(0xc69a45)
    graphics.fillEllipse(20, 12, 22, 11)
    graphics.fillStyle(0xe2bf67)
    graphics.fillRect(11, 12, 18, 4)
    graphics.fillStyle(0x8e3028)
    graphics.fillPoints([
      { x: 13, y: 9 },
      { x: 17, y: 1 },
      { x: 20, y: 10 },
      { x: 24, y: 1 },
      { x: 28, y: 10 }
    ], true)
    graphics.fillStyle(0x77431f)
    graphics.fillEllipse(32, 29, 11, 15)
    graphics.lineStyle(2, 0xe2bf67)
    graphics.strokeEllipse(32, 29, 11, 15)
    graphics.lineBetween(32, 22, 32, 36)
    graphics.fillStyle(0x765033)
    graphics.fillRect(13, 40, 6, 8)
    graphics.fillRect(23, 40, 6, 8)
    graphics.fillStyle(0xe2bf67)
    graphics.fillRect(10, 46, 11, 2)
    graphics.fillRect(21, 46, 11, 2)
    graphics.generateTexture('roman-guard', 42, 50)
    graphics.destroy()
  }

  criarTexturasSaida() {
    if (this.textures.exists('saida-bloqueada')) return

    const bloqueada = this.make.graphics({ x: 0, y: 0, add: false })
    bloqueada.fillStyle(0x543a2d)
    bloqueada.fillRoundedRect(5, 5, 60, 75, 20)
    bloqueada.lineStyle(5, 0xd5a45e)
    bloqueada.strokeRoundedRect(5, 5, 60, 75, 20)
    bloqueada.fillStyle(0x281f2e)
    bloqueada.fillRoundedRect(14, 17, 42, 63, 16)
    bloqueada.lineStyle(4, 0x8e3028)
    bloqueada.lineBetween(17, 27, 53, 67)
    bloqueada.lineBetween(53, 27, 17, 67)
    bloqueada.generateTexture('saida-bloqueada', 70, 85)
    bloqueada.destroy()

    const aberta = this.make.graphics({ x: 0, y: 0, add: false })
    aberta.fillStyle(0x543a2d)
    aberta.fillRoundedRect(5, 5, 60, 75, 20)
    aberta.lineStyle(5, 0xffe08a)
    aberta.strokeRoundedRect(5, 5, 60, 75, 20)
    aberta.fillStyle(0x153b4a)
    aberta.fillRoundedRect(14, 17, 42, 63, 16)
    aberta.fillStyle(0x39c6c2, 0.8)
    aberta.fillEllipse(35, 48, 30, 50)
    aberta.fillStyle(0xc3fff0)
    aberta.fillCircle(35, 48, 8)
    aberta.generateTexture('saida-aberta', 70, 85)
    aberta.destroy()
  }

  criarSaida() {
    this.saida = this.physics.add.staticImage(
      this.larguraFase - 55,
      527,
      'saida-bloqueada'
    )
    this.saida.setDepth(2)
    this.saidaAbertaText = this.add.text(
      400,
      125,
      'Saída bloqueada: pegue todas as moedas!',
      { fontSize: '17px', color: '#ffe08a' }
    ).setOrigin(0.5).setScrollFactor(0)
  }

  chegarNaSaida() {
    if (this.moedasColetadas < this.totalMoedasFase) {
      const faltam = this.totalMoedasFase - this.moedasColetadas
      this.saidaAbertaText.setText(`Faltam ${faltam} moedas para abrir a saída.`)
      return
    }

    this.scene.start('WinScene')
  }

  criarPlataformas() {
    const plataformas = [
      { x: 900, y: 585, largura: this.larguraFase, altura: 30 },
      { x: 205, y: 480, largura: 150, altura: 28 },
      { x: 420, y: 405, largura: 135, altura: 28 },
      { x: 645, y: 330, largura: 155, altura: 28 },
      { x: 870, y: 430, largura: 175, altura: 28 },
      { x: 1100, y: 350, largura: 155, altura: 28 },
      { x: 1330, y: 275, largura: 170, altura: 28 },
      { x: 1570, y: 390, largura: 190, altura: 28 }
    ]

    plataformas.forEach(({ x, y, largura, altura }) => {
      const plataforma = this.plataformas
        .create(x, y, 'platform-texture')
        .setDisplaySize(largura, altura)
      plataforma.refreshBody()
    })
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
      heart.setScrollFactor(0)

      this.hearts.push(heart)
    }

    this.add.sprite(30, 80, 'items-sheet', FRAMES.ITEMS.COIN)
      .setScale(2)
      .setScrollFactor(0)

    this.scoreText = this.add.text(60, 68, this.registry.get('moedas').toString(), {
      fontSize: '28px',
      color: '#ffffff'
    }).setScrollFactor(0)

    this.add.text(30, 115, 'MOEDAS', {
      fontSize: '14px',
      color: '#ffffff'
    }).setScrollFactor(0)

    this.phaseText = this.add.text(125, 80, `Moedas: ${this.moedasColetadas}/${this.totalMoedasFase}`, {
      fontSize: '18px',
      color: '#ffffff'
    }).setScrollFactor(0)
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

  criarItens() {
    const posicoesMoedas = [
      [150, 440], [205, 440], [260, 440],
      [370, 365], [420, 365], [470, 365],
      [590, 290], [645, 290], [700, 290],
      [820, 390], [870, 390], [920, 390],
      [1045, 310], [1100, 310], [1155, 310],
      [1275, 235], [1330, 235], [1385, 235],
      [1515, 350], [1570, 350], [1625, 350],
      [520, 545], [1000, 545], [1450, 545]
    ]

    posicoesMoedas.forEach(([x, y]) => {
      const moeda = this.itens.create(x, y, 'items-sheet', FRAMES.ITEMS.COIN)
      moeda.setScale(1.5)
      moeda.body.setAllowGravity(false)
      moeda.body.setImmovable(true)
      moeda.body.setSize(18, 22)
      moeda.valorPontos = 10
      moeda.powerup = null
      moeda.moedaDaFase = true
    })
  }

  criarInimigos() {
    const guardas = [
      { x: 320, plataformaY: 585, inicio: 250, fim: 420 },
      { x: 645, plataformaY: 330, inicio: 590, fim: 700 },
      { x: 1100, plataformaY: 350, inicio: 1045, fim: 1155 },
      { x: 1570, plataformaY: 390, inicio: 1510, fim: 1630 }
    ]

    guardas.forEach(({ x, plataformaY, inicio, fim }) => {
      const inimigo = this.inimigos.create(x, plataformaY - 38, 'roman-guard')
      inimigo.setScale(1.4)
      inimigo.body.setSize(24, 40)
      inimigo.body.setAllowGravity(true)
      inimigo.setVelocityX(70)
      inimigo.setData('inicioPatrulha', inicio)
      inimigo.setData('fimPatrulha', fim)
    })
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

    const bonus = item.valorPontos || 0
    if (bonus > 0) {
      this.registry.set('moedas', this.registry.get('moedas') + bonus)
    } else if (!item.powerup) {
      this.registry.set('moedas', this.registry.get('moedas') + 10)
    }

    item.destroy()
    this.scoreText.setText(this.registry.get('moedas').toString())
    if (item.moedaDaFase) {
      this.moedasColetadas++
      this.phaseText.setText(`Moedas: ${this.moedasColetadas}/${this.totalMoedasFase}`)
    }

    if (this.moedasColetadas === this.totalMoedasFase && !this.saidaAberta) {
      this.saidaAberta = true
      this.saida.setTexture('saida-aberta')
      this.saida.refreshBody()
      this.saidaAbertaText.setText('Saída aberta! Vá até o fim da fase.')
    }
  }

  colidirComInimigo(player, inimigo) {
    if (
      this.playerVelocidadeYAnterior > 0 &&
      this.playerBottomAnterior <= inimigo.body.top + 12
    ) {
      inimigo.destroy()
      player.setVelocityY(-320)
      this.registry.set('moedas', this.registry.get('moedas') + 10)
      this.scoreText.setText(this.registry.get('moedas').toString())
      return
    }

    this.tomarDano()
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

    this.player.setVelocity(0, 0)
    this.player.setPosition(80, 450)

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
    this.playerBottomAnterior = this.player.body.bottom
    this.playerVelocidadeYAnterior = this.player.body.velocity.y

    if (Phaser.Input.Keyboard.JustDown(this.shieldKey) && this.habilidades.escudo) {
      this.ativarEscudo()
    }

    let velocidade = this.habilidades.velocidade ? 200 : 150

    if (this.player.superVelocidade) {
      velocidade = 400
    } else if (this.shift.isDown) {
      velocidade = this.habilidades.velocidade ? 300 : 250
    }

    this.player.setVelocityX(0)

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

    if (
      (Phaser.Input.Keyboard.JustDown(this.jumpKey) ||
        Phaser.Input.Keyboard.JustDown(this.cursors.up)) &&
      this.player.body.onFloor()
    ) {
      this.player.setVelocityY(-450)
    }

    if (!this.player.body.onFloor()) {
      this.player.play('idle', true)
    } else if (moving) {
      if (this.shift.isDown) {
        this.player.play('run', true)
      } else {
        this.player.play('walk', true)
      }
    } else {
      this.player.play('idle', true)
    }

    this.inimigos.children.iterate(inimigo => {
      if (!inimigo || !inimigo.active) return

      const inicio = inimigo.getData('inicioPatrulha')
      const fim = inimigo.getData('fimPatrulha')
      if (inimigo.x <= inicio) inimigo.setVelocityX(70)
      if (inimigo.x >= fim) inimigo.setVelocityX(-70)
      inimigo.setFlipX(inimigo.body.velocity.x < 0)
    })
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
