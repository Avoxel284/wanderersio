precision mediump float;

varying vec2 v_uv;

uniform vec4 color;

void main() {

  gl_FragColor = color * float(v_uv.x > -1.0);  

}