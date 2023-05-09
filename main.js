import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

// controls
let max = 1000;
let maxN = 10;

const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, -70, 90);
scene.add(camera);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// polygons
let polygons = [];
let n = 0;
let sair = false;



console.log('Calculando...');

// loop
let lastPosi = 0;
for (let a = 1; a < max ; a++) {
	for (let b = 2 ; b < max ; b++) {
		for (let c = 3; c < max ; c++ ) {
			if ( ETijoloPerfeito(a, b, c) )
			{
				console.log("Tijolo: ^", n + 1);
				var randomColor = Math.floor(Math.random()*16777215);
				polygons[n] = makePolygon(a, b, c, randomColor, 0, lastPosi - (c * 0.02) );
				lastPosi = polygons[n].position.y;
				if ( n < maxN)
					n++;
				else
				{
					sair = true;
					break;
				}	
			}
		}

		if (sair)
			break;
	}

	if (sair)
		break;
}

console.log('Finalizado...');



// light
const color = 0xFFFFFF;
const intensity = 1.1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 5, 8);
scene.add(light);


// anim
function animate() {
	requestAnimationFrame( animate );

	polygons.forEach((polygon) => {
		polygon.rotation.x += 0.005;
		polygon.rotation.y += 0.005;
		polygon.rotation.z += 0.005;
	});

	renderer.render( scene, camera );
}



// call anim
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}




/////////////////////// aux

// make a polygon
function makePolygon(a, b, c, color, x, y) {
	const geometry = new THREE.BoxGeometry( a * 0.01, b * 0.01, c * 0.01 );
	const material = new THREE.MeshPhongMaterial({color});
	//material.wireframe = true;
	material.metalness = 5;
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
   
	cube.position.x = x;
	cube.position.y = y;
   
	return cube;
}

/////////////////////////////////////// calc tijolos

function ETijoloPerfeito(a, b, c) {
	let eTijolo = false;

    if ((b > a) & (c > b) && Number.isInteger(a + b + c))  // inteiros e sequênciais
    {
        let diagonalAB = 0.0;
        let diagonalBC = 0.0;
        let diagonalAC = 0.0;
        let diagonalDC = 0.0;

        let ab = (a**2 + b**2);
        let bc = (b**2 + c**2);
        let ac = (a**2 + c**2);
        let dc = (ab**2 + c**2);
        diagonalAB = Math.sqrt(ab);//squareRoot(ab, 1);
        diagonalBC = Math.sqrt(bc);//squareRoot(bc, 1);
        diagonalAC = Math.sqrt(ac);//squareRoot(ac, 1);
        diagonalDC = Math.sqrt(dc);//squareRoot(dc, 1);

        if (Number.isInteger(diagonalAB) && 
            Number.isInteger(diagonalBC) && 
            Number.isInteger(diagonalAC)) 
		{
            eTijolo = true;
			console.log("Dimensões: ", a, b, c);
			console.log("diagonais: ", diagonalAB, diagonalBC, diagonalAC, diagonalDC);

            if (Number.isInteger(diagonalDC)) {
				eTijolo = true;
                console.log(a,b,c, "Eureca encontrei o tijolo perfeito!");
				console.log("Dimensões: ", a, b, c);
				console.log("diagonais: ", diagonalAB, diagonalBC, diagonalAC, diagonalDC);
            }
        }
    } 
	
	return eTijolo;
}