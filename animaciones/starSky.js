var canvas = document.getElementById("canvas");
      var gl = canvas.getContext("webgl");
      var program;

      var stars = [];
      var numStars = 1000;
      var maxPointSize = 3.0;
      var minPointSize = 1.0;
      var pointSizeRange = maxPointSize - minPointSize;
      var theta = 0;
      var speed = 0.0000003;

      function createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      }

      function createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        return program;
      }

      function initShaders() {
        var vertexShaderSource = `
          attribute vec2 a_position;
          attribute float a_size;
          uniform float u_theta;
          uniform vec2 u_resolution;

          void main() {
            vec2 scaledPosition = a_position * u_resolution / 0.5;
            float rotation = u_theta * length(scaledPosition);
            mat2 rotationMatrix = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
            vec2 rotatedPosition = rotationMatrix * scaledPosition;

            vec2 clipSpace = (rotatedPosition / u_resolution) * 2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            gl_PointSize = a_size;
          }
        `;

        var fragmentShaderSource = `
          precision mediump float;

          void main() {
            vec2 normalizedCoords = gl_PointCoord * 2.0 - 1.0;
            float distance = length(normalizedCoords);

            if (distance > 1.0) {
              discard;
            }

            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - distance);
          }
        `;

        var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        program = createProgram(gl, vertexShader, fragmentShader);

        gl.useProgram(program);
      }

      function initStars() {
        stars = [];
        for (var i = 0; i < numStars; i++) {
          var x = Math.random() * 2 - 1;
          var y = Math.random() * 2 - 1;
          var size = Math.random() * pointSizeRange + minPointSize;
          var star = [x, y, size];
          stars.push(star);
        }

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(stars)), gl.STATIC_DRAW);

        var aPosition = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 12, 0);

        var sizeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getSizes(stars)), gl.STATIC_DRAW);

        var aSize = gl.getAttribLocation(program, "a_size");
        gl.enableVertexAttribArray(aSize);
        gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);
      }

      function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var uTheta = gl.getUniformLocation(program, "u_theta");
        gl.uniform1f(uTheta, theta);

        var uResolution = gl.getUniformLocation(program, "u_resolution");
        gl.uniform2f(uResolution, canvas.width, canvas.height);

        gl.drawArrays(gl.POINTS, 0, numStars);

        theta += speed;
        requestAnimationFrame(render);
      }

      function flatten(array) {
        return array.reduce(function (acc, val) {
          return acc.concat(val);
        }, []);
      }

      function getSizes(array) {
        return array.map(function (val) {
          return val[2];
        });
      }

      function updateSpeed(value) {
        speed = parseFloat(value);
      }

      function updateNumStars(value) {
        numStars = parseInt(value);
        initStars();
      }

      function main() {
        canvas.width = window.innerWidth;
        canvas.height =  window.innerHeight;

        gl.viewport(0, 0, canvas.width, canvas.height);

        initShaders();
        initStars();
        render();
      }

      main();