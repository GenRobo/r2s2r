import * as THREE from 'three';
import { GLTFLoader } from './vendor/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';
document.querySelectorAll('[data-scene-viewer]').forEach(host => {
  const button = host.querySelector('[data-load-scene]');
  const status = host.querySelector('[role=status]');
  button.addEventListener('click', async () => {
    button.disabled = true; status.textContent = 'Loading scene…';
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      const scene=new THREE.Scene();scene.background=new THREE.Color(getComputedStyle(host).getPropertyValue('--surface').trim());
      const camera=new THREE.PerspectiveCamera(40,1,.001,100);camera.up.set(0,0,1);
      const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;
      scene.add(new THREE.HemisphereLight(0xffffff,0x8d9199,2));
      const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(1,-2,4);scene.add(light);
      const gltf=await new GLTFLoader().loadAsync(host.dataset.sceneSrc);scene.add(gltf.scene);
      const box=new THREE.Box3().setFromObject(gltf.scene),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
      const distance=size.length()*1.1;
      const home=()=>{camera.position.copy(center).add(new THREE.Vector3(distance*.6,-distance*.85,distance*.65));controls.target.copy(center);controls.update();};
      const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('aria-label','Interactive reconstructed scene. Drag to orbit, right-drag to pan, scroll to zoom. Arrow keys pan.');
      host.querySelector('.viewer-poster').hidden=true;host.querySelector('.viewer-canvas').append(canvas);
      const resize=()=>{const r=host.querySelector('.viewer-canvas').getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.render(scene,camera);}};
      controls.addEventListener('change',()=>renderer.render(scene,camera));controls.listenToKeyEvents(canvas);
      new ResizeObserver(resize).observe(host);home();resize();
      button.hidden=true;status.textContent='Drag to orbit · Right-drag to pan · Scroll to zoom';
      const reset=host.querySelector('[data-reset-scene]');reset.hidden=false;reset.addEventListener('click',home);
      host.dataset.loaded='true';
    } catch(error) {
      renderer?.dispose();status.textContent='Could not load the 3D view. Try again or download the scene below.';button.disabled=false;button.textContent='Retry 3D view';
    }
  });
});
