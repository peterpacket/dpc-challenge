const init = () => {
  const playerElement = document.createElement('div')
  playerElement.style.background = 'red'
  playerElement.style.position = 'absolute'
  playerElement.style.width = '64px'
  playerElement.style.height = '64px'
  // playerElement.style.borderRadius = '100%'

  const boxElement1 = document.createElement("div")
  boxElement1.style.background = "green"
  boxElement1.style.position = "absolute"
  boxElement1.style.width = "64px"
  boxElement1.style.height = "64px"
  // boxElement1.style.borderRadius = "100%"

  const boxElement2 = document.createElement("div")
  boxElement2.style.background = "darkgreen"
  boxElement2.style.position = "absolute"
  boxElement2.style.width = "64px"
  boxElement2.style.height = "64px"
  // boxElement2.style.borderRadius = "100%"

  const appElement = document.querySelector('.app')
  appElement.appendChild(playerElement)
  appElement.appendChild(boxElement1)
  appElement.appendChild(boxElement2)

  return {
    playerElement,
    appElement,
    boxElement1,
    boxElement2
  }
}
const {playerElement, boxElement1, boxElement2} = init()

class Player {
  constructor(element, x, y,  w, h) {
    this.element = element
    this.x = x
    this.y = y
    // this.r = r
    this.w = w
    this.h = h

    this.velocity = {
      x: 0,
      y: 0
    }

    this.limit = {
      x: 12,
      y: 12
    }

    this.acceleration = {
      x: 2,
      y: 2
    }

    this.friction = {
      x: 0.75,
      y: 0.75
    }
  }

  animate (state) {
    const {
      keys,
      collidesLeft,
      collidesLeftWith,
      collidesRight,
      collidesRightWith,
      collidesUp,
      collidesUpWith,
      collidesDown,
      collidesDownWith,
      gamepad
    } = state

    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) {
      return;
    }

    let gp = gamepads[0];

    let maxThrottle = (ax) => {
      return Math.abs(ax) === 1
    }

    gp.axes.forEach((ax, axIndex) => {
      if (ax != 0) {
        console.log(ax, axIndex);
        if (axIndex === 4|| axIndex === 0 || axIndex === 2) {
          //x
          if (ax > 0) {
            if (Math.abs(ax) < 1) {
              this.velocity.x = this.limit.x * ax
            } else {
              this.velocity.x = Math.max(
                this.velocity.x - this.acceleration.x * ax,
                this.limit.x * (ax / Math.abs(ax))
              )
            }
          } else {
            if (Math.abs(ax) < 1) {
              this.velocity.x = this.limit.x * ax
            } else {

              this.velocity.x = Math.min(
                this.velocity.x + this.acceleration.x * ax,
                this.limit.x * (ax / Math.abs(ax))
              )
            }
          }
        }
        if (axIndex === 5 || axIndex === 1 || axIndex === 3 ) {
          //y
          if (ax < 0) {
            if (Math.abs(ax) < 1) {
              this.velocity.y = this.limit.y * ax
            } else {
              this.velocity.y = Math.min(
                this.velocity.y + this.acceleration.y,
                this.limit.y * -1
              )

            }
          } else {
            if (Math.abs(ax) < 1) {
              this.velocity.y = this.limit.y * ax

            } else {
              this.velocity.y = Math.max(
                this.velocity.y - this.acceleration.y,
                this.limit.y * 1
              )
            }
          }
        }
      }
    })


    if (keys['ArrowLeft'] && keys['ArrowRight']) {
      //do nothing
    }
    else if (state.keys['ArrowLeft']) {
      this.velocity.x = Math.max(
        this.velocity.x - this.acceleration.x,
        this.limit.x * -1
      )
    }
    else if (state.keys['ArrowRight']) {
      this.velocity.x = Math.min(
        this.velocity.x + this.acceleration.x,
        this.limit.x * 1
      )
    }

    if (keys['ArrowUp'] && keys['ArrowDown']) {
      //do nothing
    }
    else if (state.keys['ArrowUp']) {
      this.velocity.y = Math.min(
        this.velocity.y + this.acceleration.y,
        this.limit.y * -1
      )
    }
    else if (state.keys['ArrowDown']) {
      this.velocity.y = Math.max(
        this.velocity.y - this.acceleration.y,
        this.limit.y * 1
      )
    }
    if (
        this.velocity.x < 0 && collidesLeft
        || this.velocity.x > 0 && collidesRight
    ) {
        if (
            collidesLeftWith && this.y <= collidesLeftWith.y
            || collidesRightWith && this.y <= collidesRightWith.y
        ) {
            this.velocity.y -= this.friction.y
        } else {
            this.velocity.y += this.friction.y
        }
    }
    else {
      this.velocity.x *= this.friction.x
      this.x += this.velocity.x
    }

    if (
        this.velocity.y < 0 && collidesUp
        || this.velocity.y > 0 && collidesDown
    ) {
        if (
            collidesUpWith && this.x <= collidesUpWith.x
            || collidesDownWith && this.x <= collidesDownWith.x
        ) {
            this.velocity.x -= this.friction.x
        } else {
            this.velocity.x += this.friction.x
        }
    }
    else {
      this.velocity.y *= this.friction.y
      this.y += this.velocity.y
    }

    this.element.style.left = this.x + "px"
    this.element.style.top = this.y + "px"
  }
}

const player = new Player(
  playerElement,
  window.innerWidth / 2,
  window.innerHeight / 2,
  64,
  64
)

class Box {
  constructor(element, x, y, w, h) {
    this.element = element
    this.x = x
    this.y = y
    // this.r = r
    this.w = w
    this.h = h
  }

  animate(state) {
    this.element.style.left = this.x + "px"
    this.element.style.top = this.y + "px"
  }
}

const box1 = new Box(
  boxElement1,
  100,
  (window.innerHeight / 2) - 32,
  64,
  64
)

const box2 = new Box(
  boxElement2,
  window.innerWidth - 100,
  (window.innerHeight / 2) + 32,
  64,
  64
)

const state = {
  clicks: {},
  keys: {},
  mouse: {}
}

const listen = () => {
  window.addEventListener('gamepadconnected', e => {
    console.log('gamepad connected', e)
    state.gamepad = e.gamepad
    console.log(e.gamepad)
  })
  window.addEventListener("keydown", e => {
    console.log('keydown', e.code)
    state.keys[e.code] = true
  })
  window.addEventListener("keyup", e => {
    state.keys[e.code] = false
    console.log('keyup', e.code)
  })

}

listen()

const collide = state => {
    const { player, objects } = state

    state.collidesLeft = false
    state.collidesLeftWith = undefined

    state.collidesRight = false
    state.collidesRightWith = undefined

    state.collidesUp = false
    state.collidesUpWith = undefined

    state.collidesDown = false
    state.collidesDownWith = undefined

    objects.forEach(object => {
        // const delta = {
        //     x: player.x - object.x,
        //     y: player.y - object.y,
        // }
        //
        // const distance = Math.sqrt(
        //     delta.x * delta.x + delta.y * delta.y
        // )
        //
        // if (distance < player.r + object.r) {
      if (
          player.x < (object.x + object.w)
          && (player.x + player.w) > object.x
          && player.y < (object.y + object.h)
          && (player.y + player.h) > object.y
      ) {
            if (player.velocity.x < 0 && object.x <= player.x) {
                state.collidesLeft = true
                state.collidesLeftWith = object
            }

            if (player.velocity.x > 0 && object.x >= player.x) {
                state.collidesRight = true
                state.collidesRightWith = object
            }

            if (player.velocity.y < 0 && object.y <= player.y) {
                state.collidesUp = true
                state.collidesUpWith = object
            }

            if (player.velocity.y > 0 && object.y >= player.y) {
                state.collidesDown = true
                state.collidesDownWith = object
            }
        }
    })
}

state.player = player
state.objects = [
  box1,
  box2
]

const animate = () => {
  requestAnimationFrame(animate)

  collide(state)

  player.animate(state)
  box1.animate(state)
  box2.animate(state)
}

Window.state = state

animate()