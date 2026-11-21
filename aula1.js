// ============================================================================
// AULA 1: VARIÁVEIS, CONSTANTES E INTRODUÇÃO AO PHASER 3.80.1
// Objetivo: Entender como guardar dados na memória (let/const) e compreender
//           o ciclo básico de funcionamento do Phaser (Config, Preload, Create).
// ============================================================================


// ============================================================================
// O QUE É O PHASER 3?
// ----------------------------------------------------------------------------
// O Phaser é um "framework" (um conjunto de ferramentas prontas) para criar 
// jogos 2D em HTML5 e JavaScript. 
// Ele cuida da parte pesada para nós: desenhar imagens na tela, tocar áudios,
// calcular física e tratar entradas do teclado e mouse.
// ============================================================================


// ----------------------------------------------------------------------------
// 1. CONCEITO DE VARIÁVEIS E CONSTANTES (JAVASCRIPT)
// ----------------------------------------------------------------------------
// Guardamos informações na memória do computador usando rótulos (identificadores).
//
// - 'const' (Constante): Usado para valores que NÃO mudam durante a execução.
//   Exemplo: Nome do jogador, dimensões da tela, configurações do jogo.
//
// - 'let' (Variável): Usado para valores que PODEM mudar ao longo do tempo.
//   Exemplo: Pontuação, quantidade de vidas, velocidade do personagem.
// ----------------------------------------------------------------------------

// EXEMPLOS DE CONSTANTES (Valores Fixos):
const NOME_JOGADOR = 'Jesus'
const LARGURA_TELA = 800
const ALTURA_TELA = 600

// EXEMPLOS DE VARIÁVEIS (Valores Mutáveis):
let pontos = 0
let vidas = 3
let jogoAtivo = true

// Verificando os valores no console do navegador (F12 no teclado)
console.log('--- DADOS INICIAIS DO JOGO ---')
console.log('Jogador:', NOME_JOGADOR)
console.log('Pontos:', pontos)
console.log('Vidas:', vidas)


// ----------------------------------------------------------------------------
// 2. CONFIGURAÇÃO E MOTOR DO PHASER
// ----------------------------------------------------------------------------
// O Phaser precisa de um objeto JS com as regras de inicialização do jogo.
const config = {
  // 'type': Define como o jogo vai renderizar os gráficos.
  // Phaser.AUTO tenta usar WebGL (mais rápido, via placa de vídeo);
  // se o navegador não suportar, muda automaticamente para Canvas 2D.
  type: Phaser.AUTO,
  
  width: LARGURA_TELA,  // Usa a constante de largura
  height: ALTURA_TELA,  // Usa a constante de altura
  backgroundColor: '#4488aa', // Cor do fundo do canvas (Hexadecimal)

  // 'scene': Define as funções que controlam o ciclo de vida do jogo.
  scene: {
    preload: preload, // Função responsável por carregar os arquivos
    create: create    // Função responsável por montar a cena inicial
  }
}

// 'new Phaser.Game(config)': Cria a instância do jogo e inicia o motor do Phaser!
new Phaser.Game(config)


// ----------------------------------------------------------------------------
// 3. FASE 1 DO PHASER: PRELOAD (PRÉ-CARREGAMENTO)
// ----------------------------------------------------------------------------
// A função 'preload' roda UMA ÚNICA VEZ antes do jogo começar.
// Ela serve para baixar imagens, sons e mapas da rede para a RAM do computador.
function preload() {
  console.log('Phaser: Carregando recursos para a memória...')

  // Sintaxe: this.load.image('chave_da_imagem', 'caminho_do_arquivo')
  // 'player' é o apelido (key) que usaremos para referenciar esta imagem depois.
  this.load.image('player', 'assets/IDLE.PNG')
}


// ----------------------------------------------------------------------------
// 4. FASE 2 DO PHASER: CREATE (CRIAÇÃO)
// ----------------------------------------------------------------------------
// A função 'create' roda UMA ÚNICA VEZ, logo após o termino do 'preload'.
// É aqui que posicionamos os elementos visuais, textos e sprites na tela.
function create() {
  console.log('Phaser: Montando os elementos na tela...')

  // POSICIONANDO A IMAGEM
  // Sintaxe: this.add.image(posicaoX, posicaoY, 'chave_da_imagem')
  // No Phaser, as coordenadas (X, Y) do elemento ficam centralizadas por padrão.
  // (400, 300) coloca a imagem exatamente no centro da tela de 800x600.
  this.add.image(400, 300, 'player')


  // EXIBINDO TEXTOS NA TELA COM VARIÁVEIS E CONSTANTES
  // Sintaxe: this.add.text(x, y, 'Conteúdo', { estilo })
  // Concatenação (+): Une texto fixo com os valores armazenados nas variáveis.

  // 1. Exibindo a Constante
  this.add.text(10, 10, 'Personagem: ' + NOME_JOGADOR, { 
    fontSize: '20px', 
    color: '#ffffff' 
  })

  // 2. Exibindo a Variável 'pontos'
  this.add.text(10, 40, 'Pontos Iniciais: ' + pontos, { 
    fontSize: '20px', 
    color: '#ffffff' 
  })

  // 3. Exibindo a Variável 'vidas'
  this.add.text(10, 70, 'Vidas: ' + vidas, { 
    fontSize: '20px', 
    color: '#ffffff' 
  })


  // --------------------------------------------------------------------------
  // EXEMPLO PRÁTICO: ALTERANDO O VALOR DE UMA VARIÁVEL ('LET')
  // --------------------------------------------------------------------------
  
  // Alteramos o valor contido na variável 'pontos':
  pontos = 100

  // Exibimos o novo valor na tela para provar que 'let' pode ser modificado
  this.add.text(10, 110, 'Pontos Modificados: ' + pontos, { 
    fontSize: '20px', 
    color: '#00ff00' 
  })

  // ATENÇÃO PARA EXPLICAR EM AULA:
  // Se tentarmos executar: NOME_JOGADOR = 'Outro Nome'
  // O JavaScript vai parar a execução e disparar um erro: "Assignment to constant variable".
}