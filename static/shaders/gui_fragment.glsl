precision mediump float;

varying vec2 v_uv;

uniform float palette;
uniform vec4 color;
uniform float alpha;
uniform float dissolve;

uniform sampler2D texture;
uniform sampler2D paletteTexture;

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}

void main() {

  vec2 uv = v_uv;

  if (dissolve > 0.0 && rand(uv) < dissolve) {

    discard;

  } 

  vec4 rgba = texture2D(texture, uv);

  gl_FragColor = mix(rgba, color, color.a);
  gl_FragColor.a = rgba.a;
  
}