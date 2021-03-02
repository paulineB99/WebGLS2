attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec4 uFogColor;
uniform float uFogAmount;
varying vec4 fogColor;
varying float fogAmount;

void main(void) {

	fogColor = uFogColor;
	fogAmount = uFogAmount;

	gl_Position = uPMatrix* uMVMatrix * vec4(aVertexPosition, 1.0);
}