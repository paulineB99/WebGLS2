
precision mediump float;

varying vec4 pos3D;				//pos3D est calculé à partir de la position des sommets
varying vec3 N;
varying vec3 kd;
varying float alpha;
varying float reflectance;
varying float lisse;

const float PI = 3.14159;


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
	return kd*(1.0-ks)/PI + (n+2.0)/(2.0*PI)*ks*cosAn;  //on multiplie kd par 1-ks pour éviter que kd+ks dépasse 1
}

// ==============================================
void main(void)
{
	vec3 Nn = normalize(N);
	float ks = reflectance;						//def de la reflectance => 0 = mat // 1 = brillant af
	float n= lisse;							//rigosité du matériau
	vec3 Li = vec3(4.0); 						//puissance de la source
	vec3 lPos = vec3(0.0);

	vec3 vi = normalize(vec3(lPos-vec3(pos3D))); 		//direction d'incidence de la lumière
	vec3 vo = normalize(vec3(-vec3(pos3D)));			//direction d'observation

	vec3 Fr = FrLambertPhong(kd,ks,n,N,vi,vo);			//réflectance qui décrit la manière dont i arrive
	float cosTi = ddot(N,vi);							//cos de l'orientation

	vec3 Lo = Li * Fr * cosTi;
	gl_FragColor = vec4(Lo,alpha);

	
}
 



