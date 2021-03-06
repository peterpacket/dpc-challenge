// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({2:[function(require,module,exports) {
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var init = function init() {
  var playerElement = document.createElement('div');
  playerElement.style.background = 'red';
  playerElement.style.position = 'absolute';
  playerElement.style.width = '64px';
  playerElement.style.height = '64px';
  // playerElement.style.borderRadius = '100%'

  var boxElement1 = document.createElement("div");
  boxElement1.style.background = "green";
  boxElement1.style.position = "absolute";
  boxElement1.style.width = "64px";
  boxElement1.style.height = "64px";
  // boxElement1.style.borderRadius = "100%"

  var boxElement2 = document.createElement("div");
  boxElement2.style.background = "darkgreen";
  boxElement2.style.position = "absolute";
  boxElement2.style.width = "64px";
  boxElement2.style.height = "64px";
  // boxElement2.style.borderRadius = "100%"

  var appElement = document.querySelector('.app');
  appElement.appendChild(playerElement);
  appElement.appendChild(boxElement1);
  appElement.appendChild(boxElement2);

  return {
    playerElement: playerElement,
    appElement: appElement,
    boxElement1: boxElement1,
    boxElement2: boxElement2
  };
};

var _init = init(),
    playerElement = _init.playerElement,
    boxElement1 = _init.boxElement1,
    boxElement2 = _init.boxElement2;

var Player = function () {
  function Player(element, x, y, w, h) {
    _classCallCheck(this, Player);

    this.element = element;
    this.x = x;
    this.y = y;
    // this.r = r
    this.w = w;
    this.h = h;

    this.velocity = {
      x: 0,
      y: 0
    };

    this.limit = {
      x: 12,
      y: 12
    };

    this.acceleration = {
      x: 2,
      y: 2
    };

    this.friction = {
      x: 0.75,
      y: 0.75
    };
  }

  _createClass(Player, [{
    key: 'animate',
    value: function animate(state) {
      var _this = this;

      var keys = state.keys,
          collidesLeft = state.collidesLeft,
          collidesLeftWith = state.collidesLeftWith,
          collidesRight = state.collidesRight,
          collidesRightWith = state.collidesRightWith,
          collidesUp = state.collidesUp,
          collidesUpWith = state.collidesUpWith,
          collidesDown = state.collidesDown,
          collidesDownWith = state.collidesDownWith,
          gamepad = state.gamepad;


      var gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [];
      if (!gamepads) {
        return;
      }

      var gp = gamepads[0];

      var maxThrottle = function maxThrottle(ax) {
        return Math.abs(ax) === 1;
      };

      gp.axes.forEach(function (ax, axIndex) {
        if (ax != 0) {
          console.log(ax, axIndex);
          if (axIndex === 4 || axIndex === 0 || axIndex === 2) {
            //x
            if (ax > 0) {
              if (Math.abs(ax) < 1) {
                _this.velocity.x = _this.limit.x * ax;
              } else {
                _this.velocity.x = Math.max(_this.velocity.x - _this.acceleration.x * ax, _this.limit.x * (ax / Math.abs(ax)));
              }
            } else {
              if (Math.abs(ax) < 1) {
                _this.velocity.x = _this.limit.x * ax;
              } else {

                _this.velocity.x = Math.min(_this.velocity.x + _this.acceleration.x * ax, _this.limit.x * (ax / Math.abs(ax)));
              }
            }
          }
          if (axIndex === 5 || axIndex === 1 || axIndex === 3) {
            //y
            if (ax < 0) {
              if (Math.abs(ax) < 1) {
                _this.velocity.y = _this.limit.y * ax;
              } else {
                _this.velocity.y = Math.min(_this.velocity.y + _this.acceleration.y, _this.limit.y * -1);
              }
            } else {
              if (Math.abs(ax) < 1) {
                _this.velocity.y = _this.limit.y * ax;
              } else {
                _this.velocity.y = Math.max(_this.velocity.y - _this.acceleration.y, _this.limit.y * 1);
              }
            }
          }
        }
      });

      if (keys['ArrowLeft'] && keys['ArrowRight']) {
        //do nothing
      } else if (state.keys['ArrowLeft']) {
        this.velocity.x = Math.max(this.velocity.x - this.acceleration.x, this.limit.x * -1);
      } else if (state.keys['ArrowRight']) {
        this.velocity.x = Math.min(this.velocity.x + this.acceleration.x, this.limit.x * 1);
      }

      if (keys['ArrowUp'] && keys['ArrowDown']) {
        //do nothing
      } else if (state.keys['ArrowUp']) {
        this.velocity.y = Math.min(this.velocity.y + this.acceleration.y, this.limit.y * -1);
      } else if (state.keys['ArrowDown']) {
        this.velocity.y = Math.max(this.velocity.y - this.acceleration.y, this.limit.y * 1);
      }
      if (this.velocity.x < 0 && collidesLeft || this.velocity.x > 0 && collidesRight) {
        if (collidesLeftWith && this.y <= collidesLeftWith.y || collidesRightWith && this.y <= collidesRightWith.y) {
          this.velocity.y -= this.friction.y;
        } else {
          this.velocity.y += this.friction.y;
        }
      } else {
        this.velocity.x *= this.friction.x;
        this.x += this.velocity.x;
      }

      if (this.velocity.y < 0 && collidesUp || this.velocity.y > 0 && collidesDown) {
        if (collidesUpWith && this.x <= collidesUpWith.x || collidesDownWith && this.x <= collidesDownWith.x) {
          this.velocity.x -= this.friction.x;
        } else {
          this.velocity.x += this.friction.x;
        }
      } else {
        this.velocity.y *= this.friction.y;
        this.y += this.velocity.y;
      }

      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
    }
  }]);

  return Player;
}();

var player = new Player(playerElement, window.innerWidth / 2, window.innerHeight / 2, 64, 64);

var Box = function () {
  function Box(element, x, y, w, h) {
    _classCallCheck(this, Box);

    this.element = element;
    this.x = x;
    this.y = y;
    // this.r = r
    this.w = w;
    this.h = h;
  }

  _createClass(Box, [{
    key: 'animate',
    value: function animate(state) {
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
    }
  }]);

  return Box;
}();

var box1 = new Box(boxElement1, 100, window.innerHeight / 2 - 32, 64, 64);

var box2 = new Box(boxElement2, window.innerWidth - 100, window.innerHeight / 2 + 32, 64, 64);

var state = {
  clicks: {},
  keys: {},
  mouse: {}
};

var listen = function listen() {
  window.addEventListener('gamepadconnected', function (e) {
    console.log('gamepad connected', e);
    state.gamepad = e.gamepad;
    console.log(e.gamepad);
  });
  window.addEventListener("keydown", function (e) {
    console.log('keydown', e.code);
    state.keys[e.code] = true;
  });
  window.addEventListener("keyup", function (e) {
    state.keys[e.code] = false;
    console.log('keyup', e.code);
  });
};

listen();

var collide = function collide(state) {
  var player = state.player,
      objects = state.objects;


  state.collidesLeft = false;
  state.collidesLeftWith = undefined;

  state.collidesRight = false;
  state.collidesRightWith = undefined;

  state.collidesUp = false;
  state.collidesUpWith = undefined;

  state.collidesDown = false;
  state.collidesDownWith = undefined;

  objects.forEach(function (object) {
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
    if (player.x < object.x + object.w && player.x + player.w > object.x && player.y < object.y + object.h && player.y + player.h > object.y) {
      if (player.velocity.x < 0 && object.x <= player.x) {
        state.collidesLeft = true;
        state.collidesLeftWith = object;
      }

      if (player.velocity.x > 0 && object.x >= player.x) {
        state.collidesRight = true;
        state.collidesRightWith = object;
      }

      if (player.velocity.y < 0 && object.y <= player.y) {
        state.collidesUp = true;
        state.collidesUpWith = object;
      }

      if (player.velocity.y > 0 && object.y >= player.y) {
        state.collidesDown = true;
        state.collidesDownWith = object;
      }
    }
  });
};

state.player = player;
state.objects = [box1, box2];

var animate = function animate() {
  requestAnimationFrame(animate);

  collide(state);

  player.animate(state);
  box1.animate(state);
  box2.animate(state);
};

Window.state = state;

animate();
},{}],24:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '39115' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[24,2], null)
//# sourceMappingURL=/making-games-with-react.be317cd9.map