precision mediump float;

varying vec2 v_uv;

// The texture.
uniform float tx;
uniform float ty;
uniform float tw;
uniform float th;
uniform float texture_width;
uniform float texture_height;
uniform float random;
uniform float damage;
uniform sampler2D texture;

uniform float color;
uniform float outline;
uniform float alpha;

float rand(vec2 co) {

  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);

}


vec4 parseColor(float c) {

  vec4 rgb;

  rgb.b = mod(c, 256.0);
  rgb.g = mod(c / 256.0, 256.0);
  rgb.r = mod(c / 65536.0, 256.0);
  // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!
  rgb /= 255.0;
  rgb.a = alpha;

  return rgb;

}

void main() {

  vec2 uv = v_uv;

  uv.x *= tw;
  uv.x += tx;
  uv.y *= th;
  uv.y += ty;

  if (color > 0.0) {

    vec4 rgb;

    rgb.b = mod(color, 256.0);
    rgb.g = mod(color / 256.0, 256.0);
    rgb.r = mod(color / 65536.0, 256.0);
    // now we have a vec3 with the 3 components in range [0..255]. Let's normalize it!
    rgb /= 255.0;
    rgb.a = alpha;
    rgb *= texture2D(texture, uv).a;

    gl_FragColor = rgb;

  } else {

    float pixel_width = 1.0 / texture_width;
    float pixel_height = 1.0 / texture_height;

    vec4 finalColor = texture2D(texture, uv);

    float r = mod((uv.x * uv.y) * 2147483647.0 * 16807.0, 2147483647.0) / 2147483647.0;

    finalColor.a = alpha * finalColor.a;

    if (damage > 0.0) {

      float rr = rand(vec2(floor((v_uv.x + random) / 0.15) * 0.15, floor((v_uv.y + random) / 0.15) * 0.15));

      // if (mod(random * 10.0 + v_uv.x + v_uv.y + damagePixel.r, 1.0) < damage * 0.8) {
      // if (mod(random * 10.0 + v_uv.x + v_uv.y + damagePixel.r, 1.0) < damage * 0.8) {
      if (rr < damage) {

        vec2 damageScan = vec2(
          80.0 / 1024.0 + mod(v_uv.x * 1.0, 1.0) * 11.0 / 1024.0,
          14.0 / 1024.0 + mod(v_uv.y * 1.0, 1.0) * 11.0 / 1024.0
        );

        vec4 damagePixel = texture2D(texture, damageScan);

        damagePixel = 1.0 - damagePixel;

        finalColor.r = finalColor.r + (damagePixel.r * finalColor.r - finalColor.r) * (0.75 + 0.5 * rr);
        finalColor.g = finalColor.g + (damagePixel.g * finalColor.g - finalColor.g) * (0.75 + 0.5 * rr);
        finalColor.b = finalColor.b + (damagePixel.b * finalColor.b - finalColor.b) * (0.75 + 0.5 * rr);

        // finalColor.r = finalColor.r + (damagePixel.r - finalColor.r) * 0.8;
        // finalColor.g = finalColor.g + (damagePixel.g - finalColor.g) * 0.8;
        // finalColor.b = finalColor.b + (damagePixel.b - finalColor.b) * 0.8;

        // finalColor = mix(finalColor, damagePixel, 1.0);

      }

    }



    if (outline > 0.0) {

      if (finalColor.a <= 0.0) {

        bool yes = false;

        if (texture2D(texture, vec2(uv.x + pixel_width, uv.y)).a > 0.0) yes = true;
        else if (texture2D(texture, vec2(uv.x - pixel_width, uv.y)).a > 0.0) yes = true;
        else if (texture2D(texture, vec2(uv.x, uv.y + pixel_width)).a > 0.0) yes = true;
        else if (texture2D(texture, vec2(uv.x, uv.y - pixel_width)).a > 0.0) yes = true;

        if (yes) {

          finalColor = parseColor(outline);

        }


      }

    }



    // 80 14 11 11

    gl_FragColor = finalColor;

  }

}