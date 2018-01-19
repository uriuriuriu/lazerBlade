precision mediump float;
uniform sampler2D texture;    // フレームバッファに描画したレンダリング結果
uniform float     time;       // 時間の経過
uniform vec2      resolution; // スクリーン解像度 @@@
varying vec2      vTexCoord;  // テクスチャ座標

const   vec4      greenColor = vec4(0.2, 1.0, 0.5, 1.0);
vec4 live = vec4(0.5,1.0,0.7,1.);
vec4 dead = vec4(0.,0.,0.,1.);
float dA = 1.0;
float dB = 0.5;
float feed = 0.055;
float k = 0.062;
// ホワイトノイズを生成する乱数生成関数
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main(){
    // **そのまま描写
    // フレームバッファの描画結果をテクスチャから読み出す
    vec4 samplerColor = texture2D(texture, vTexCoord);
    gl_FragColor = samplerColor;


    // **scanline
//    // スクリーン上の座標（0.0 ~ resolution）を正規化（-1.0 ~ 1.0）する @@@
//    vec2 p = (gl_FragCoord.st / resolution) * 2.0 - 1.0;
//
//    // フレームバッファの描画結果をテクスチャから読み出す
//    vec4 samplerColor = texture2D(texture, vTexCoord);
//
//    // 簡単なモノクロ化 @@@
//    float dest = (samplerColor.r + samplerColor.g + samplerColor.b) / 3.0;
//
//    // ビネット（四隅が暗くなるような演出） @@@
//    float vignette = 1.5 - length(p);
//    dest *= vignette;
//
//    // ホワイトノイズを生成 @@@
//    float noise = rnd(gl_FragCoord.st + mod(time, 10.0));
//    dest *= noise * 0.5 + 0.5;
//
//    // ブラウン管モニタのような走査線 @@@
//    float scanLine = abs(sin(p.y * 200.0 + time * 5.0)) * 0.5 + 0.5;
//    dest *= scanLine;
//
//    // 様々なポストプロセスを乗算して出力する
//    gl_FragColor = greenColor * vec4(vec3(dest), 1.0);


// **test
//  vec2 position = ( gl_FragCoord.xy / resolution.xy );
//	vec2 pixel = 1./resolution;
//
//	float tau = 6.28318;
//  vec4 sum = texture2D(texture, vTexCoord)*-1.;
//  sum += 2.*texture2D(texture, position + pixel * vec2(-1., 0.));
//  sum += 2.*texture2D(texture, position + pixel * vec2(1., 0.));
//  sum += 2.*texture2D(texture, position + pixel * vec2(0., -1.));
//  sum += 2.*texture2D(texture, position + pixel * vec2(0., 1.));
//
//  sum += texture2D(texture, position + pixel * vec2(-1., -1.));
//  sum += texture2D(texture, position + pixel * vec2(-1., 1.));
//  sum += texture2D(texture, position + pixel * vec2(1., -1.));
//  sum += texture2D(texture, position + pixel * vec2(1., 1.));
//  sum /= 12.;
//  vec4 me = texture2D(texture, position);
//
//  float r, g, b = 0.;
//  r = sum.r;
//  g = sum.g * (1.4 - .1 * me.g) - .4 * me.b;
//  b = sum.b * .9 + .1 * me.g; //  me.b * (1. - me.b);
//  gl_FragColor = greenColor * vec4(.98*r, g, b, 1.);
}
