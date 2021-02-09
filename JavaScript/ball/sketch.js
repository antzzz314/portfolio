function setup() {
    createCanvas(400, 400);
  }
  
  class Vec2 {
    constructor(_x, _y) {
      this.x = _x;
      this.y = _y;
    }
    // このベクトルと、引数のベクトルbの和を計算する
    add(b) {
      let a = this;
      return new Vec2(a.x + b.x, a.y + b.y);
    }
    // このベクトルを実数s倍したベクトルを計算する
    mul(s) {
      let a = this;
      return new Vec2(s * a.x, s * a.y);
    }
    // このベクトルの大きさを求める
    mag() {
      let a = this;
      return sqrt(a.x ** 2 + a.y ** 2);
    }
    // このベクトルと引数のベクトルbの差を求める
    sub(b) {
      let a = this;
      return new Vec2(a.x - b.x, a.y - b.y);
    }
    // このベクトルを正規化したベクトルを求める
    norm() {
      let a = this;
      return a.mul(1 / a.mag());
    }
    // このベクトルと引数のベクトルbの、ドット積（内積）を求める
    dot(b) {
      let a = this;
      return a.x*b.x + a.y*b.y;
    }
  }
  
  class Ball {
    constructor(_p, _v, _r) {
      this.p = _p; //ボールの中心の位置ベクトル
      this.v = _v; //ボールの速度ベクトル
      this.r = _r; //ボールの半径
    }
  }
  
  class Block {
    constructor(_p, _r) {
      this.p = _p; //ブロックの中心の位置ベクトル
      this.r = _r; //ブロックの半径
    }
  }
  
  // ボールを作る
  let ball = new Ball(
    new Vec2(200, 300),
    new Vec2(240, -60),
    15
  );
  
  // ブロックを作る
  let block = new Block(new Vec2(200, 150), 50);
  
  function draw() {
    // ボールを移動させる
    ball.p = ball.p.add(ball.v.mul(1 / 60));
  
    // ボールが左端か右端に来たら反射
    if ((ball.p.x < 15) || (ball.p.x > 385)) {
      ball.v.x = -ball.v.x;
    }
    // ボールが上端に来たら反射
    if ((ball.p.y < 15) || (ball.p.y > 385)) {
      ball.v.y = -ball.v.y;
    }
    // ボールとブロックの衝突判定
    let d = block.p.sub(ball.p).mag(); //距離
    if (d < (ball.r + block.r)) {
      // ぶつかっていたら、ボールの速度を反射させる
      let v = ball.v;
      let w = ball.p.sub(block.p);
      let cosTheta = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
      let n = w.norm().mul(v.mag() * cosTheta);
      let r = v.add(n.mul(2));
      ball.v = r;
    }
  
    // 画面を塗りつぶす（消去）
    background(220);
    // ボールを描画
    circle(ball.p.x, ball.p.y, 2 * ball.r);
    // ブロックを描画
    circle(block.p.x, block.p.y, 2 * block.r);
  }