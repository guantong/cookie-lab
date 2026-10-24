import './game.css'

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Required page element not found: ${selector}`)
  return element
}

const flavors = [
  { id: 'classic', name: 'Classic', note: 'Golden butter', color: '#d9a35d', edge: '#ae7440', fleck: '#9d6038' },
  { id: 'chocolate', name: 'Cocoa', note: 'Double chocolate', color: '#795143', edge: '#54352f', fleck: '#3d2926' },
  { id: 'strawberry', name: 'Berry', note: 'Strawberry sugar', color: '#e7a28e', edge: '#bd7369', fleck: '#a45c56' },
  { id: 'vanilla', name: 'Vanilla', note: 'Brown butter', color: '#ebd19b', edge: '#c5a365', fleck: '#b58a52' },
] as const

type Flavor = (typeof flavors)[number]

const tools = [
  { id: 'sprinkle', name: 'Sprinkles', icon: 'sprinkles' },
  { id: 'chip', name: 'Choc chips', icon: 'chips' },
  { id: 'pearl', name: 'Sugar pearls', icon: 'pearls' },
  { id: 'star', name: 'Tiny stars', icon: 'stars' },
  { id: 'heart', name: 'Candy hearts', icon: 'hearts' },
  { id: 'icing', name: 'Icing swirls', icon: 'icing' },
] as const

type ToolId = (typeof tools)[number]['id']

const colors = [
  { value: '#e55252', name: 'Cherry' },
  { value: '#f08a45', name: 'Tangerine' },
  { value: '#e8b53a', name: 'Gold' },
  { value: '#66a878', name: 'Pistachio' },
  { value: '#55a8a2', name: 'Mint' },
  { value: '#5684c5', name: 'Blueberry' },
  { value: '#aa6c9c', name: 'Berry' },
  { value: '#e987a1', name: 'Pink' },
  { value: '#fffdf7', name: 'White' },
  { value: '#55443d', name: 'Chocolate' },
] as const

type ToppingColor = (typeof colors)[number]
const rainbowColor = { value: 'rainbow', name: 'Rainbow' } as const
type ColorChoice = ToppingColor | typeof rainbowColor

function colorNamed(name: string): ToppingColor {
  const color = colors.find((item) => item.name === name)
  if (!color) throw new Error(`Unknown topping color: ${name}`)
  return color
}

const defaultColors: Record<ToolId, ColorChoice> = {
  sprinkle: rainbowColor,
  chip: colorNamed('Chocolate'),
  pearl: colorNamed('Pink'),
  star: colorNamed('Gold'),
  heart: colorNamed('Cherry'),
  icing: colorNamed('White'),
}
const colorChoices: ColorChoice[] = [rainbowColor, ...colors]
const rainbowPalette = colors.slice(0, 7)

type Decoration = {
  type: ToolId
  color: string
  x: number
  y: number
  size: number
  rotation: number
}

type Point = { x: number; y: number }
type CookieGeometry = { x: number; y: number; radius: number }

getElement<HTMLDivElement>('#app').innerHTML = `
  <div class="bakery-shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Crumb Club home">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="brand-copy"><strong>crumb club</strong><small>THE COOKIE STUDIO</small></span>
      </a>
      <div class="topbar-meta"><span class="open-dot"></span><span>THE KITCHEN IS OPEN</span></div>
      <button class="new-bake" id="new-bake" type="button"><span aria-hidden="true">+</span> New cookie</button>
    </header>

    <main>
      <section class="intro-row">
        <div class="intro-copy">
          <p class="eyebrow"><span>YOUR LITTLE BAKERY</span><span class="eyebrow-divider">/</span><span>NO WRONG ANSWERS</span></p>
          <h1>Make it <em>yours.</em></h1>
          <p class="intro-description">Pick a cookie, pile on the good stuff, and see where the sprinkles take you.</p>
        </div>
        <div class="note-slip"><span class="note-star" aria-hidden="true"></span><span><small>BAKER'S NOTE</small><strong>More is more.</strong></span></div>
      </section>

      <section class="studio" aria-label="Cookie decorating studio">
        <aside class="toolbox">
          <div class="toolbox-title"><div><span class="section-kicker">01 / THE BASE</span><h2>Pick your cookie</h2></div><span class="step-number">01</span></div>
          <div class="flavor-list" id="flavor-list" aria-label="Cookie flavors"></div>

          <div class="section-rule"></div>
          <div class="toolbox-title topping-title"><div><span class="section-kicker">02 / THE GOOD STUFF</span><h2>Choose a topping</h2></div><span class="step-number">02</span></div>
          <div class="tool-grid" id="tool-grid" aria-label="Topping tools"></div>

          <div class="section-rule compact-rule"></div>
          <div class="control-label"><span class="section-kicker">PICK A COLOR</span><span id="color-name">Rainbow</span></div>
          <div class="color-list" id="color-list" aria-label="Topping colors"></div>

          <div class="size-row"><label for="size-slider" class="section-kicker">TOPPING SIZE</label><output id="size-value" for="size-slider">100%</output></div>
          <input id="size-slider" class="size-slider" type="range" min="100" max="150" value="100" aria-label="Topping size" />
          <p class="tool-hint"><span class="hint-dot"></span>Tap or drag right on your cookie</p>
        </aside>

        <div class="stage-panel">
          <div class="stage-heading">
            <div><span class="section-kicker">FRESH FROM THE OVEN</span><h2>Your masterpiece</h2></div>
            <div class="stage-actions">
              <button class="icon-button" id="undo-button" type="button" aria-label="Undo last topping" title="Undo" disabled>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h9a7 7 0 0 1 0 14h-2"/></svg>
              </button>
              <button class="icon-button" id="clear-button" type="button" aria-label="Clear all toppings" title="Clear cookie" disabled>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>
              </button>
            </div>
          </div>
          <div class="canvas-wrap" id="canvas-wrap">
            <span class="stage-stamp stamp-left" aria-hidden="true">BAKED<br />WITH<br />LOVE</span>
            <span class="stage-stamp stamp-right" aria-hidden="true">100%<br />YOURS</span>
            <canvas id="cookie-canvas" aria-label="Your cookie. Tap or drag to add toppings." role="img"></canvas>
            <div class="canvas-caption"><span class="caption-spark" aria-hidden="true"></span><span>One of a kind, naturally.</span></div>
          </div>
          <div class="stage-footer">
            <div class="topping-count"><span class="count-mark" aria-hidden="true"></span><span><strong id="count-number" aria-live="polite">0</strong> toppings so far</span></div>
            <div class="footer-actions">
              <button class="shower-button" id="shower-button" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.7 6.1L20 6l-2.9 5.4L23 14l-6.3 1.2L18 22l-5.4-3.6L9 24l-.7-6.4L2 20l3.7-5.2L0 11l6.4-.2L5 4l5 3.9L12 2Z" transform="translate(1 0) scale(.9)"/></svg> Sprinkle shower</button>
              <button class="save-button" id="save-button" type="button"><span>Keep my cookie</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3"/></svg></button>
            </div>
          </div>
        </div>
      </section>
      <p class="page-footnote"><span>CRUMB CLUB</span><span>MADE BY YOU, DOWN TO THE LAST SPRINKLE.</span><span>EST. TODAY</span></p>
    </main>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
  </div>
`

const canvas = getElement<HTMLCanvasElement>('#cookie-canvas')
const canvasWrap = getElement<HTMLDivElement>('#canvas-wrap')
const flavorList = getElement<HTMLDivElement>('#flavor-list')
const toolGrid = getElement<HTMLDivElement>('#tool-grid')
const colorList = getElement<HTMLDivElement>('#color-list')
const countNumber = getElement<HTMLElement>('#count-number')
const undoButton = getElement<HTMLButtonElement>('#undo-button')
const clearButton = getElement<HTMLButtonElement>('#clear-button')
const sizeSlider = getElement<HTMLInputElement>('#size-slider')
const sizeValue = getElement<HTMLOutputElement>('#size-value')
const colorName = getElement<HTMLElement>('#color-name')
const toast = getElement<HTMLDivElement>('#toast')

const decorations: Decoration[] = []
const history: Decoration[][] = []
let selectedFlavor: Flavor = flavors[0]
let selectedTool: ToolId = tools[0].id
let selectedColor: ColorChoice = rainbowColor
let toppingSize = 1
let drawing = false
let previousPoint: Point | null = null
let viewWidth = 1
let viewHeight = 1
let toastTimer: number | undefined

flavorList.innerHTML = flavors.map((flavor, index) => `
  <button class="flavor-option${index === 0 ? ' is-selected' : ''}" type="button" data-flavor="${flavor.id}" aria-pressed="${index === 0}">
    <span class="flavor-preview flavor-preview--${flavor.id}" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="flavor-copy"><strong>${flavor.name}</strong><small>${flavor.note}</small></span>
    <span class="radio-mark" aria-hidden="true"></span>
  </button>
`).join('')

toolGrid.innerHTML = tools.map((tool, index) => `
  <button class="tool-option${index === 0 ? ' is-selected' : ''}" type="button" data-tool="${tool.id}" aria-pressed="${index === 0}">
    <span class="tool-glyph glyph-${tool.icon}" aria-hidden="true"><i></i><i></i><i></i></span>
    <span>${tool.name}</span>
  </button>
`).join('')

colorList.innerHTML = colorChoices.map((color, index) => {
  const isRainbow = color.value === 'rainbow'
  return `
    <button class="color-swatch${isRainbow ? ' is-rainbow' : ''}${index === 0 ? ' is-selected' : ''}" type="button" data-color="${color.value}" data-name="${color.name}" aria-label="${color.name}" aria-pressed="${index === 0}" style="${isRainbow ? '' : `--swatch:${color.value}`}" title="${color.name}"></button>
  `
}).join('')

function cookieGeometry(width: number, height: number): CookieGeometry {
  const radius = Math.min(width, height) * 0.42
  return { x: width / 2, y: height / 2 - 2, radius }
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points = 5): void {
  ctx.beginPath()
  for (let index = 0; index < points * 2; index += 1) {
    const angle = (index * Math.PI) / points - Math.PI / 2
    const pointRadius = index % 2 === 0 ? radius : radius * 0.43
    const pointX = x + Math.cos(angle) * pointRadius
    const pointY = y + Math.sin(angle) * pointRadius
    if (index === 0) ctx.moveTo(pointX, pointY)
    else ctx.lineTo(pointX, pointY)
  }
  ctx.closePath()
  ctx.fill()
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.beginPath()
  ctx.moveTo(x, y + size * 0.38)
  ctx.bezierCurveTo(x - size * 1.05, y - size * 0.18, x - size * 0.54, y - size * 0.88, x, y - size * 0.38)
  ctx.bezierCurveTo(x + size * 0.54, y - size * 0.88, x + size * 1.05, y - size * 0.18, x, y + size * 0.38)
  ctx.fill()
}

function drawDecoration(ctx: CanvasRenderingContext2D, decoration: Decoration, geometry: CookieGeometry): void {
  const x = geometry.x + decoration.x * geometry.radius
  const y = geometry.y + decoration.y * geometry.radius
  const size = geometry.radius * 0.048 * decoration.size
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(decoration.rotation)
  ctx.fillStyle = decoration.color
  ctx.strokeStyle = decoration.color
  ctx.lineCap = 'round'

  if (decoration.type === 'sprinkle') {
    ctx.lineWidth = size * 0.64
    ctx.beginPath()
    ctx.moveTo(-size * 0.8, 0)
    ctx.lineTo(size * 0.8, 0)
    ctx.stroke()
  } else if (decoration.type === 'chip') {
    ctx.beginPath()
    ctx.moveTo(-size * 0.74, -size * 0.34)
    ctx.lineTo(-size * 0.31, -size * 0.74)
    ctx.lineTo(size * 0.38, -size * 0.62)
    ctx.lineTo(size * 0.76, -size * 0.06)
    ctx.lineTo(size * 0.45, size * 0.62)
    ctx.lineTo(-size * 0.34, size * 0.68)
    ctx.closePath()
    ctx.fill()
  } else if (decoration.type === 'pearl') {
    ctx.shadowColor = 'rgba(83, 56, 43, 0.25)'
    ctx.shadowBlur = size * 0.45
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.fillStyle = 'rgba(255,255,255,0.62)'
    ctx.beginPath()
    ctx.arc(-size * 0.2, -size * 0.23, size * 0.18, 0, Math.PI * 2)
    ctx.fill()
  } else if (decoration.type === 'star') {
    drawStar(ctx, 0, 0, size * 0.95)
  } else if (decoration.type === 'heart') {
    drawHeart(ctx, 0, 0, size)
  } else {
    ctx.lineWidth = size * 0.62
    ctx.beginPath()
    ctx.moveTo(-size, size * 0.16)
    ctx.bezierCurveTo(-size * 0.25, -size * 0.92, size * 0.05, size * 0.98, size, -size * 0.12)
    ctx.stroke()
  }
  ctx.restore()
}

function renderCookie(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const { x, y, radius } = cookieGeometry(width, height)
  const random = seededRandom(flavors.indexOf(selectedFlavor) * 417 + 28)
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.shadowColor = 'rgba(93, 58, 36, 0.25)'
  ctx.shadowBlur = radius * 0.15
  ctx.shadowOffsetY = radius * 0.08
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = selectedFlavor.edge
  ctx.fill()
  ctx.restore()

  const dough = ctx.createRadialGradient(x - radius * 0.28, y - radius * 0.34, radius * 0.04, x, y, radius)
  dough.addColorStop(0, selectedFlavor.color === '#795143' ? '#986c59' : '#f2cf8f')
  dough.addColorStop(0.57, selectedFlavor.color)
  dough.addColorStop(1, selectedFlavor.edge)
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.955, 0, Math.PI * 2)
  ctx.fillStyle = dough
  ctx.fill()
  ctx.lineWidth = Math.max(2, radius * 0.025)
  ctx.strokeStyle = 'rgba(255, 236, 189, 0.48)'
  ctx.stroke()

  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, radius * 0.91, 0, Math.PI * 2)
  ctx.clip()
  for (let index = 0; index < 150; index += 1) {
    const angle = random() * Math.PI * 2
    const distance = Math.sqrt(random()) * radius * 0.88
    const fleckX = x + Math.cos(angle) * distance
    const fleckY = y + Math.sin(angle) * distance
    const fleckSize = radius * (0.003 + random() * 0.009)
    ctx.globalAlpha = 0.12 + random() * 0.17
    ctx.fillStyle = index % 3 === 0 ? '#fff0c8' : selectedFlavor.fleck
    ctx.beginPath()
    ctx.ellipse(fleckX, fleckY, fleckSize * 1.4, fleckSize, random(), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  if (selectedFlavor.id === 'chocolate') {
    for (let index = 0; index < 11; index += 1) {
      const angle = random() * Math.PI * 2
      const distance = Math.sqrt(random()) * radius * 0.76
      ctx.fillStyle = index % 2 ? '#c4926b' : '#4a2e2b'
      ctx.beginPath()
      ctx.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, radius * 0.035, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    for (let index = 0; index < 7; index += 1) {
      const angle = random() * Math.PI * 2
      const distance = Math.sqrt(random()) * radius * 0.75
      ctx.fillStyle = selectedFlavor.id === 'strawberry' ? 'rgba(255,245,225,0.8)' : 'rgba(117,66,43,0.63)'
      ctx.beginPath()
      ctx.ellipse(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, radius * 0.026, radius * 0.018, angle, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  for (const decoration of decorations) drawDecoration(ctx, decoration, { x, y, radius })
  ctx.restore()
}

function draw(): void {
  const context = canvas.getContext('2d')
  if (!context) return
  const pixelRatio = window.devicePixelRatio || 1
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  renderCookie(context, viewWidth, viewHeight)
}

function resizeCanvas(): void {
  const bounds = canvas.getBoundingClientRect()
  const pixelRatio = window.devicePixelRatio || 1
  viewWidth = Math.max(bounds.width, 1)
  viewHeight = Math.max(bounds.height, 1)
  canvas.width = Math.round(viewWidth * pixelRatio)
  canvas.height = Math.round(viewHeight * pixelRatio)
  draw()
}

function updateUI(): void {
  countNumber.textContent = String(decorations.length)
  undoButton.disabled = history.length === 0
  clearButton.disabled = decorations.length === 0
  sizeValue.textContent = `${Math.round(toppingSize * 100)}%`
  draw()
}

function updateColorControls(): void {
  colorName.textContent = selectedColor.name
  colorList.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((option) => {
    const isSelected = option.dataset.color === selectedColor.value
    option.classList.toggle('is-selected', isSelected)
    option.setAttribute('aria-pressed', String(isSelected))
  })
}

function getDecorationColor(): string {
  if (selectedColor.value !== 'rainbow') return selectedColor.value
  return rainbowPalette[Math.floor(Math.random() * rainbowPalette.length)].value
}

function saveHistory(): void {
  history.push(decorations.map((decoration) => ({ ...decoration })))
  if (history.length > 60) history.shift()
}

function placeDecoration(event: PointerEvent): boolean {
  const bounds = canvas.getBoundingClientRect()
  const pointX = event.clientX - bounds.left
  const pointY = event.clientY - bounds.top
  const { x, y, radius } = cookieGeometry(viewWidth, viewHeight)
  const normalizedX = (pointX - x) / radius
  const normalizedY = (pointY - y) / radius
  if (Math.hypot(normalizedX, normalizedY) > 0.86) return false
  if (previousPoint && Math.hypot(normalizedX - previousPoint.x, normalizedY - previousPoint.y) < 0.045) return false
  decorations.push({
    type: selectedTool,
    color: getDecorationColor(),
    x: normalizedX,
    y: normalizedY,
    size: toppingSize * (0.82 + Math.random() * 0.34),
    rotation: Math.random() * Math.PI * 2,
  })
  previousPoint = { x: normalizedX, y: normalizedY }
  updateUI()
  return true
}

function showToast(message: string): void {
  toast.textContent = message
  toast.classList.add('is-visible')
  if (toastTimer !== undefined) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200)
}

function getButtonTarget(event: Event, selector: string): HTMLButtonElement | null {
  if (!(event.target instanceof Element)) return null
  return event.target.closest<HTMLButtonElement>(selector)
}

flavorList.addEventListener('click', (event) => {
  const button = getButtonTarget(event, '[data-flavor]')
  if (!button) return
  const flavor = flavors.find((item) => item.id === button.dataset.flavor)
  if (!flavor) return
  selectedFlavor = flavor
  flavorList.querySelectorAll<HTMLButtonElement>('[data-flavor]').forEach((option) => {
    const isSelected = option === button
    option.classList.toggle('is-selected', isSelected)
    option.setAttribute('aria-pressed', String(isSelected))
  })
  draw()
})

toolGrid.addEventListener('click', (event) => {
  const button = getButtonTarget(event, '[data-tool]')
  if (!button) return
  const tool = tools.find((item) => item.id === button.dataset.tool)
  if (!tool) return
  selectedTool = tool.id
  selectedColor = defaultColors[selectedTool]
  updateColorControls()
  toolGrid.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach((option) => {
    const isSelected = option === button
    option.classList.toggle('is-selected', isSelected)
    option.setAttribute('aria-pressed', String(isSelected))
  })
})

colorList.addEventListener('click', (event) => {
  const button = getButtonTarget(event, '[data-color]')
  if (!button) return
  const color = colorChoices.find((item) => item.value === button.dataset.color)
  if (!color) return
  selectedColor = color
  updateColorControls()
  colorList.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((option) => {
    const isSelected = option === button
    option.classList.toggle('is-selected', isSelected)
    option.setAttribute('aria-pressed', String(isSelected))
  })
})

sizeSlider.addEventListener('input', () => {
  toppingSize = Number(sizeSlider.value) / 100
  updateUI()
})

canvas.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return
  event.preventDefault()
  saveHistory()
  drawing = true
  previousPoint = null
  canvas.setPointerCapture(event.pointerId)
  placeDecoration(event)
})

canvas.addEventListener('pointermove', (event) => {
  if (drawing) placeDecoration(event)
})

function finishStroke(): void {
  drawing = false
  previousPoint = null
}

canvas.addEventListener('pointerup', finishStroke)
canvas.addEventListener('pointercancel', finishStroke)

undoButton.addEventListener('click', () => {
  const previous = history.pop()
  if (!previous) return
  decorations.splice(0, decorations.length, ...previous)
  updateUI()
})

clearButton.addEventListener('click', () => {
  if (decorations.length === 0) return
  saveHistory()
  decorations.length = 0
  updateUI()
  showToast('A fresh start. Go wild!')
})

getElement<HTMLButtonElement>('#shower-button').addEventListener('click', () => {
  saveHistory()
  for (let index = 0; index < 32; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.sqrt(Math.random()) * 0.82
    decorations.push({
      type: selectedTool,
      color: getDecorationColor(),
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: toppingSize * (0.78 + Math.random() * 0.58),
      rotation: Math.random() * Math.PI * 2,
    })
  }
  updateUI()
})

getElement<HTMLButtonElement>('#new-bake').addEventListener('click', () => {
  decorations.length = 0
  history.length = 0
  selectedFlavor = flavors[Math.floor(Math.random() * flavors.length)]
  flavorList.querySelectorAll<HTMLButtonElement>('[data-flavor]').forEach((option) => {
    const isSelected = option.dataset.flavor === selectedFlavor.id
    option.classList.toggle('is-selected', isSelected)
    option.setAttribute('aria-pressed', String(isSelected))
  })
  updateUI()
  showToast(`${selectedFlavor.name} cookie, fresh from the oven.`)
})

getElement<HTMLButtonElement>('#save-button').addEventListener('click', () => {
  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = 1000
  exportCanvas.height = 1000
  const context = exportCanvas.getContext('2d')
  if (!context) return
  renderCookie(context, exportCanvas.width, exportCanvas.height)
  const link = document.createElement('a')
  link.download = 'my-crumb-club-cookie.png'
  link.href = exportCanvas.toDataURL('image/png')
  link.click()
  showToast('Your cookie is saved. Looking delicious!')
})

new ResizeObserver(resizeCanvas).observe(canvasWrap)
resizeCanvas()
