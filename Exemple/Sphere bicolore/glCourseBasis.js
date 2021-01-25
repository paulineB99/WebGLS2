
// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
mat4.identity(objMatrix);
var color1, color2 = [1,0,0];
var colorLight, specularLight = [1,1,1];
var SRCPower = [];
var SRCPosLight = [];
// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);
	// code ajouter pour les slides
	initiatButtonColors();
	buttonColors();
	slidePower();
	slidePosLight();
	
	//-----------
	initBuffers();
	loadShaders('shader');

	gl.clearColor(0.7, 0.7, 0.7, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

//----------------Ajout pour les slide et boutons----------------
// =====================================================

function slidePower() {
	var sliderPower = document.getElementById("powerRange");
	SRCPower = [sliderPower.value, sliderPower.value, sliderPower.value];
	sliderPower.oninput = function() {
		SRCPower = [this.value, this.value, this.value];
	}
}

function slidePosLight() {
	var sliderPosLight = [document.getElementById("xRange"), document.getElementById("yRange"), document.getElementById("zRange")];
	SRCPosLight = [sliderPosLight[0].value, sliderPosLight[1].value, sliderPosLight[2].value];
	sliderPosLight.oninput = function() {
		SRCPosLight = [this.value, this.value, this.value];
	}	
}

function initiatButtonColors(){
	document.getElementById("red1").checked = true;
	document.getElementById("green2").checked = true;
	document.getElementById("whiteLight").checked = true;
}

function buttonColors() {
	if(document.getElementById("red1").checked) {
		color1 = [1,0,0];
	}else if(document.getElementById("green1").checked) {
		color1 = [0,1,0];
	}else if(document.getElementById("blue1").checked) {
		color1 = [0,0,1];
	}
	if(document.getElementById("red2").checked) {
		color2 = [1,0,0];
	}else if(document.getElementById("green2").checked) {
		color2 = [0,1,0];
	}else if(document.getElementById("blue2").checked) {
		color2 = [0,0,1];
	}
	if(document.getElementById("redLight").checked) {
		colorLight = [1,0.6,0.6];
		specularLight = [1,0.2,0.2];
	}else if(document.getElementById("greenLight").checked) {
		colorLight = [0.6,1,0.6];
		specularLight = [0.2,1,0.2];
	}else if(document.getElementById("blueLight").checked) {
		colorLight = [0.6,0.6,1];
		specularLight = [0.2,0.2,1];
	}else if(document.getElementById("whiteLight").checked) {
		colorLight = [1,1,1];
		specularLight = [1,1,1];
	}else if(document.getElementById("hotLight").checked) {
		colorLight = [1,0.9,0.7];
		specularLight = [1,0.6,0.5];
	}else if(document.getElementById("coldLight").checked) {
		colorLight = [0.7,0.9,1];
		specularLight = [0.5,0.6,1];
	}
	gl.clearColor(0.7*colorLight[0], 0.7*colorLight[1], 0.7*colorLight[2], 1.0);
}


function refresh() {
	buttonColors();
	slidePower();
	slidePosLight();
	
	initBuffers();
	loadShaders('shader');
}

// =====================================================

function setPointFromAngles(r,th, ph){
	ct = Math.cos(th);
	st = Math.sin(th);
	cp = Math.cos(ph);
	sp = Math.sin(ph);

	return  [r*st*cp, r*st*sp, r*ct];

}
// =====================================================

function initBuffers() {
	NB = 20;
	radius = 0.5;
	dTh = Math.PI / NB;
	dPh =dTh;

	vertices = [];
	colors = [];
	normals = [];

	for(var i=0; i<NB; i++){
		var th1 = i*dTh;
		var th2 = th1 + dTh;
		for(var j=0; j<2*NB; j++){
			var ph1 = j*dPh;
			var ph2 = ph1+dPh;

			P1 = setPointFromAngles(radius,th1,ph1);
			P2 = setPointFromAngles(radius,th2,ph1);
			P3 = setPointFromAngles(radius,th2,ph2);
			P4 = setPointFromAngles(radius,th1,ph2);

			//Une normal par point
			N1 = setPointFromAngles(1.0,th1,ph1); // 1.0 car la normale doit être normalisé
			N2 = setPointFromAngles(1.0,th2,ph1);
			N3 = setPointFromAngles(1.0,th2,ph2);
			N4 = setPointFromAngles(1.0,th1,ph2);

			vertices.push(P1[0], P1[1], P1[2]);
			normals.push( N1[0], N1[1], N1[2]);
			vertices.push(P2[0], P2[1], P2[2]);
			normals.push( N2[0], N2[1], N2[2]);
			vertices.push(P4[0], P4[1], P4[2]);
			normals.push( N4[0], N4[1], N4[2]);
			colors.push(color1[0], color1[1], color1[2],
						color1[0], color1[1], color1[2],
						color1[0], color1[1], color1[2]
				);

			vertices.push(P2[0], P2[1], P2[2]);
			normals.push( N2[0], N2[1], N2[2]);
			vertices.push(P3[0], P3[1], P3[2]);
			normals.push( N3[0], N3[1], N3[2]);
			vertices.push(P4[0], P4[1], P4[2]);
			normals.push( N4[0], N4[1], N4[2]);
			colors.push(color2[0], color2[1], color2[2],
						color2[0], color2[1], color2[2],
						color2[0], color2[1], color2[2]
				);
	
		}
	}

	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = vertices.length/3;

	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	colorBuffer.itemSize = 3;
	colorBuffer.numItems = colors.length/3;

	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	normalBuffer.itemSize = 3;
	normalBuffer.numItems = normals.length/3;

}
//======================================================
//fonction ajouter de debug -> a supprimer avant de rendre le code
function getPowerBuffer(){
	gl.bindBuffer(gl.ARRAY_BUFFER, powerBuffer);
	var dataview = new DataView(powerBuffer);
	dataview.powerBuffer;
}
// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
  }
  xhttp.open("GET", filename+ext, true);
  xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.SRCPowUniform = gl.getUniformLocation(shaderProgram, "aVertexPower");
	gl.uniform3fv(shaderProgram.SRCPowUniform, SRCPower);
	
	
	
	shaderProgram.SRCPosUniform = gl.getUniformLocation(shaderProgram, "aVertexPosLight");
	gl.uniform3fv(shaderProgram.SRCPosUniform, SRCPosLight);

	shaderProgram.SRCColUniform = gl.getUniformLocation(shaderProgram, "aVertexColorLight");
	gl.uniform3fv(shaderProgram.SRCColUniform, colorLight);

	shaderProgram.speColUniform = gl.getUniformLocation(shaderProgram, "aVertexSpecularLight");
	gl.uniform3fv(shaderProgram.speColUniform, specularLight);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.rMatrixUniform = gl.getUniformLocation(shaderProgram, "uRMatrix");
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
      	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
		  colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		  
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
		  normalBuffer.itemSize, gl.FLOAT, false, 0, 0);	

}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(shaderProgram.rMatrixUniform, false, objMatrix);
	}
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if(shaderProgram != null) {
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
		mat4.multiply(mvMatrix, objMatrix);

		setMatrixUniforms();

		gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numItems);
	}
}