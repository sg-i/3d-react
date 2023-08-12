import React, { useContext, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { LanguageContext } from '../../../context/LanguageContext';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import OrbitUnlimitedControls from '@janelia/three-orbit-unlimited-controls';
import CustomCursor from '../../CustomCursor/CustomCursor';
import './Model.style.scss';
import { getModels } from '../../../loaders/getModels';
import { Link, useLoaderData } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';
import { getNeighbors } from '../../../loaders/getNeighbors';
export async function loader({ params }) {
  // console.log(params);
  const data = await getModels(params.modelId);
  const { prev, next } = await getNeighbors(params.modelId);
  return { data, prev, next };
}

export const Model = () => {
  const leftButtobChangeRef = useRef(null);
  const rightButtobChangeRef = useRef(null);
  const [styleForLeftButtonChangeText, setStyleForLeftButtonChangeText] = useState(null);
  const [styleForRightButtonChangeText, setStyleForRightButtonChangeText] = useState(null);

  const [styleForLeftButtonChange, setStyleForLeftButtonChange] = useState(null);
  const [styleForRightButtonChange, setStyleForRightButtonChange] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  THREE.DefaultLoadingManager.onStart = () => {
    console.log('Loading started');
  };

  THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
    const progress = loaded / total;
    setLoadingProgress(progress * 100);
  };

  THREE.DefaultLoadingManager.onLoad = () => {
    console.log('All assets loaded');
  };

  THREE.DefaultLoadingManager.onError = (url) => {
    console.log('Error loading', url);
  };
  // THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  //   console.log(
  //     'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
  //   );
  // };

  // THREE.DefaultLoadingManager.onLoad = function () {
  //   console.log('Loading Complete!');
  // };

  // THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  //   console.log(
  //     'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
  //   );
  // };

  // THREE.DefaultLoadingManager.onError = function (url) {
  //   console.log('There was an error loading ' + url);
  // };

  const [forModel, setForModel] = useState();
  const sceneRef = useRef();
  // console.log('1');
  const { data, prev, next } = useLoaderData();
  const loader = new GLTFLoader();
  const renderRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const cubeRef = useRef(null);
  const controls = useRef(null);
  const [blockStyle, setBlockStyle] = useState(null);
  let mixer;
  const { userLanguage, changeLanguage } = useContext(LanguageContext);
  // console.log('sdf', userLanguage);

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('second-view');
    if (exploreSection) {
      const offset = 60; // Дополнительный отступ
      const top = exploreSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    }
  };
  const scene = new THREE.Scene();
  useEffect(() => {
    // console.log(2);
    // const handleScrollFromUp = () => {
    //   if (window.scrollY === 0) {
    //     scrollToExplore();
    //   }
    // };

    // window.addEventListener('scrolldown', handleScrollFromUp);

    const clock = new THREE.Clock();
    let wasTouched = false;
    let IsTouching = false;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

    cubeRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

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
      // console.log('new event');
      startTouching = Date.now();
      // console.log('ren end');
      IsTouching = false;
      wasTouched = true;
      window.removeEventListener('mouseup', handleMouseUp);
    };

    renderer.domElement.addEventListener('mousedown', () => {
      // console.log('ren start');
      startTouching = Date.now();
      IsTouching = true;
      window.addEventListener('mouseup', handleMouseUp);
    });

    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    console.log('start loading');
    console.log(loader);
    loader.load(
      data.src,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
        console.log(scene);
        mixer = model;
        setForModel(model);
        console.log(forModel);
        console.log(mixer);

        animate();
        setLoading(true);
        console.log('end loading');
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
        const { top, left, right, height } = cubeRef.current.getBoundingClientRect();
        setBlockStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: cubeRef.current.clientWidth,
          height: cubeRef.current.clientHeight,
          zIndex: -3,
        });
        console.log(top, left);
        const newWidth = left * 0.8;
        const newMargin = (left - newWidth) / 2;
        const newHeight = height * 0.7;
        setStyleForLeftButtonChange((prevStyle) => ({
          ...prevStyle,
          left: `${newMargin}px`,
          width: `${newWidth}px`,
          height: `${height * 0.7}px`,
        }));
        setStyleForRightButtonChange((prevStyle) => ({
          ...prevStyle,
          left: `${right + newMargin}px`,
          width: `${newWidth}px`,
          height: `${height * 0.7}px`,
        }));
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

  // useEffect(() => {
  //   console.log('MODEL WAS CHANGED');
  //   console.log(data);
  // }, [data]);
  useUpdateEffect(() => {
    console.log('WAs changed');
    //cleaning
    forModel.children = [];
    const oldState = cubeRef.current;
    if (oldState.childNodes.length > 0) {
      oldState.removeChild(oldState.lastChild);
    }
    setLoadingProgress(0);
    //
    const clock = new THREE.Clock();
    let wasTouched = false;
    let IsTouching = false;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

    cubeRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    // scene.background = new THREE.Color(0x00000);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.set(-5, 0, 0);
    var isAscending = true;
    var maxYPosition = 0.15; // Maximum height to which the model will rise
    var minYPosition = -0.15;
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
    loader.load(
      data.src,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        scene.add(model);
        console.log(scene);
        mixer = model;
        setForModel(model);
        console.log(forModel);
        console.log(mixer);

        animate();
        setLoading(true);
        console.log('end loading');
      },
      undefined,
      function (e) {
        console.error(e);
      },
    );
    // scene.clear();
    // while (scene.children.length > 0) {
    //   scene.remove(scene.children[0]);
    // }
  }, [data]);

  useEffect(() => {
    if (loadingProgress === 100) {
      if (cubeRef.current) {
        const { top, left, right, height } = cubeRef.current.getBoundingClientRect();
        setBlockStyle({
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: cubeRef.current.clientWidth,
          height: cubeRef.current.clientHeight,
          zIndex: -3,
        });
        const newWidth = left * 0.8;
        const newMargin = (left - newWidth) / 2;
        const newHeight = height * 0.7;
        setStyleForLeftButtonChange({
          top: `${top + newHeight / 4}px`,
          left: `${newMargin}px`,
          width: `${newWidth}px`,
          height: `${height * 0.7}px`,
        });
        setStyleForRightButtonChange({
          top: `${top + newHeight / 4}px`,
          left: `${right + newMargin}px`,
          width: `${newWidth}px`,
          height: `${height * 0.7}px`,
        });
      }
    }
  }, [loadingProgress]);
  useUpdateEffect(() => {
    if (leftButtobChangeRef.current) {
      const { top, left, right, height } = leftButtobChangeRef.current.getBoundingClientRect();
      console.log(top, left, right, height);
      setStyleForLeftButtonChangeText({
        position: 'absolute',
        top: `${top + 55}px`,
        left: `${left}px`,
        width: `${right - left}px`,
        height: `${height * 0.8}px`,
      });
    }
  }, [styleForLeftButtonChange]);
  useUpdateEffect(() => {
    if (rightButtobChangeRef.current) {
      const { top, left, right, height } = rightButtobChangeRef.current.getBoundingClientRect();
      console.log(top, left, right, height);
      setStyleForRightButtonChangeText({
        position: 'absolute',
        top: `${top + 55}px`,
        left: `${left}px`,
        width: `${right - left}px`,
        height: `${height * 0.8}px`,
      });
    }
  }, [styleForRightButtonChange]);
  return (
    <div>
      {styleForLeftButtonChange && (
        <>
          {styleForLeftButtonChangeText && (
            <div style={styleForLeftButtonChangeText} className="button-text">
              {prev.name}
            </div>
          )}
          <Link to={`/models/${prev.id}`}>
            <div
              ref={leftButtobChangeRef}
              style={styleForLeftButtonChange}
              className="left-button-change"></div>
          </Link>
        </>
      )}
      {styleForRightButtonChange && (
        <>
          {styleForRightButtonChangeText && (
            <div style={styleForRightButtonChangeText} className="button-text">
              {next.name}
            </div>
          )}
          <Link to={`/models/${next.id}`}>
            <div
              ref={rightButtobChangeRef}
              style={styleForRightButtonChange}
              className="right-button-change"></div>
          </Link>
        </>
      )}
      {/* <div className="change-model-buttons">
        <div className="left-button change-button">
          <div className="text-button">button 1</div>
        </div>
        <div className="right-button change-button">
          <div className="text-button">button 1</div>
        </div>
      </div> */}
      <div className="first-view">
        {/* <button
          onClick={() => {
            console.log(forModel);
            console.log(scene);
            forModel.children = [];
            // const container = cubeRef.current;
            // if (container.childNodes.length > 0) {
            //   container.removeChild(container.lastChild);
            // }
          }}>
          button
        </button> */}
        <div className="wrap-for-canvas">
          <div
            style={loadingProgress === 100 ? {} : { display: 'none' }}
            className="canvas-3d"
            ref={cubeRef}></div>
          {loadingProgress !== 100 && <progress value={loadingProgress} max={100} />}
        </div>
        {loading && <CustomCursor targetRef={cubeRef} />}
        {loadingProgress === 100 && blockStyle && (
          <div className="bg-model" style={blockStyle}>
            <div className="name-model">CYBERLLAMA</div>
          </div>
        )}
        <div onClick={scrollToExplore} className="scroll-to-explore">
          <div className="sclr-exp-text">
            {userLanguage === 'ru' ? 'ПРОКРУТИ ЧТОБЫ УЗНАТЬ' : 'SCROLL TO EXPLORE'}
          </div>
          <div className="vertical-line"></div>
        </div>
      </div>
      <div id="second-view" className="second-view">
        <div className="content-title content">
          {data && (
            <>
              {userLanguage === 'ru' ? 'История о' : 'Story about'} <b>{data.name}</b>:
            </>
          )}
        </div>
        <div className="content">
          {data &&
            data.content.language[userLanguage].story
              .split('\n\n')
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </div>
  );
};
