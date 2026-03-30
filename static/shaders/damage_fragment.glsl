precision mediump float;

varying vec2 v_uv;
 
// The texture.
uniform float tx;
uniform float ty;
uniform float tw;
uniform float th;
uniform sampler2D texture;

uniform float palette;
uniform sampler2D paletteTexture;
uniform sampler2D damageTexture;

uniform vec4 color;
uniform float alpha;
uniform float creation;

void main() {

  vec2 uv = v_uv;
  
  uv.x *= tw;
  uv.x += tx;  
  uv.y *= th;
  uv.y += ty;

  vec4 rgba = texture2D(texture, uv);
  vec4 overlay = texture2D(damageTexture, v_uv * 0.5);

  float a = rgba.a;

  /*
  rgba.r = mix(rgba.r, abs(rgba.r - overlay.r), alpha);
  rgba.g = mix(rgba.g, abs(rgba.g - overlay.g), alpha);
  rgba.b = mix(rgba.b, abs(rgba.b - overlay.b), alpha);
  */

  rgba.r = mix(rgba.r, rgba.r + overlay.r - 0.5, alpha);
  rgba.g = mix(rgba.g, rgba.g + overlay.g - 0.5, alpha);
  rgba.b = mix(rgba.b, rgba.b + overlay.b - 0.5, alpha);

  // rgba = mix(rgba, overlay, alpha);

  rgba.a = float(a >= 0.5);

  gl_FragColor = rgba;
  
}