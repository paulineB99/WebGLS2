
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
var powLight = [5,5,5];
var color = [1,0,0];
var colorLight = [1,1,1];
var specularLight = [1,1,1];

var SRCpos = [0,0,0];
// =====================================================

var OBJ1 = null;
var PLANE = null;


// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

//------ Code ajouter pour la personalisation des paramètres ------
function slidePower() {
 var sliderPower = document.getElementById("powerRange");
	powLight = [sliderPower.value, sliderPower.value, sliderPower.value];
	sliderPower.oninput = function() {
		powLight = [this.value, this.value, this.value];
	} 
}
	
function initiatButtonColors(){
	document.getElementById("red").checked = true;
	document.getElementById("whiteLight").checked = true;
}

function buttonColors() {
	if(document.getElementById("red").checked) {
		color = [1,0,0];
	}else if(document.getElementById("green").checked) {
		color = [0,1,0];
	}else if(document.getElementById("blue").checked) {
		color = [0,0,1];
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
		specularLight = [1,0.9,0.7];
	}else if(document.getElementById("coldLight").checked) {
		colorLight = [0.7,0.9,1];
		specularLight = [0.7,0.9,1];
	}
	gl.clearColor(0.7*colorLight[0], 0.7*colorLight[1], 0.7*colorLight[2], 1.0);
}	
function slidePosLight() {
	var sliderPosLight = [document.getElementById("xSRCPos"), document.getElementById("ySRCPos"), document.getElementById("zSRCPos")];
	SRCpos = [sliderPosLight[0].value, sliderPosLight[1].value, sliderPosLight[2].value];
	sliderPosLight.oninput = function() {
		SRCpos = [this.value, this.value, this.value];
	}	
}	
	

function refresh() {
	buttonColors();
	slidePower();
	slidePosLight();	
	loadShaders(this);
}


class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		this.shaderName = 'obj';
		this.loaded = -1;
		this.shader = null;
		this.mesh = null;
		
		loadObjFile(this);
		loadShaders(this);
	}
	
	
	


	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);
		
		
		
		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		this.shader.SRCPowUniform = gl.getUniformLocation(this.shader, "aVertexPower");
		gl.uniform3fv(this.shader.SRCPowUniform, powLight);
		
		this.shader.SRCPosUniform = gl.getUniformLocation(this.shader, "aPosLight");
		gl.uniform3fv(this.shader.SRCPosUniform, SRCpos);
		
		this.shader.colorUniform = gl.getUniformLocation(this.shader, "aVertexColor");
		this.shader.SRCColUniform = gl.getUniformLocation(this.shader, "aVertexSRCCol");
		this.shader.speColUniform = gl.getUniformLocation(this.shader, "aVertexSpeCol");
		
		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		
		
		
		gl.uniform3fv(this.shader.colorUniform, color);
		gl.uniform3fv(this.shader.SRCColUniform, colorLight);
		gl.uniform3fv(this.shader.speColUniform, specularLight);
		
		
	}
	
	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
	}
	
	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4 && this.mesh != null) {
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
		
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.0,
			 size, -size, 0.0,
			 size, size, 0.0,
			-size, size, 0.0
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);
		
		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	}


	// --------------------------------------------
	setMatrixUniforms() {
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, distCENTER);
			mat4.multiply(mvMatrix, rotMatrix);
			gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms(this);
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}

}


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================



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


// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
		}
	}

	xhttp.open("GET", "bunny.obj", true);
	xhttp.send();
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.shaderName+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	//Initialisation du canvas, de plane et de l'objet + load les shader
	initGL(canvas);
	initiatButtonColors();
	PLANE = new plane();
	OBJ1 = new objmesh('bunny.obj');
	refresh();
	
	gl.clearColor(0.7, 0.7, 0.7, 1.0); // couleur du fond 
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE); //pas dans le code de base
	gl.cullFace(gl.BACK);  // pas dans le code de base

	

	//a mettre dans drawscene 
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]);
	
	
	
	tick();
}

// =====================================================
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT);

	// add the if shaderProgram != null
	PLANE.draw();
	OBJ1.draw();
}



