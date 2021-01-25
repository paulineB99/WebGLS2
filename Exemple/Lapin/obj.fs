
precision mediump float;

varying vec4 pos3D;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 SRCPow;
varying vec3 SRCCol;
varying vec3 speCol;
varying vec3 SRCPos;

const float PI = 3.14159265389793;
// =====================================================
float ddot(vec3 a, vec3 b){
	return max(dot(a,b),0.0);
}

// ==============================================
void main(void)
{
	vec3 N = normalize(vNormal);
	vec3 col;
	//vec3 SRCPos = vec3(0.0, 0.0, 0.0);
	//vec3 SRCPow = vec3(5.0);
	//vec3 vColor = vec3(0.8,0.4,0.4);
	//vec3 SRCCol = vec3(1,1,1);
	//vec3 speCol = vec3(1,1,1);

	vec3 Vi= normalize (SRCPos-vec3(pos3D));
	col = SRCPow * vec3(vColor/PI * ddot(N,Vi));// Lambert rendering, eye light source
	gl_FragColor = vec4(col,1.0);
	gl_FragColor.rgb *= SRCCol * ddot(N, Vi) * (SRCPow/vec3(10));
	gl_FragColor.rgb += speCol * ddot(N, Vi) * (SRCPow/vec3(10));
}




