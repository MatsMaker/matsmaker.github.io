class FontTestPlatform {
  canvas;
  props = {};
  state = {};
  refs = {};

  constructor() {
    this.app = new PIXI.Application({
      width: 1040,
      height: 960,
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
      fontSize: 9,
      align: "center",
      stroke: 0x4c011f,
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: 0x4c011f,
      dropShadowDistance: 10,
      dropShadowBlur: 9,
      dropShadowAngle: 0.937,
    //   dropShadowAlpha: 0.5,
    //   dropShadowColor: "#e12323",
    };
    let step = function (index) {
      return -25 + index * 70;
    };

    // const baseText = this._initBaseText("Test render - base", style);
    // baseText.y = step(1);
    // this.app.stage.addChild(baseText);

    for (let index = 1; index < 10; index++) {
      const fontSize = style.fontSize * index;
      const doubleRender = this._initDoubleRender(
        "Test render - " + fontSize,
        { ...style, fontSize: fontSize },
        this.md.is("iPhone")
        // true
      );
      doubleRender.y = step(index);
      this.app.stage.addChild(doubleRender);
    }

    for (let index = 1; index < 10; index++) {
      const fontSize = style.fontSize * index;
      const doubleRender = this._initDoubleRender(
        "Base render - " + fontSize,
        { ...style, fontSize: fontSize },
        false
      );
      doubleRender.x = 550;
      doubleRender.y = step(index);
      this.app.stage.addChild(doubleRender);
    }
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

      const shadowCount = 4; // - Math.round((32 * 5) / shadowStyle.fontSize);
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
