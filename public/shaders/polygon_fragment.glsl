precision mediump float;

varying vec2 v_uv;
 
// The texture.
uniform float tx;
uniform float ty;
uniform float tw;
uniform float th;
uniform sampler2D texture;

uniform vec4 rgba;

void main() {

  vec2 uv = v_uv;

  gl_FragColor = texture2D(texture, uv) * rgba;

}