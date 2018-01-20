precision mediump float;
uniform sampler2D backbuffer;
uniform sampler2D texture;    // フレームバッファに描画したレンダリング結果
//uniform float time;            // 時間の経過
uniform vec2 resolution; // スクリーン解像度 @@@
varying vec4 vColor;
varying vec2 vTexCoord;  // テクスチャ座標
//const   vec4 greenColor = vec4(0.2, 1.0, 0.5, 1.0);

void main(){
    // フレームバッファの描画結果をテクスチャから読み出す
//    vec4 samplerColor = texture2D(texture, vTexCoord);
//    gl_FragColor = vColor * rand(vColor.xz);
//    gl_FragColor = vColor * rand(vec2(0.5,0.5));
//    gl_FragColor = vColor * texture2D(backbuffer, vTexCoord);
    gl_FragColor = vColor;
//    gl_FragColor = vColor * texture2D(texture, vTexCoord);
//    gl_FragColor = texture2D(texture, vTexCoord);
//    gl_FragColor = texture2D(backbuffer, vTexCoord);

}
