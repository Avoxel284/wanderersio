precision mediump float;

varying vec2 v_uv;

// The texture.
uniform float tx;
uniform float ty;
uniform float tw;
uniform float th;

uniform float alpha;
uniform float dissolve;
uniform float creation;

uniform float palette;

uniform sampler2D texture;
uniform sampler2D paletteTexture;
uniform sampler2D dissolveMap;

uniform vec4 color;

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}

void main() {

  vec2 uv = v_uv;

  uv.x *= tw;
  uv.x += tx;
  uv.y *= th;
  uv.y += ty;

  vec4 rgba = texture2D(texture, uv);

  if (creation > 0.0) {

    if (creation >= 1.0) discard;

    vec2 cuv = v_uv;

    cuv.x -= 0.5;
    cuv.y -= 0.5;

    float dist = sqrt(dot(cuv, cuv)) + sin(cuv.x * 30.0) * 0.05;

    if ((dist * 0.8) > (1.0 - creation) * 0.5) {

      discard;

    } else if (dist > (1.0 - creation) * 0.5) {

      vec4 rgba = texture2D(texture, uv);

      if (rgba.a <= 0.0 || alpha < 1.0) discard;

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

  rgba.a *= alpha;

  float a = rgba.a;

  rgba = mix(rgba, color, color.a);
  rgba.a = a;

  if(dissolve > 0.0) {

    vec4 dsv = texture2D(dissolveMap, uv);

    /*float dst = abs(dsv.r - (1.0 - dissolve)) * 3.0;
    
    if(dissolve < 0.9) {
    
    float d = 1.0;

    d = 1.0 + 1.0 - min(0.1, dst) / 0.1;

    rgba.r *= d;
    rgba.g *= d;
    rgba.b *= d;

  }

  */

    rgba.a *= float(dsv.r <= 1.0 - dissolve);

  }

  gl_FragColor = rgba;

}