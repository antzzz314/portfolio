



class Level{
    constructor(){
        this.tiles=[
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        this.lenX= 20;
        this.lenY= 10;
    }
    tileAt(x,y){
        if(x<0 || this.lenX<=x || y<0 || this.lenY<=y)return 1;
        return this.tiles[y*this.lenX+x];
    }
}

class Actor{
    constructor(x,y,image){
        this.x=x;
        this.y=y;
        this.image=image;
    }
}


class Camera{
    /**
     * Creates an instance of Camera.
     * @param {number} x
     * @param {number} y
     * 
     */
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class ComMove {
    /**
     * @param {Actor} actor 移動させたいアクター
     * @param {number} dx 何マス移動するか
     * @param {number} dy 何マス移動するか
     */
    constructor(actor, dx, dy) {
      let t = this;
      t.actor = actor;
      t.dx = dx;
      t.dy = dy;
      t.beginX = -1;
      t.beginY = -1;
      t.endX = -1;
      t.endY = -1;
      /** 実行したフレーム数 */
      t.f = 0;
    }
    /**
     * コマンドを1フレーム実行する
     */
    exec() {
      let t = this;
      if (t.done) return t.done; //終了しているコマンドは実行しない
      t.f++;
      if (t.f === 1) {
        // 開始地点と終了地点の座標を計算
        t.beginX = t.actor.x;
        t.beginY = t.actor.y;
        t.endX = t.actor.x + t.dx;
        t.endY = t.actor.y + t.dy;
      }
      // ↑で計算した座標の間を移動する
      t.actor.x = t.beginX + t.f*t.dx/20;
      t.actor.y = t.beginY + t.f*t.dy/20;
  
      return t.done;
    }
    /**
     * @returns {boolean} コマンドが終了していればtrue, 実行中ならfalse
     */
    get done() {
      return this.f >= 20;
    }
  }

class Game{
    constructor(){
    this.level = new Level();
    this.player = null;
    this.actors = [];
    this.camera = new Camera(0,0);
    this.commands = [];
    }
}
let game;

function setup(){
    createCanvas(480,480);
    game = new Game();
    let player= new Actor(4,2,"🐤");
    game.player = player;
      // 敵を作る
    let enemy = new Actor(2,1,'🦗');
    // 初期配置のアクター
    game.actors = [player, enemy];

}

function draw(){
    background(240);
    textAlign(LEFT, TOP); 
      // プレイヤーの入力を受け付ける
  if (keyIsPressed && game.commands.length === 0) {
    let dxy = {37:[-1,0], 38:[0,-1], 39:[1,0], 40:[0,1]}[keyCode];
    if (dxy !== undefined) {
      game.commands.push(new ComMove(game.player, dxy[0], dxy[1]));

      // 仮に、敵を移動させてみる
      game.commands.push(new ComMove(game.actors[1], 0, 1));
    }
  }
    // コマンドをすべて1フレーム分実行する
    for(let c of game.commands) {
    c.exec();
    }
  // 実行し終わったコマンドを消す
    game.commands = game.commands.filter(c => !c.done);

    let w =50;
    let p = game.player;
    let c = game.camera;
    c.x=p.x-7/2;
    c.y=p.y-7/2;
    let cx=w*c.x;
    let cy=w*c.y;
    textSize(w);
    for(let y=0;y<10;y++){
        for(let x=0;x<20;x++){
            let t = game.level.tileAt(x,y);
            let w = 50;
            if(t===1){
                text("🌲",w*x-cx,w*y-cy);
            }
        }
    }
    for(let actor of game.actors){
        text(actor.image,w*actor.x-cx,w*actor.y-cy);
    }
}