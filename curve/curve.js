/**
 * 分形
 * @author Philip
 */

/**
 * 创建shader
 * @return {webgl} gl
 */
function createGl () {
    // 获取上下文
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    var vertCode = document.getElementById('vertex-shader').innerText;
    var fragCode = document.getElementById('fragment-shader').innerText;
    
    gl.shaderSource(vertShader, vertCode);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);
    
    var shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
}

/**
 * 获取贝塞尔曲线上的点
 * @param {*} points 
 * @param {*} offset 
 * @param {*} t 
 */
function getPointOnBezierCurve(points, offset, t) {
    const invT = (1 - t);
    return v2.add(v2.mult(points[offset + 0], invT * invT * invT),
                  v2.mult(points[offset + 1], 3 * t * invT * invT),
                  v2.mult(points[offset + 2], 3 * invT * t * t),
                  v2.mult(points[offset + 3], t * t  *t));
}

/**
 * 获取全部在贝塞尔曲线上的点
 * @param {*} points 
 * @param {*} offset 
 * @param {*} numPoints 
 */
function getPointsOnBezierCurve(points, offset, numPoints) {
    const points = [];
    
    for (let i = 0; i < numPoints; ++i) {
      const t = i / (numPoints - 1);
      points.push(getPointOnBezierCurve(points, offset, t));
    }

    return points;
}

/**
 * 
 * @param {*} points 
 * @param {*} offset 
 * @param {*} tolerance 
 * @param {*} newPoints 
 */
function getPointsOnBezierCurveWithSplitting (points, offset, tolerance, newPoints) {
    const outPoints = newPoints || [];
    
    if (flatness(points, offset) < tolerance) {
        // 将它加入点队列中
        outPoints.push(points[offset + 0]);
        outPoints.push(points[offset + 3]);
    } else {
        // 拆分
        const t = .5;
        const p1 = points[offset + 0];
        const p2 = points[offset + 1];
        const p3 = points[offset + 2];
        const p4 = points[offset + 3];

        const q1 = v2.lerp(p1, p2, t);
        const q2 = v2.lerp(p2, p3, t);
        const q3 = v2.lerp(p3, p4, t);

        const r1 = v2.lerp(q1, q2, t);
        const r2 = v2.lerp(q2, q3, t);

        const red = v2.lerp(r1, r2, t);

        // 求前半段的点
        getPointsOnBezierCurveWithSplitting([p1, q1, r1, red], 0, tolerance, outPoints);
        // 求后半段的点
        getPointsOnBezierCurveWithSplitting([red, r2, q3, p4], 0, tolerance, outPoints);
    }

    return outPoints;
}

/**
 * 
 * @param {*} points 
 * @param {*} start 
 * @param {*} end 
 * @param {*} epsilon 
 * @param {*} newPoints 
 */
function simplifyPoints(points, start, end, epsilon, newPoints) {
    const outPoints = newPoints || [];
   
    // 找到离最后两点距离最远的点
    const s = points[start];
    const e = points[end - 1];
    let maxDistSq = 0;
    let maxNdx = 1;

    for (let i = start + 1; i < end - 1; ++i) {
      const distSq = v2.distanceToSegmentSq(points[i], s, e);
      if (distSq > maxDistSq) {
        maxDistSq = distSq;
        maxNdx = i;
      }
    }
   
    // 如果距离太远
    if (Math.sqrt(maxDistSq) > epsilon) {
      // 拆分
      simplifyPoints(points, start, maxNdx + 1, epsilon, outPoints);
      simplifyPoints(points, maxNdx, end, epsilon, outPoints);
   
    } else {
   
      // 添加最后两个点
      outPoints.push(s, e);
    }
   
    return outPoints;
  }

/**
 * 初始化顶点
 * @param {webgl} gl
 * @param {} 
 * @return void
 */
function initVertex (gl, ) {
    // 定义线段数组
    var vertices = [
        -0, -0, 0,
        -0, 0.6, 0,
        -0.3, -0.3, 0,
        0.2, 0.6, 0,
        0.3, -0.3, 0,
        0.7, 0.6, 0
    ]

    // 关联着色器程序到缓冲对象
    var coord = gl.getAttribLocation(shaderProgram, 'coordinates');
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
} 

/**
 * 绘制曲线
 * @param {webgl} gl
 * @param {} 
 * @return void
 */
function draw (gl) {
    // 画线
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawArrays(gl.LINES, 0, 2);
} 

/**
 * 主函数
 * @return void
 */
function main () {
    const gl = createGl()
    initVertex(gl)
    draw(gl)
}