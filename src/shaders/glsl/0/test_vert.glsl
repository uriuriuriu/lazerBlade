// JavaScript から VBO 経由で送られてきた頂点座標
attribute vec3 position;
uniform vec2 mouse;
// 頂点シェーダプログラムのエントリポイントとなる関数（名前は必ず main とする）
void main(){
    // マウスカーソルの値を反映してみる（その１） @@@
    vec3 v = vec3(mouse, 0.0);
    gl_Position = vec4(position + v, 1.0);

    // マウスカーソルの値を反映してみる（その２） @@@
//     float f = abs(mouse.x);
//     gl_Position = vec4(position * f, 1.0);

    // マウスカーソルの値を反映してみる（その３） @@@
//     float f = length(mouse);
//     gl_Position = vec4(position * f, 1.0);

    // 頂点の大きさは頂点シェーダで設定する
    gl_PointSize = 28.0;
}
