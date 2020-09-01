/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader (gl, type, source) {
  let shader = gl.createShader(type);
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  
  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
}

function createProgram (gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  
  if (success) {
    return program;
  }

  gl.deleteProgram(program);
}

function main () {
  // Get A WebGL context
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl2");
  
  if (!gl) {
    return;
  }

  // Get the strings for our GLSL shaders
  let vertexShaderSource = document.getElementById("vertex-shader").text;
  let fragmentShaderSource = document.getElementById("fragment-shader").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  let program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  let positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  let size = 2;          // 2 components per iteration
  let type = gl.FLOAT;   // the data is 32bit floats
  let normalize = false; // don't normalize the data
  let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0;        // start at the beginning of the buffer
  
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  // draw
  let primitiveType = gl.TRIANGLES;
  let count = 3;
  
  gl.drawArrays(primitiveType, offset, count);
}

main();
