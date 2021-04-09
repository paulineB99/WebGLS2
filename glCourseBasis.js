/*****************************************************************************************************************/
/* 							PROJET DEVELOPPE EN  WEBGL DANS LE CADRE DE L'UE IMAGERIE DU VIVANT					 */
/*		 						 	M1-GENIE PHYSIOLOGIQUE BIOTECHNOLOGIQUE ET INFORMATIQUE 				     */
/*											BREMOND PAULINE & NDITAR NAOMI YAGALE			    				 */
/*													ANNEE : 2020-2021									    	 */
/*****************************************************************************************************************/


// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
// =====================================================
var OBJ = [];
var value;
var m;
OBJ.push("OBJ1", "OBJ2", "OBJ3", "OBJ4", "OBJ5", "OBJ6");

var PLANE = null;

// =====================================================


//Gestion de Kd pour chacun des objets
var kd = [0.6, 0.1, 0.1];
var kdPlan = [0.1, 0.1, 0.1];
var kdLapin = [0.6, 0.1, 0.1];
var kdPorsche = [0.6, 0.1, 0.1];
var kdFord = [0.6, 0.1, 0.1];
var kdSphere = [0.6, 0.1, 0.1];
var kdSpaceship = [0.6, 0.1, 0.1];


//Gestion de alpha pour chacun des objets
//var alpha = 0.3;
var alpha = 0.3;
var alphaInf = null;
var alphaPlan = 1;
var alphaLapin = 0.3;
var alphaPorsche = 0.3;
var alphaFord = 0.3;
var alphaSphere = 0.3;
var alphaSpaceship = 0.9;

//Gestion de la reflectance pour chacun des objets
var refl = 0.6;
var reflLapin = 0.6;
var reflPorsche = 0.6;
var reflFord = 0.6;
var reflSphere = 0.6; 
var reflPlan = 0;
var reflSpaceShip = 0.2;

//Gestion de la rugosité pour chacun des objets
var lisse = 100.0;
var lisseLapin = 0.5;
var lissePorsche = 100.0;
var lisseFord = 100.0;
var lisseSphere = 100.0;
var lissePlan = 1.0;
var lisseSpaceship = 100.0;

var fogColor = [0.7, 0.7, 0.7, 1.0] ;
var fogAmount = 0.1;

var visible = true;
var visibleLapin = true;
var visibleSphere = true;
var visiblePorsche = true;
var visibleFord = true;
var visibleSpaceship = true;

var fdf = true;
var fdfLapin = false;
var fdfSphere = true;
var fdfPorsche = true;
var fdfFord = true;
var fdfSpaceship = false;

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

		this.shader1.cFogColor = gl.getUniformLocation(this.shader1.shader, "uFogColor");
		gl.uniform4fv(this.shader1.cFogColor, fogColor);

		this.shader1.cFogAmount = gl.getUniformLocation(this.shader1.shader, "uFogAmount");
		gl.uniform1f(this.shader1.cFogAmount, fogAmount);
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
		gl.uniformMatrix4fv(this.shader2.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader2.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader2.pMatrixUniform, false, pMatrix);

		this.shader2.cFogColor = gl.getUniformLocation(this.shader2.shader, "uFogColor");
		gl.uniform4fv(this.shader2.cFogColor, fogColor);

		this.shader2.cFogAmount = gl.getUniformLocation(this.shader2.shader, "uFogAmount");
		gl.uniform1f(this.shader2.cFogAmount, fogAmount);
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

		// Fonction de selection d'un objet dans le menu déroulant
function SelectAnObject( value){
	if (value=="Porsche"){
		m=OBJ[2];
		document.onclick = function(){slideAlpha(m)};
	}
	else if (value=="Bunny"){
		m=OBJ[0];
		document.onclick = function(){slideAlpha(m)};
	}
	else if (value=="Ford"){
		m=OBJ[3];
		document.onclick = function(){slideAlpha(m)};
	}
	else if (value=="Sphere"){
		m=OBJ[4];
		document.onclick = function(){slideAlpha(m)};
	}
	else if (value=="Spaceship"){
		m=OBJ[5];
		document.onclick = function(){slideAlpha(m)};
	}
}


		// ===== Fonctions de mise à jour du bouton alpha, reflectance et  rugosité

function slideAlpha(m) { 
	var sliderAlpha  = document.getElementById("alphaB");
	alpha = sliderAlpha.value;
	var output = document.getElementById("demo");
	output.innerHTML = sliderAlpha.value;
	alpha.oninput = function(){
		alpha = this.value;
		output.innerHTML = this.value;
	}
	if (m==OBJ[5]){  //initialisation du boutton "alpha" sur le spaceship
		alphaSpaceship = alpha;
	} else if (m==OBJ[4]){  //initialisation du boutton "alpha" sur la sphère
		alphaSphere = alpha;
	}else if(m==OBJ[3]){ //initialisation du  boutton "alpha" sur la Ford
		alphaFord = alpha;
	} else if (m==OBJ[2]){  //initialisation du boutton "alpha" sur la Porsche
		alphaPorsche = alpha;
	} else if (m==OBJ[0]){ //initialisation du boutton "alpha" sur le Bunny
		alphaLapin = alpha;
	}
}

function slideReflectance(m) {

	var sliderRefl = document.getElementById("refl");
	refl = sliderRefl.value;
	var outputSSh = document.getElementById("brillance");
	outputSSh.innerHTML = sliderRefl.value;
	sliderRefl.oninput = function() {
		refl = this.value;
		outputSSh.innerHTML = this.value;

	}
	
	if (m==OBJ[5]){  //initialisation du  boutton "Reflectance" sur le space ship
		reflSpaceShip = refl;
	}else if (m==OBJ[4]){  //initialisation du  boutton "Reflectance" sur la Sphère
		reflSphere = refl;
	}else if (m==OBJ[3]){ 	//initialisation du  boutton "Reflectance" sur la Ford
		reflFord = refl;
	} else 	if (m==OBJ[2]){	  //initialisation du  boutton "Reflectance" sur la Porsche
		reflPorsche = refl;
	}else if (m==OBJ[0]){  	//initialisation du  boutton "Reflectance" sur le Bunny  	
		reflLapin = refl;
	}

}

function slideRugosite(m) {

	var sliderLisse = document.getElementById("lisse");
	lisse = sliderLisse.value;
	var outputSpSh = document.getElementById("rug");
	outputSpSh.innerHTML = sliderLisse.value;
	sliderLisse.oninput = function() {
		lisse= this.value;
		outputSpSh.innerHTML = this.value;
	}
	if (m==OBJ[5]){  	//initialisation du  boutton "Rugosité" sur le space ship
		lisseSpaceship = lisse;
	}else if (m==OBJ[4]){  	//initialisation du  boutton "Rugosité" sur la Sphère
		lisseSphere = lisse;
	}else if (m==OBJ[3]){  //initialisation du  boutton "Rugosité" sur la Ford
		lisseFord = lisse;
	}else if (m==OBJ[2]){ //initialisation du  boutton "Rugosité" sur la Porsche
		lissePorsche = lisse;
	}else if (m==OBJ[0]){  //initialisation du  boutton "Rugosité" sur le Bunny
		lisseLapin = lisse;
	}
}

			// Fonction de mise à jour du Frog

function slideFog() {
	var sliderFog = document.getElementById("fog");
	fogAmount = sliderFog.value;
	var outputFog = document.getElementById("theFog");
	outputFog.innerHTML = sliderFog.value;
	sliderFog.oninput = function(){
		fogAmount = this.value;
		outputFog.innerHTML = this.value;
	}
}

		// Fonction de mise à jour du fil de fer
function filDeFer(m) {
	if(document.getElementById("fdf").checked){
		fdf = true;
	}else{
		fdf = false;
	}
	if (m==OBJ[5]){
		fdfSpaceship = fdf;
	}else if (m==OBJ[4]){ 
		fdfSphere = fdf;
	}else if (m==OBJ[3]){
		fdfFord = fdf;
	} else if (m==OBJ[2]){ 
		fdfPorsche = fdf;
	} else if (m==OBJ[0]){ 
		fdfLapin = fdf;
	}		
		
}

		// Fonction du comportement des boutons de selection des couleurs
function buttonBehaviour(m){
	if(document.getElementById("red").checked) {
		kd = [0.6,0.1,0.1];
	}else if(document.getElementById("green").checked) {
		kd = [0.1,0.8,0.1];
	}else if(document.getElementById("blue").checked) {
		kd = [0.1,0.1,0.8];
	}else if(document.getElementById("yellow").checked) {
		kd = [0.8,0.8,0.1];
	}else if(document.getElementById("cyan").checked) {
		kd = [0.1,0.8,0.8];
	}else if(document.getElementById("magenta").checked) {
		kd = [0.6,0.1,0.8];
	}
	if (m==OBJ[5]){
		kdSpaceship = kd;
	}else if (m==OBJ[4]){ 
		kdSphere = kd;
	}else if (m==OBJ[3]){
		kdFord = kd;
	} else if (m==OBJ[2]){ 
		kdPorsche = kd;
	} else if (m==OBJ[0]){ 
		kdLapin = kd;
	}
}

		// Fonction de mise a jour de l'affichage des objets
function setVisible(m){
	if(document.getElementById("affiche").checked) {
		visible = true;
	}else{
		visible = false;
	}
	if (m==OBJ[5]){
		visibleSpaceship = visible;
	}else if (m==OBJ[4]){
		visibleSphere = visible;
	}else if (m==OBJ[3]){
		visibleFord = visible;
	} else if (m==OBJ[2]){ 
		visiblePorsche = visible;
	} else if (m==OBJ[0]){ 
		visibleLapin = visible;
	}
}

		// fonction permettant de rafraichir les paramètres à chaque changement 
function refresh() {
	SelectAnObject(value);
	buttonBehaviour(m);
	slideAlpha(m);
	slideReflectance(m);
	slideRugosite(m);
	slideFog();
	filDeFer(m);
	setVisible(m);
	loadShaders(OBJ[0]);
	loadShaders(OBJ[1]);;
	loadShaders(OBJ[2]);
	loadShaders(OBJ[3]);
	loadShaders(OBJ[4]);
	loadShaders(OBJ[5]);
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


		gl.clearColor(...fogColor);
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
	distCENTER = vec3.create([0.0,0.0,-10]);

	OBJ[0] = new objmesh('bunny.obj');
	OBJ[1] = new objmesh('plane.obj');
	OBJ[2] = new objmesh('porsche.obj');
	OBJ[3] = new objmesh('ford.obj');
	OBJ[4] = new objmesh('sphere.obj');
	OBJ[5] = new objmesh('spaceship.obj');


	tick();//point de déclenchement de l'affichage
}


// =====================================================

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	OBJ[1].draw(kdPlan, alphaPlan, reflPlan, lissePlan);
	
	if (visibleSpaceship){		// On vérifie dans un premier temps si l'objet doit etre affiché ou non 
		OBJ[5].draw(kdSpaceship, alphaSpaceship, reflSpaceShip, lisseSpaceship);
		if(fdfSpaceship){		// Puis on vérifie si le fils de fer doit être affiché
			OBJ[5].draw2();
		}
	}
	if (visiblePorsche){
		OBJ[2].draw(kdPorsche, alphaPorsche, reflPorsche, lissePorsche);
		if(fdfPorsche){
			OBJ[2].draw2();
		}
	}
	if(visibleFord){
		OBJ[3].draw(kdFord, alphaFord, reflFord, lisseFord);
		if(fdfFord){
			OBJ[3].draw2();
		}
	}
	if(visibleSphere){
		OBJ[4].draw(kdSphere, alphaSphere, reflSphere, lisseSphere);
		if(fdfSphere){
			OBJ[4].draw2();
		}
	}
	if(visibleLapin){
		OBJ[0].draw(kdLapin, alphaLapin, reflLapin, lisseLapin);
		if(fdfLapin){
			OBJ[0].draw2();
		}
	}
}



