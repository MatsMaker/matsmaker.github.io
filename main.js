class FontTestPlatform {
  canvas;
  props = {};
  state = {};
  refs = {};

  constructor() {
    this.app = new PIXI.Application({
      width: 940,
      height: 860,
      backgroundColor: 0x00ff00,
    });
    document.body.appendChild(this.app.view);

    this.md = new MobileDetect(window.navigator.userAgent);

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
    let step = function (index) {
      return -25 + index * 70;
    };

    const baseText = this._initBaseText("Test render - One", style);
    baseText.y = step(1);
    this.app.stage.addChild(baseText);

    const doubleRender1 = this._initDoubleRender("Test render - Double", style);
    doubleRender1.y = step(2);
    this.app.stage.addChild(doubleRender1);

    const doubleRender2 = this._initDoubleRender("Test render - scale", {
      ...style,
      fontSize: style.fontSize * 2,
    });
    doubleRender2.y = step(3);
    this.app.stage.addChild(doubleRender2);

    const doubleRender3 = this._initDoubleRender(
      "Test render - iPhone test",
      style,
      this.md.is("iPhone")
    );
    doubleRender3.y = step(4);
    this.app.stage.addChild(doubleRender3);

    const doubleRender4 = this._initDoubleRender(
      "Test render - iPhone test",
      { ...style, fontSize: style.fontSize * 2 },
      this.md.is("iPhone")
    );
    doubleRender4.y = step(5);
    this.app.stage.addChild(doubleRender4);

    const doubleRender5 = this._initDoubleRender(
      "Test render - base scale test",
      { ...style, fontSize: style.fontSize * 5 }
    );
    doubleRender5.y = step(6);
    this.app.stage.addChild(doubleRender5);

    const doubleRender6 = this._initDoubleRender(
      "Test render - iPhone test",
      { ...style, fontSize: style.fontSize * 5 },
      true
    );
    doubleRender6.y = step(8);
    this.app.stage.addChild(doubleRender6);
  }

  _initBaseText(message, styles) {
    return new PIXI.Text(message, styles);
  }

  _initDoubleRender(message, styles, iPhone) {
    if (styles.dropShadow && styles.strokeThickness && iPhone) {
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

      const shadowCount = 4 - Math.round((32 * 5) / shadowStyle.fontSize);
      console.log(shadowStyle.fontSize, shadowCount);
      for (let index = 0; index < shadowCount; index++) {
        const shadowText = new PIXI.Text(message, shadowStyle);
        if (baseStyle.strokeThickness !== undefined) {
          shadowText.x += baseStyle.strokeThickness / 2;
          shadowText.y += baseStyle.strokeThickness / 2;
        }
        root.addChild(shadowText);
      }

      const baseText = new PIXI.Text(message, baseStyle);
      root.addChild(baseText);

      return root;
    } else {
      const text = new PIXI.Text(message, styles);
      return text;
    }
  }
}
