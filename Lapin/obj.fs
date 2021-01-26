precision mediump float;

varying vec4 pos3D;
varying vec3 N;

const float PI = 3.14159;


//vec3 SRCpos = vec3(1.0, 1.0, 0.0); //position de la source


// ==============================================

float ddot(vec3 a, vec3 b)
{
	return max(0.0, dot(a,b));
}

// ==============================================

vec3 FrLambertPhong(vec3 kd, float ks, float n, vec3 N, vec3 vi, vec3 vo)
{
	vec3 M = normalize(reflect(-vi,N));
	float cosAn = ddot(M, vo);
	cosAn = pow(cosAn, n);
	return kd*(1.0-ks)/PI + (n+2.0)/(2.0*PI)*ks*cosAn;
}

// ==============================================
void main(void)
{
	vec3 Nn = normalize(N);
	vec3 kd = vec3(0.9,0.1,0.1); 		//couleur
	float ks = 0.6;
	float n=100.0;
	vec3 Li = vec3(3.0); 							//puissance de la source
	vec3 lPos = vec3(0.0);

	vec3 vi = normalize(vec3(lPos-vec3(pos3D))); 		//direction d'incidence de la lumière
	vec3 vo = normalize(vec3(-vec3(pos3D)));

	vec3 Fr = FrLambertPhong(kd,ks,n,N,vi,vo);			//réflectance 
	float cosTi = ddot(N,vi);

	vec3 Lo = Li * Fr * cosTi;
	gl_FragColor = vec4(Lo,0.3);

	
}
 







