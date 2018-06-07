import React, { Component, Fragment } from "react"
import { render, findDOMNode } from "react-dom"

class Box extends Component {
  constructor(...params) {
    super(...params)

    // ...start it a bit higher to account for motion
    this.y = this.props.y - 15

    // ...increase direction to speed up
    this.direction = 1.5

    // ...increase limit to move more
    this.limit = 30
  }

  animate(state) {
    this.y += this.direction

    // ...if we have moved enough
    // in one direction, reverse
    if (
      this.y >= this.props.y + this.limit
      || this.y <= this.props.y - this.limit
    ) {
      this.direction *= -1
    }

    const node = findDOMNode(this)
    node.style.top = this.y + "px"
  }

  render() {
    const { x, w, h } = this.props
    const { y } = this

    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          background: "green",
        }}
      />
    )
  }
}

class Player extends Component {
  constructor(...params) {
    super(...params)

    this.x = this.props.x
    this.y = this.props.y

    this.velocity = {
      x: 0,
      y: 0,
    }

    this.limit = {
      x: 8,
      y: 8,
    }

    this.acceleration = {
      x: 2,
      y: 2,
    }

    this.friction = {
      x: 0.9,
      y: 0.9,
    }
  }

  componentWillReceiveProps(props) {
    this.x = this.props.x
    this.y = this.props.y
  }

  animate(state) {
    const { w, h } = this.props

    if (state.keys[37] && state.keys[39]) {
      // do nothing
    }
    else if (state.keys[37]) {
      this.velocity.x = Math.max(
        this.velocity.x - this.acceleration.x,
        this.limit.x * -1,
      )
    }
    else if (state.keys[39]) {
      this.velocity.x = Math.min(
        this.velocity.x + this.acceleration.x,
        this.limit.x * 1,
      )
    }

    if (state.keys[38] && state.keys[40]) {
      // do nothing
    }
    else if (state.keys[38]) {
      this.velocity.y = Math.max(
        this.velocity.y - this.acceleration.y,
        this.limit.y * -1,
      )
    }
    else if (state.keys[40]) {
      this.velocity.y = Math.min(
        this.velocity.y + this.acceleration.y,
        this.limit.y * 1,
      )
    }

    this.velocity.x *= this.friction.x
    this.x += this.velocity.x

    this.velocity.y *= this.friction.y
    this.y += this.velocity.y

    const node = findDOMNode(this)

    node.style.left = this.x + "px"
    node.style.top = this.y + "px"
  }

  render() {
    const { x, y, w, h } = this.props

    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          background: "red",
        }}
      />
    )
  }
}

class Game extends Component {
  constructor(...params) {
    super(...params)

    this.game = {
      clicks: {},
      mouse: {},
      keys: {},
      player: undefined,
      objects: undefined,
    }

    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    window.addEventListener("contextmenu", e => {
      e.preventDefault()
    })

    window.addEventListener("mousedown", e => {
      this.game = {
        ...this.game,
        clicks: {
          ...this.game.clicks,
          [e.which]: true,
        }
      }
    })

    window.addEventListener("mouseup", e => {
      this.game = {
        ...this.game,
        clicks: {
          ...this.game.clicks,
          [e.which]: false,
        }
      }
    })

    window.addEventListener("mousemove", e => {
      this.game = {
        ...this.game,
        mouse: {
          ...this.game.mouse,
          x: e.clientX,
          y: e.clientY,
        }
      }
    })

    window.addEventListener("keydown", e => {
      this.game = {
        ...this.game,
        keys: {
          ...this.game.keys,
          [e.which]: true,
        }
      }
    })

    window.addEventListener("keyup", e => {
      this.game = {
        ...this.game,
        keys: {
          ...this.game.keys,
          [e.which]: false,
        }
      }
    })

    this.animate()
  }

  animate() {
    requestAnimationFrame(this.animate)

    if (this.game.player) {
      this.game.player.animate(this.game)
    }

    this.game.objects.forEach(
      object => object.animate(this.game)
    )
  }

  render() {
    this.game.player = undefined
    this.game.objects = []

    return (
      <Fragment>
        <Player
          x={window.innerWidth / 2}
          y={window.innerHeight / 2}
          w={64}
          h={64}
          ref={player => this.game.player = player}
        />
        <Box
          x={100}
          y={(window.innerHeight / 2) - 32}
          w={64}
          h={64}
          ref={box => this.game.objects.push(box)}
        />
        <Box
          x={window.innerWidth - 100}
          y={(window.innerHeight / 2) + 32}
          w={64}
          h={64}
          ref={box => this.game.objects.push(box)}
        />
      </Fragment>
    )
  }
}

render(
  <Game />,
  document.querySelector(".app"),
)