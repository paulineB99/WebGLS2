
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
var OBJ5 = null;
var OBJ6 = null;

// =====================================================


//Gestion de Kd pour chacun des objets
//var kd = [0.6, 0.1, 0.1];
var kdPlan = [0.1, 0.1, 0.1];
var kdLapin = [0.6, 0.1, 0.1];
var kdPorsche = [0.6, 0.1, 0.1];
var kdFord = [0.6, 0.1, 0.1];
var kdSphere = [0.6, 0.1, 0.1];



//Gestion de alpha pour chacun des objets
//var alpha = 0.3;
var alphaPlan = 1;
var alphaLapin = 0.3;
var alphaPorsche = 0.3;
var alphaFord = 0.3;
var alphaSphere = 0.3;

//Gestion de la reflectance pour chacun des objets
//var refl = 0.6;
var reflLapin = 0.6;
var reflPorsche = 0.6;
var reflFord = 0.6;
var reflSphere = 0.6; 
var reflPlan = 0;

//Gestion de la rugosité pour chacun des objets
//var lisse = 100.0;
var lisseLapin = 100.0;
var lissePorsche = 100.0;
var lisseFord = 100.0;
var lisseSphere = 100.0;
var lissePlan = 1.0;

var translation =[];
// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		//this.shaderName = 'obj';
		this.loaded = -1;
		this.mesh = null;
		
        loadObjFile(this);//charge l'obj
		loadShaders(this);// charge les shaders

		this.shader1 = { fname:'obj'};
		loadShadersNEW(this.shader1);

		this.shader2 = { fname:'wire'};
		loadShadersNEW(this.shader2);
	}

	// --------------------------------------------
	setShadersParams(kd, alpha, refl, lisse) {
		//gl.useProgram(this.shader);

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		
        gl.useProgram(this.shader1.shader);


		this.shader1.vAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader1.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader1.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.nAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader1.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader1.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		/*translation = [-0.8,0.0,0.0];
		this.shader.tAttrib = gl.getUniformLocation(this.shader1.shader, "aTranslation");
		gl.uniform3fv(this.shader.tAttrib, translation);*/

		this.shader1.rMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uRMatrix");
		this.shader1.mvMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uMVMatrix");
		this.shader1.pMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uPMatrix");
		gl.uniformMatrix4fv(this.shader1.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader1.pMatrixUniform, false, pMatrix);

		this.shader1.cAttrib = gl.getUniformLocation(this.shader1.shader, "aVertexKd");
		gl.uniform3fv(this.shader1.cAttrib, kd);

		this.shader1.cAlpha = gl.getUniformLocation(this.shader1.shader, "aAlpha");
		gl.uniform1f(this.shader1.cAlpha, alpha);

		this.shader1.cRefl = gl.getUniformLocation(this.shader1.shader, "aReflectance");
		gl.uniform1f(this.shader1.cRefl, refl);
		
		this.shader1.cLisse = gl.getUniformLocation(this.shader1.shader, "aLisse");
		gl.uniform1f(this.shader1.cLisse, lisse);
	}


	setShader2Params() {

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		
		gl.useProgram(this.shader2.shader);

		this.shader2.vAttrib = gl.getAttribLocation(this.shader2.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader2.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader2.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader2.mvMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uMVMatrix");
		this.shader2.pMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uPMatrix");
		gl.uniformMatrix4fv(this.shader1.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader2.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader2.pMatrixUniform, false, pMatrix);
	}
	
	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader1.pMatrixUniform, false, pMatrix);
	}
	
	// --------------------------------------------
	draw(kd, alpha, refl, lisse ) {
		if(this.shader1.shader && this.mesh != null) {
			this.setShadersParams(kd, alpha, refl, lisse);
			 
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			
		}
	}
	draw2() {
		
		if(this.shader2.shader && this.mesh != null) {
			this.setShader2Params();
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.edgeBuffer);
			gl.drawElements(gl.LINES, this.mesh.edgeBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

}


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
	loadShaders(OBJ5);
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

			OBJ3D.mesh.indiceEdges=[];
			for (var v=0; v< OBJ3D.mesh.indices.length; v+=3){

				OBJ3D.mesh.indiceEdges.push(OBJ3D.mesh.indices[v], OBJ3D.mesh.indices[v+1],
											OBJ3D.mesh.indices[v+1], OBJ3D.mesh.indices[v+2],
											OBJ3D.mesh.indices[v+2], OBJ3D.mesh.indices[v]);
			}


			OBJ3D.mesh.edgeBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ3D.mesh.edgeBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(OBJ3D.mesh.indiceEdges), gl.STATIC_DRAW);
			OBJ3D.mesh.edgeBuffer.itemSize = 1;
			OBJ3D.mesh.edgeBuffer.numItems = OBJ3D.mesh.indiceEdges.length;
		}
	}

	xhttp.open("GET", OBJ3D.objName , true);
	xhttp.send();
}

// =====================================================
function loadShadersNEW(shader) {
	loadShaderTextNEW(shader,'.vs');
	loadShaderTextNEW(shader,'.fs');
}

// =====================================================
function loadShaderTextNEW(shader,ext) {   // lecture asynchrone...
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { shader.vsTxt = xhttp.responseText; shader.loaded ++; }
			if(ext=='.fs') { shader.fsTxt = xhttp.responseText; shader.loaded ++; }
			if(shader.loaded==2) {
				shader.loaded ++;
				compileShaders(shader);
				shader.loaded ++;
				console.log("Shader '"+shader.fname + "' COMPILED !");
			}
		}
	}

	shader.loaded = 0;
	xhttp.open("GET", shader.fname+ext, true);
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
	distCENTER = vec3.create([0,-0.2,-5]);
	
	//PLANE = new plane();
	OBJ1 = new objmesh('bunny.obj');
	OBJ2 = new objmesh('plane.obj');
	OBJ3 = new objmesh('porsche.obj');
	OBJ4 = new objmesh('ford.obj');
	OBJ5 = new objmesh('sphere.obj');

	
	//Si on veut ajouter un obj on creer juste un nouvel objet et on l'appel dans drawScene
	
	initiatButton();


	tick();//point de déclenchement de l'affichage
}

// =====================================================
function drawScene() {
	// A chaque fois qu'on actulaise la scene on efface l'image et on rédessine le plan et l'objet
	gl.clear(gl.COLOR_BUFFER_BIT);
	//PLANE.draw();
	OBJ2.draw(kdPlan, alphaPlan, reflPlan, lissePlan);
	OBJ3.draw(kdPorsche, alphaPorsche, reflPorsche, lissePorsche);
	OBJ3.draw2();
	OBJ4.draw(kdFord, alphaFord, reflFord, lisseFord);
	OBJ4.draw2();
	OBJ5.draw(kdSphere, alphaSphere, reflSphere, lisseSphere);
	OBJ5.draw2();
	OBJ1.draw(kdLapin, alphaLapin, reflLapin, lisseLapin);
	OBJ1.draw2();

	
	
	
}



