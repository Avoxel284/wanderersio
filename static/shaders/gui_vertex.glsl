attribute vec2 position;
attribute vec2 uv;

uniform mat3 modelMatrix;
uniform mat3 viewMatrix;

varying vec2 v_uv;

void main() {

  vec3 pos = vec3(position, 1);

  vec2 finalPosition = (viewMatrix * modelMatrix * pos).xy;

  gl_Position = vec4(finalPosition , 0, 1);

  v_uv = uv;

}