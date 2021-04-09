//Variable obtenue de glCourseBasis
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform vec3 aTranslation;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float aAlpha;
uniform float aReflectance;
uniform vec3 aVertexKd;
uniform float aLisse;
uniform vec4 uFogColor;
uniform float uFogAmount;

//Variable envoyées au fragment shader
varying vec4 pos3D;
varying vec3 N;
varying vec3 kd;
varying float alpha;
varying float reflectance;
varying float lisse;
varying vec4 fogColor;
varying float fogAmount;

void main(void) {
	// Parametre du brouillard
	fogColor = uFogColor;
	fogAmount = uFogAmount;

	// Parametre des objets
	reflectance = aReflectance;
	alpha = aAlpha;
	kd = aVertexKd;
	lisse = aLisse;
	pos3D = uMVMatrix * vec4(aVertexPosition + aTranslation,1.0);
	N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	gl_Position = uPMatrix * pos3D;
}
