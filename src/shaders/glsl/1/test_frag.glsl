// 精度修飾子の宣言（フラグメントシェーダにはほぼ必須で lowp, mediump, highp がある）
precision mediump float;
uniform vec2      mouse;         // マウスカーソルの正規化済み座標
uniform sampler2D colorTexture;  // カラーテクスチャ
uniform sampler2D heightTexture; // ハイトテクスチャ
varying vec2      vTexCoord;     // 頂点シェーダから送られてくるテクスチャ座標
const   float     focus = 0.5;   // フォーカスする深度

// フラグメントシェーダプログラムのエントリポイントとなる関数（名前は必ず main とする）
void main(){
    // シェーダから出力する色（RGBA を 0.0 ～ 1.0 で出力）
//    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

    // ハイトテクスチャから色を取得し深度として扱う
    float height = texture2D(heightTexture, vTexCoord).r - focus;

    // マウスベクトルに応じて変化するベクトルを定義
    vec2 mouseVec = -mouse * 0.025 * height;

    // マウスベクトルの影響を与えてテクスチャを参照する
    gl_FragColor = texture2D(colorTexture, vTexCoord + mouseVec);
}
