class FontTestPlatform {
  canvas;
  props = {};
  state = {};
  refs = {};

  constructor() {
    this.app = new PIXI.Application({
      width: 640,
      height: 360,
      backgroundColor: 0x00ff00,
    });
    document.body.appendChild(this.app.view);

    this.draw();
  }

  draw() {
    const originText = this._initText("Origin");
    this.app.stage.addChild(originText);

    const baseText = this._initBaseText("ArialBaseText");
    baseText.x = 200;
    this.app.stage.addChild(baseText);

    const noStroke = this._initNoStroke("NoStroke");
    noStroke.y = 50;
    this.app.stage.addChild(noStroke);

    const lJBevel = this._initLJBevel("lJBevel");
    lJBevel.y = 100;
    this.app.stage.addChild(lJBevel);

    const lJRound = this._initLJBevel("lJRound");
    lJRound.y = 150;
    this.app.stage.addChild(lJRound);

    const lJMiter = this._initLJBevel("lJMiter");
    lJMiter.y = 200;
    this.app.stage.addChild(lJMiter);


    const htmlText = this._initHtmlText("htmlText");
    htmlText.x = 200;
    htmlText.y = 200;
    this.app.stage.addChild(htmlText);
    
  }

  _initHtmlText(message) {
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

  _initLJMiter(message) {
    const style = new PIXI.TextStyle({
      fill: 0xfaf3c1,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      miterLimit: 1,
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 3,
      dropShadowBlur: 12,
      dropShadowAngle: 0.937,
    });
    const text = new PIXI.Text(message, style);
    return text;
  }

  _initLJRound(message) {
    const style = new PIXI.TextStyle({
      fill: 0xfaf3c1,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      lineJoin: "round",
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 3,
      dropShadowBlur: 12,
      dropShadowAngle: 0.937,
    });
    const text = new PIXI.Text(message, style);
    return text;
  }

  _initLJBevel(message) {
    const style = new PIXI.TextStyle({
      fill: 0xfaf3c1,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      lineJoin: "bevel",
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 3,
      dropShadowBlur: 12,
      dropShadowAngle: 0.937,
    });
    const text = new PIXI.Text(message, style);
    return text;
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

  _initNoStroke(message) {
    const style = new PIXI.TextStyle({
      fill: 0x4c011f,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 5,
      dropShadowBlur: 5,
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
