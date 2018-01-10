window.PIXI = require('libs/gamelibs/pixi.min.js')
window.p2 = require('libs/gamelibs/p2.min.js')
window.Phaser = require('libs/gamelibs/phaser-split.min.js')
window.scrollTo = function() {}

/**
 * 角色状态
 * @type {Object}
 */
const PlayerStatus = Object.freeze({
  STAND : 0,
  LEFT  : 1,
  RIGHT : 2
});

let playerStatus = PlayerStatus.STAND

let game
let sprite

/**
 * 尺寸
 * @type {{w: number, h: number}}
 */
let size = { w: 320, h: 200 }
let screenSize = { w: 320, h: 200 }
let spriteSize = { w: 24, h: 24 }

/**
 * 游戏主函数
 */
export default class Main {

  /**
   * 构造
   */
  constructor() {
    // 配置参数
    const conf = {
      width: size.w,
      height: size.h,
      canvas: canvas,
      //context: canvas.getContext('webgl',  { alpha: false, depth: true, stencil: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: true }),
      renderer: Phaser.WEBGL,
      parent: 'phaser',
      transparent: false,
      antialias: false,
      state: { preload: this.preload, create: this.create, update: this.update, pointer: this.pointDown },
      scaleMode: Phaser.ScaleManager.EXACT_FIT
    };

    // 创建游戏
    game = new Phaser.Game(conf)

    // 获取尺寸
    screenSize.w = window.innerWidth
    screenSize.h = window.innerHeight
    console.log('屏幕尺寸: ', screenSize.w, 'x', screenSize.h)
  }

  /**
   * 预载入阶段
   */
  preload() {
    // 载入 SpriteSheet 和 图片
    game.load.spritesheet('shooter', 'images/spritesheet/shooter.png', spriteSize.w, spriteSize.h, 2)
    game.load.image('bg', 'images/bg/field_1920.png')
  }

  /**
   * 创建阶段
   */
  create() {
    // 绘制背景
    let back = game.add.image(0, 0, 'bg');
    back.scale.set(0.2);
    back.smoothed = false;

    // 绘制角色精灵
    sprite = game.add.sprite(160, 160, 'shooter');
    sprite.animations.add('walk');
    sprite.animations.play('walk', 2, true);
    sprite.anchor.set(0.5);
    sprite.scale.set(2);
    sprite.smoothed = false;

    // 显示文本
    const text = game.add.text(5, 5, 'Phaser Test', { fill: 'white' });
    text.smoothed = false;

    // 触摸监听
    game.input.onDown.add(pointDown, this);
    game.input.onUp.add(pointUp, this);

    function pointDown(p) {
      if (p.clientX / size.w > 0.5) {
        sprite.scale.x = -2;
        playerStatus = PlayerStatus.RIGHT
      } else {
        sprite.scale.x = 2;
        playerStatus = PlayerStatus.LEFT
        //sprite.x -= 1;
      }
    }

    function pointUp(p) {
      playerStatus = PlayerStatus.STAND
    }
  }

  /**
   * 更新 Update 循环
   */
  update() {
    // Update
    switch (playerStatus) {
      case PlayerStatus.LEFT  :
        sprite.x -= 1
        break
      case PlayerStatus.RIGHT :
        sprite.x += 1
        break
      case PlayerStatus.STAND :
      default:
        break
    }

    if (sprite.x >= (size.w - spriteSize.w)) {
      playerStatus = PlayerStatus.STAND
    }

    if (sprite.x <= spriteSize.w) {
      playerStatus = PlayerStatus.STAND
    }
  }
}