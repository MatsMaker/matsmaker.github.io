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
    const style = {
      fill: 0xfaf3c1,
      fontFamily: "SourceSansPro-Bold",
      fontSize: 32,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 10,
      dropShadowBlur: 9,
      dropShadowAngle: 0.937,
    };

    const baseText = this._initBaseText("Test double quest Render - One", style);
    baseText.y = 50;
    this.app.stage.addChild(baseText);

    const doubleRender1 = this._initDoubleRender("Test double quest Render - Double", style);
    doubleRender1.y = 100;
    this.app.stage.addChild(doubleRender1);
  }

  _initBaseText(message, styles) {
    return new PIXI.Text(message, styles);
  }

  _initDoubleRender(message, styles) {
    if (styles.dropShadow && styles.strokeThickness) {
      const root = new PIXI.Container();

      let baseStyle = { ...styles };
      for (const key in baseStyle) {
        if (key.startsWith("dropShadow")) {
          delete baseStyle[key];
        }
      }

      let shadowStyle = { ...styles };
      for (const key in shadowStyle) {
        if (key.startsWith("stroke")) {
          delete shadowStyle[key];
        }
      }

      console.log(baseStyle, shadowStyle);
      const baseText = new PIXI.Text(message, baseStyle);
      const shadowText = new PIXI.Text(message, shadowStyle);
      if (baseStyle.strokeThickness !== undefined) {
        shadowText.x += baseStyle.strokeThickness / 2;
        shadowText.y += baseStyle.strokeThickness / 2;
        shadowText.fontWeight += baseStyle.strokeThickness * 100;
      }

      root.addChild(baseText);
      root.addChild(shadowText);

      return root;
    } else {
      const text = new PIXI.Text(message, styles);
      return text;
    }
  }
}
