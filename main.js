class FontTestPlatform {
  canvas;
  props = {};
  state = {};
  refs = {};

  constructor() {
    window.addEventListener("load", this.init);
  }

  init = () => {
    console.log("run");
    this.app = new PIXI.Application({
      width: 640,
      height: 360,
      backgroundColor: 0x00ff00,
    });
    document.body.appendChild(this.app.view);

    this.draw();
  };

  draw() {
    const originText = this._initText("Origin");
    this.app.stage.addChild(originText);

    const scaleContainer = new PIXI.Container();
    scaleContainer.y = 75;
    scaleContainer.scale.set(0.7);

    const parentScaledText = this._initText("Parent scaled");
    scaleContainer.addChild(parentScaledText);
    this.app.stage.addChild(scaleContainer);

    const scaledText = this._initText("Text scaled");
    scaledText.y = 125;
    scaledText.scale.set(0.7);
    this.app.stage.addChild(scaledText);

    const baseText = this._initBaseText("ArialBaseText");
    baseText.x = 200;
    this.app.stage.addChild(baseText);
  }

  _initBaseText(message) {
    const style = new PIXI.TextStyle({
      fill: 0xfaf3c1,
      fontFamily: "Arial, sans-serif",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 3,
      dropShadowBlur: 12,
      dropShadowAngle: 0.937,
    });
    const text = new PIXI.Text(message, style);
    return text;
  }

  _initText(message) {
    const style = new PIXI.TextStyle({
      fill: 0xfaf3c1,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 3,
      dropShadowBlur: 12,
      dropShadowAngle: 0.937,
    });
    const text = new PIXI.Text(message, style);
    return text;
  }
}

new FontTestPlatform();
