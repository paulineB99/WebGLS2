attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uAlpha;
uniform float uReflectance;
uniform vec3 uVertexKd;
uniform float uLisse;

varying vec4 pos3D;
varying vec3 N;
varying vec3 kd;
varying float alpha;
varying float reflectance;
varying float lisse;

void main(void) {
	reflectance = uReflectance;
	alpha = uAlpha;
	kd = uVertexKd;
	lisse = uLisse;
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
	N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	gl_Position = uPMatrix * pos3D;
}
