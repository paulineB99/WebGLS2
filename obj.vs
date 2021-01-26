attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec3 aVertexColor;

varying vec4 pos3D;
varying vec3 N;
varying vec3 vColor;

void main(void) {
	vColor = vec3 (0.6,0.1,0.1);
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
	N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	gl_Position = uPMatrix * pos3D;
}
