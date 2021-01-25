
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

uniform vec3 aVertexPower;
uniform vec3 aVertexPosLight;
uniform vec3 aVertexColorLight;
uniform vec3 aVertexSpecularLight;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vSRCPower;
varying vec3 vSRCpos;
varying vec3 vSRC_lightColor;
varying vec3 vSRC_specularColor;

void main(void) {
	vSRC_lightColor =vec3(aVertexColorLight[0], aVertexColorLight[1], aVertexColorLight[2]);
	vSRC_specularColor = vec3(aVertexSpecularLight[0], aVertexSpecularLight[1], aVertexSpecularLight[2]);
	vColor = aVertexColor;
	vPosition = vec3(uMVMatrix * vec4(aVertexPosition,1.0));
	vNormal = vec3(uRMatrix*vec4(aVertexNormal,1.0));
	//vNormal = aVertexNormal;
	vSRCPower = vec3(aVertexPower[1]);
	vSRCpos = aVertexPosLight;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
