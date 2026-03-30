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

  if (rgba.a <= 0.0) discard;
  
  if (creation > 0.0) {

    vec2 cuv = v_uv;

    cuv.x -= 0.5;
    cuv.y -= 0.5;

    float dist = sqrt(dot(cuv, cuv))+ sin(cuv.x * 30.0) *0.05;

    if ((dist * 0.8) > (1.0 - creation) * 0.5) {

      discard;

    } else if (dist > (1.0 - creation) * 0.5) {

      rgba.r *= 2.5;
      rgba.g *= 2.0;
      rgba.b *= 0.5;

      gl_FragColor = rgba;

      return;

    }

  }


  if (palette > -1.0) {

    float colorIndex = (floor(rgba.r * 32.0) / 32.0) * 32.0;

    vec2 paluv = vec2(colorIndex * (1.0 / 32.0), palette * (1.0 / 32.0));

    float a = rgba.a;

    rgba = texture2D(paletteTexture, paluv);

    rgba.a = a;

  }

  float a = rgba.a;

  rgba = mix(rgba, color, color.a);
  rgba.a = a;


  gl_FragColor = rgba;
  
}