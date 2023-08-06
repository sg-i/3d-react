import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import './Main.style.scss';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import OrbitUnlimitedControls from '@janelia/three-orbit-unlimited-controls';
import CustomCursor from './CustomCursor/CustomCursor.jsx';
import { Header } from './CustomCursor/Header/Header';

const Main = () => {
  const [loading, setLoading] = useState(false);
  const cubeRef = useRef(null);
  const controls = useRef(null);
  const [blockStyle, setBlockStyle] = useState(null);
  let mixer;

  useEffect(() => {
    const clock = new THREE.Clock();
    let wasTouched = false;
    let IsTouching = false;
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

    // let controls = new TrackballControls(camera, renderer.domElement);
    let controls = new OrbitUnlimitedControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.panSpeed = 0;
    controls.maxDistance = 12;
    controls.minDistance = 2;
    controls.maxZoom = 1;
    let startTouching, endTouching;
    const handleMouseUp = () => {
      console.log('new event');
      startTouching = Date.now();
      console.log('ren end');
      IsTouching = false;
      wasTouched = true;
      window.removeEventListener('mouseup', handleMouseUp);
    };

    renderer.domElement.addEventListener('mousedown', () => {
      console.log('ren start');
      startTouching = Date.now();
      IsTouching = true;
      window.addEventListener('mouseup', handleMouseUp);
    });

    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

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
        mixer = model;

        animate();
        setLoading(true);
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
          zIndex: -3,
        });
      }
    };
    var isAscending = true;
    var maxYPosition = 0.15; // Maximum height to which the model will rise
    var minYPosition = -0.15; // Minimum height at which the model will be placed

    var animate = function () {
      requestAnimationFrame(animate);
      if (IsTouching) {
      } else {
        if (wasTouched) {
          let defTime = Date.now() - startTouching;
          // console.log(defTime);
          if (defTime > 800) {
            wasTouched = false;
          }
        } else {
          mixer.rotation.y += 0.01;
          // Up and down motion control
          if (isAscending) {
            mixer.position.y += 0.001; // Increase the Y position to make the model fly upwards
          } else {
            mixer.position.y -= 0.001; // Decrease the Y position so that the model goes downward
          }

          // Check whether the model has reached its maximum or minimum height
          if (mixer.position.y >= maxYPosition) {
            isAscending = false;
          } else if (mixer.position.y <= minYPosition) {
            isAscending = true;
          }
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };

    // animate();

    if (cubeRef.current) {
      const { top, left } = cubeRef.current.getBoundingClientRect();
      setBlockStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: cubeRef.current.clientWidth,
        height: cubeRef.current.clientHeight,
        zIndex: -3,
      });
    }

    //for header
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        const scrolled = window.scrollY > 0; // Проверяем, прокручена ли страница вниз
        if (scrolled) {
          header.classList.add('scrolled'); // Добавляем класс, если страница прокручена
        } else {
          header.classList.remove('scrolled'); // Удаляем класс, если страница в верхней позиции
        }
      }
    };

    // Добавляем слушатель события прокрутки для окна
    window.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="Main">
        <Header />

        <div className="first-view">
          <div className="wrap-for-canvas">
            <div className="canvas-3d" ref={cubeRef}></div>
          </div>
          {loading && <CustomCursor targetRef={cubeRef} />}
          {blockStyle && (
            <div className="bg-model" style={blockStyle}>
              <div className="name-model">CYBERLLAMA</div>
            </div>
          )}
          <div>scroll to explore</div>
        </div>
        <div>' '</div>
      </div>
    </>
  );
};

export default Main;
