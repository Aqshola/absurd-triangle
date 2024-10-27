init()

function init() {

    const canvas = document.querySelector("#my-canvas")
    const gl = canvas.getContext("webgl")
    if (!gl) {
        alert("Browser not support web gl")
    }


    //set background
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    //setup shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderConfig())
    gl.shaderSource(fragmentShader, fragmentShaderConfig())

    gl.compileShader(vertexShader)

    const statusCompileVertex = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
    if (!statusCompileVertex) {
        alert("Failed render vertex shader")
    }
    gl.compileShader(fragmentShader)

    const statusCompileFragment = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
    if (!statusCompileFragment) {
        alert("Failet render fragment shader")
    }

    const glProgram = gl.createProgram()
    gl.attachShader(glProgram, vertexShader)
    gl.attachShader(glProgram, fragmentShader)
    gl.linkProgram(glProgram)

    const statusCompileProgram = gl.getProgramParameter(glProgram, gl.LINK_STATUS)
    if (!statusCompileProgram) {
        const errorMessage = gl.getProgramInfoLog(glProgram)
        alert(errorMessage)
    }

    gl.validateProgram(glProgram)

    const statusValidateProgram = gl.getProgramParameter(glProgram, gl.LINK_STATUS)
    if (!statusValidateProgram) {
        const errorMessage = gl.getProgramInfoLog(glProgram)
        alert(errorMessage)
    }


    const triangleVertices = [
        //X  Y              
        0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ]

    const colorArray = [
        0, 1, 0,
        1, 0, 0,
        0, 0, 1
    ]



    const triangleVerticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)
    const positionAttribLocation = gl.getAttribLocation(glProgram, 'vertPosition')

    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        2,// number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE, //???
        2 * Float32Array.BYTES_PER_ELEMENT, //SIZE OF individual vertex,
        0, //offset
    )

    const colorArrayBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorArrayBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW)
    const colorAttribLocation = gl.getAttribLocation(glProgram, 'vertColor')

    gl.vertexAttribPointer(
        colorAttribLocation, //attribute location
        3,// number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE, //???
        3 * Float32Array.BYTES_PER_ELEMENT, //SIZE OF individual vertex,
        0, //offset
    )

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    //render loop
    gl.useProgram(glProgram)
    gl.drawArrays(gl.TRIANGLES, 0, 3)


}

function vertexShaderConfig() {
    return `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main(){
        fragColor = vertColor;
        gl_Position= vec4(vertPosition,0.0, 1.0);
    }

`
}
;
function fragmentShaderConfig() {
    return `
        precision mediump float;
        varying vec3 fragColor;

        void main(){
            gl_FragColor=vec4(fragColor,1.0);
        
        }
 `
}