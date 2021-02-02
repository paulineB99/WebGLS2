
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
// =====================================================

var OBJ1 = null;
var PLANE = null;
var OBJ2 = null;
var OBJ3 = null;
var OBJ4 = null;

// =====================================================

//var kd = [0.6, 0.1, 0.1];
var kdPlan = [0.1, 0.1, 0.1];
var kdLapin = [0.6, 0.1, 0.1];
var kdPorsche = [0.6, 0.1, 0.1];
var kdFord = [0.6, 0.1, 0.1];
//var alpha = 0.3;
var alphaPlan = 1;
var alphaLapin = 0.3;
var alphaPorsche = 0.3;
var alphaFord = 0.3;
var refl = 0.6;
var reflLapin = 0.6;
var lisse = 100.0;
var lisseLapin = 100.0;


// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		this.shaderName = 'obj';
		this.loaded = -1;
		this.shader = null;
		this.mesh = null;
		
		loadObjFile(this); //charge l'obj
		loadShaders(this); // charge les shaders
	}

	// --------------------------------------------
	setShadersParams(kd, alpha) {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");

		this.shader.cAttrib = gl.getUniformLocation(this.shader, "aVertexKd");
		gl.uniform3fv(this.shader.cAttrib, kd);

		this.shader.cAlpha = gl.getUniformLocation(this.shader, "aAlpha");
		gl.uniform1f(this.shader.cAlpha, alpha);

		this.shader.cRefl = gl.getUniformLocation(this.shader, "aReflectance");
		gl.uniform1f(this.shader.cRefl, refl);
		
		this.shader.cLisse = gl.getUniformLocation(this.shader, "aLisse");
		gl.uniform1f(this.shader.cLisse, lisse);
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
	draw(kd, alpha) {
		if(this.shader && this.loaded==4 && this.mesh != null) {
			this.setShadersParams(kd, alpha);
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================
/*
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

		var texcoords = [ //coordonée de texture
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer(); //vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer(); //texture buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader); // important de dire quel program shader on utilise

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

	//Les deux methode setMatrixUniform et setShaderParams peuvent être fussionner 
	// --------------------------------------------
	setMatrixUniforms() {
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, distCENTER);
			mat4.multiply(mvMatrix, rotMatrix);
			gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix); //construit les matrix
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
*/
// =====================================================
// FONCTIONS POUR L'INTERFACE
// =====================================================

function initiatButton(){
	document.getElementById("redLapin").checked = true;
	document.getElementById("redSphere").checked = true;
	document.getElementById("redPorsche").checked = true;
	document.getElementById("redFord").checked = true;
}

function slideAlpha() {
	var sliderAlphaLapin = document.getElementById("alphaLapin");
	alphaLapin = sliderAlphaLapin.value;
	sliderAlphaLapin.oninput = function(){
		alphaLapin = this.value;
	}
	var sliderAlphaSphere = document.getElementById("alphaSphere");
	alphaSphere = sliderAlphaSphere.value;
	sliderAlphaSphere.oninput = function(){
		alphaSphere = this.value;
	}
	var sliderAlphaPorsche = document.getElementById("alphaPorsche");
	alphaPorsche = sliderAlphaPorsche.value;
	sliderAlphaPorsche.oninput = function(){
		alphaPorsche = this.value;
	}
	var sliderAlphaFord = document.getElementById("alphaFord");
	alphaFord = sliderAlphaFord.value;
	sliderAlphaFord.oninput = function(){
		alphaFord = this.value;
	}
}
function slideReflectance() {
	var sliderReflLapin = document.getElementById("brillanceLapin");
	reflLapin = sliderReflLapin.value;
	sliderReflLapin.oninput = function() {
		reflLapin = this.value;
	}
	var sliderReflSphere = document.getElementById("brillanceSphere");
	reflSphere = sliderReflSphere.value;
	sliderReflSphere.oninput = function() {
		reflSphere = this.value;
	}
	var sliderReflPorsche = document.getElementById("brillancePorsche");
	reflPorsche = sliderReflPorsche.value;
	sliderReflPorsche.oninput = function() {
		reflPorsche = this.value;
	}
	var sliderReflFord = document.getElementById("brillanceFord");
	reflFord = sliderReflFord.value;
	sliderReflFord.oninput = function() {
		reflFord = this.value;
	}

}
function slideRugosite() {
	var sliderLisseLapin = document.getElementById("lisseLapin");
	lisseLapin = sliderLisseLapin.value;
	sliderLisseLapin.oninput = function() {
		lisseLapin= this.value;
	}
	var sliderLisseSphere = document.getElementById("lisseSphere");
	lisseSphere = sliderLisseSphere.value;
	sliderLisseSphere.oninput = function() {
		lisseSphere= this.value;
	}
	var sliderLissePorsche = document.getElementById("lissePorsche");
	lissePorsche = sliderLissePorsche.value;
	sliderLissePorsche.oninput = function() {
		lissePorsche= this.value;
	}
	var sliderLisseFord = document.getElementById("lisseFord");
	lisseFord = sliderLisseFord.value;
	sliderLisseFord.oninput = function() {
		lisseFord= this.value;
	}
}
function buttonBehaviour(){
	if(document.getElementById("redLapin").checked) {
		kdLapin = [0.6,0.1,0.1];
	}else if(document.getElementById("greenLapin").checked) {
		kdLapin = [0,1,0];
	}else if(document.getElementById("blueLapin").checked) {
		kdLapin = [0,0,1];
	}
	if(document.getElementById("redSphere").checked) {
		kdSphere = [0.6,0.1,0.1];
	}else if(document.getElementById("greenSphere").checked) {
		kdSphere = [0,1,0];
	}else if(document.getElementById("blueSphere").checked) {
		kdSphere = [0,0,1];
	}
	if(document.getElementById("redPorsche").checked) {
		kdPorsche = [0.6,0.1,0.1];
	}else if(document.getElementById("greenPorsche").checked) {
		kdPorsche = [0,1,0];
	}else if(document.getElementById("bluePorsche").checked) {
		kdPorsche = [0,0,1];
	}
	if(document.getElementById("redFord").checked) {
		kdFord = [0.6,0.1,0.1];
	}else if(document.getElementById("greenFord").checked) {
		kdFord = [0,1,0];
	}else if(document.getElementById("blueFord").checked) {
		kdFord = [0,0,1];
	}
}

function refresh() {
	buttonBehaviour();
	slideAlpha();
	slideReflectance();
	slideRugosite();
	loadShaders(OBJ1);
	loadShaders(OBJ2);;
	loadShaders(OBJ3);
	loadShaders(OBJ4);
	console.log("refresh");
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


		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK); // on enleve les faces qui nous tourne le dos en fonction de la normale
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest(); // dreation de requete html

	xhttp.onreadystatechange = function() { //création d'une fonction pour quand je fichier serra arrivée
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
		}
	}

	xhttp.open("GET", OBJ3D.objName , true);
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

	initGL(canvas);// initialise le contexte GL avec le canva

	//Initialisation du calcul d'image
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	//point d'observation
	distCENTER = vec3.create([0,-0.2,-3]);
	
	//PLANE = new plane();
	OBJ1 = new objmesh('bunny.obj');
	OBJ2 = new objmesh('plane.obj');
	OBJ3 = new objmesh('porsche.obj');
	OBJ4 = new objmesh('ford.obj')
	//Si on veut ajouter un obj on creer juste un nouvel objet et on l'appel dans drawScene
	


	tick();//point de déclenchement de l'affichage
}

// =====================================================
function drawScene() {
	// A chaque fois qu'on actulaise la scene on efface l'image et on rédessine le plan et l'objet
	gl.clear(gl.COLOR_BUFFER_BIT);
	//PLANE.draw();

	OBJ1.draw(kdLapin, alphaLapin);
	OBJ2.draw(kdPlan, alphaPlan);
	OBJ3.draw(kdPorsche, alphaPorsche);
	OBJ4.draw(kdFord, alphaFord);
}



