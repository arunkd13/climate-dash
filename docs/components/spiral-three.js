import * as THREE from 'npm:three';

export function spiral() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    return renderer.domElement;
}
