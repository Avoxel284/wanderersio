precision mediump float;

attribute vec2 position;
attribute vec2 uv;

uniform mat3 modelMatrix;
uniform mat3 viewMatrix;

uniform float width;
uniform float height;

varying vec2 v_uv;

// all shaders have a main function
void main() {

  vec3 pos = vec3(position, 1);
  
  pos.x *= width;
  pos.y *= height;

  vec2 finalPosition = (viewMatrix * modelMatrix * pos).xy;

  gl_Position = vec4(finalPosition, 0, 1);

  v_uv = uv;

}