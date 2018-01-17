// JavaScript から VBO 経由で送られてきた頂点座標
attribute vec3 position;
attribute vec2 texCoord;  // 頂点のテクスチャ座標
// uniform vec2 mouse;
varying vec2 vTexCoord; // フラグメントシェーダへ送るテクスチャ座標
// 頂点シェーダプログラムのエントリポイントとなる関数（名前は必ず main とする）
void main(){
    // マウスカーソルの値を反映してみる（その１） @@@
//    vec3 v = vec3(mouse, 0.0);
//    gl_Position = vec4(position + v, 1.0);

    // マウスカーソルの値を反映してみる（その２） @@@
//     float f = abs(mouse.x);
//     gl_Position = vec4(position * f, 1.0);

    // マウスカーソルの値を反映してみる（その３） @@@
//     float f = length(mouse);
//     gl_Position = vec4(position * f, 1.0);

    // 頂点の大きさは頂点シェーダで設定する
    gl_PointSize = 8.0;

    vTexCoord = texCoord;
    gl_Position = vec4(position, 1.0);
}
