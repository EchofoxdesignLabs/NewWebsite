// src/shaders/WhiteOverlayShader.js

export const WhiteOverlayShader = {
    uniforms: {
      tDiffuse: { value: null },
      opacity: { value: 0.2 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        gl_FragColor = vec4(mix(color.rgb, vec3(1.0), opacity), color.a);
      }
    `
  };