
precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vSRCPower;
varying vec3 vSRCpos;
varying vec3 vSRC_lightColor;
varying vec3 vSRC_specularColor;
const float PI = 3.14159265389793;
// =====================================================
float ddot(vec3 a, vec3 b){
	return max(dot(a,b),0.0);
}

// =====================================================
void main(void) {
	vec3 N = normalize(vNormal);
	vec3 col;
	//vSRCpos = vec3(0.0,0.0,0.0);

	//if(N.x>0.0) col = vec3(N.x,0.0,0.0); //On peu replacer les x par des y pour voir le dégrader de haut en bas et z
	//else col = vec3(0.0,0.0,-N.x);
	vec3 Vi= normalize (vSRCpos-vPosition);
	col = vSRCPower * vec3(vColor/PI * ddot(N,Vi));
	gl_FragColor = vec4(col, 1.0);
	gl_FragColor.rgb *= vSRC_lightColor * ddot(N, Vi) * (vSRCPower/vec3(10));
	gl_FragColor.rgb += vSRC_specularColor * ddot(N, Vi) * (vSRCPower/vec3(10));
}
