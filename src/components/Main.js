import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import './Main.style.scss';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const Main = () => {
  const cubeRef = useRef(null);
  const controls = useRef(null);
  const [blockStyle, setBlockStyle] = useState(null);
  useEffect(() => {
    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

    cubeRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x00000);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-5, 0, 0);

    let controls = new TrackballControls(camera, renderer.domElement);

    controls.rotateSpeed = 5;
    controls.panSpeed = 0;
    controls.maxDistance = 12;
    controls.minDistance = 2;

    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
    //light
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }
    // const gui = new GUI();
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    // gui.add(light, 'intensity', 0, 2, 0.01);
    // gui.add(light.target.position, 'x', -10, 10);
    // gui.add(light.target.position, 'z', -10, 10);
    // gui.add(light.target.position, 'y', 0, 10);

    const loader = new GLTFLoader();
    loader.load(
      //   'models/bombardier_s_stock_london_underground/scene.gltf',
      //   'models/bulb/Bulb.gltf',
      //   'modelsapple-watchApple Watch Series 5.gltf',
      //   'models/nikescene.gltf',
      //   'models/air_jordan_1/scene.gltf',
      //   'models/esquire_teh/scene.gltf',
      'models/cyberllama_anny/scene.gltf',
      function (gltf) {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);

        animate();
      },
      undefined,
      function (e) {
        console.error(e);
      },
    );

    window.onresize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
      if (cubeRef.current) {
        const { top, left } = cubeRef.current.getBoundingClientRect();
        console.log(top, left);
        setBlockStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: cubeRef.current.clientWidth,
          height: cubeRef.current.clientHeight,
          background: 'blue',
          zIndex: -3,
        });
      }
    };
    var animate = function () {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    if (cubeRef.current) {
      const { top, left } = cubeRef.current.getBoundingClientRect();
      setBlockStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: cubeRef.current.clientWidth,
        height: cubeRef.current.clientHeight,
        // background: 'blue',
        zIndex: -3,
      });
    }
  }, []);

  return (
    <>
      <div className="Main">
        <div className="canvas-3d" ref={cubeRef}></div>
        {blockStyle && (
          <div className="bg-model" style={blockStyle}>
            <div className="name-model">CYBERLAMA</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
