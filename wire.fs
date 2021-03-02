
precision mediump float;

varying vec4 fogColor;
varying float fogAmount;

// ==============================================
void main(void)
{
	gl_FragColor = mix(vec4(1.0,1.0,1.0,1.0), fogColor, fogAmount);
}
 



