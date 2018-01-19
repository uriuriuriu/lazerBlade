attribute vec3 position;
attribute vec4 color;
uniform   vec2 mouse;
uniform  float time;
varying   vec4 vColor;
varying   vec2 vTexCoord;

float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
void main(){
    vec3 v = vec3(mouse, 0.0);
    gl_Position = vec4(position + v, 1.0);

    vColor = color;
//    gl_PointSize = 10. + rnd(mouse + mod(time, 10.0))* 10.0;
    gl_PointSize = 28.0;
//    gl_Position = mvpMatrix * vec4(position, 1.0);
//    gl_Position = vec4(position, 1.0);
//    vTexCoord = (position.xy + 1.0) * 0.5;
//    gl_Position = vec4(position, 1.0);
//    vTexCoord = (position.xy + 1.0) * 0.5;

//    vColor = color;
}
