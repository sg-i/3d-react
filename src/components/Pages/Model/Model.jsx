import React, { useContext, useEffect, useState, useRef } from 'react';
import './Model.style.scss';
import * as THREE from 'three';
import { LanguageContext } from '../../../context/LanguageContext';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import OrbitUnlimitedControls from '@janelia/three-orbit-unlimited-controls';
import CustomCursor from '../../CustomCursor/CustomCursor';
import { getModels } from '../../../loaders/getModels';
import { Link, useLoaderData, useOutletContext } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';
import { getNeighbors } from '../../../loaders/getNeighbors';
import { ThemeContext } from '../../../context/ThemeContext';
import { ArrowButton } from '../../ArrowButton/ArrowButton';

export async function loader({ params }) {
  const data = await getModels(params.modelId);
  const { prev, next } = await getNeighbors(params.modelId);
  return { data, prev, next };
}

export const Model = () => {
  const [selectedItem, setSelectedItem] = useOutletContext();
  const { ChangeColor } = useContext(ThemeContext);

  const [loadingProgress, setLoadingProgress] = useState(0);

  THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
    const progress = loaded / total;
    setLoadingProgress(progress * 100);
  };

  function changeBlockStyle(cubeRef) {
    if (cubeRef.current) {
      const { top, left } = cubeRef.current.getBoundingClientRect();

      setBlockStyle({
        position: 'absolute',
        top: `${top + window.scrollY}px`,
        left: `${left + window.scrollX}px`,
        width: cubeRef.current.clientWidth,
        height: cubeRef.current.clientHeight,
        zIndex: 0,
      });
    }
  }
  function changeDefaultContros(controls) {
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.panSpeed = 0;
    controls.maxDistance = 12;
    controls.minDistance = 2;
    controls.maxZoom = 1;
  }
  const [forModel, setForModel] = useState();
  const { data, prev, next } = useLoaderData();
  const loader = new GLTFLoader();
  const renderRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const cubeRef = useRef(null);
  const [blockStyle, setBlockStyle] = useState(null);
  let mixer;
  const { userLanguage } = useContext(LanguageContext);

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
    ChangeColor('primary', data.colors.primary);
    ChangeColor('background', data.colors.background);
    ChangeColor('second', data.colors.second);
    ChangeColor('text', data.colors.text);

    let wasTouched = false;
    let IsTouching = false;
    ///////////////
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

    cubeRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.set(-5, 0, 0);

    let controls = new OrbitUnlimitedControls(camera, renderer.domElement);
    changeDefaultContros(controls);
    let startTouching;
    const handleMouseUp = () => {
      startTouching = Date.now();
      IsTouching = false;
      wasTouched = true;
      window.removeEventListener('mouseup', handleMouseUp);
    };

    renderer.domElement.addEventListener('mousedown', () => {
      startTouching = Date.now();
      IsTouching = true;
      window.addEventListener('mouseup', handleMouseUp);
    });

    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    loader.load(
      data.src,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(data.params.position.x, data.params.position.y, data.params.position.z);
        model.scale.set(data.params.scale.x, data.params.scale.y, data.params.scale.z);
        scene.add(model);
        mixer = model;
        setForModel(model);
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
      changeBlockStyle(cubeRef);
    };
    var isAscending = true;
    var maxYPosition = data.params.position.y + 0.15; // Maximum height to which the model will rise
    var minYPosition = data.params.position.y - 0.15; // Minimum height at which the model will be placed

    var animate = function () {
      requestAnimationFrame(animate);
      if (IsTouching) {
      } else {
        if (wasTouched) {
          let defTime = Date.now() - startTouching;
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
    changeBlockStyle(cubeRef);

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
    setSelectedItem(data);
  }, []);

  useUpdateEffect(() => {
    ChangeColor('primary', data.colors.primary);
    ChangeColor('background', data.colors.background);
    ChangeColor('second', data.colors.second);
    ChangeColor('text', data.colors.text);
    forModel.children = [];
    const oldState = cubeRef.current;
    if (oldState.childNodes.length > 0) {
      oldState.removeChild(oldState.lastChild);
    }
    setLoadingProgress(0);
    let wasTouched = false;
    let IsTouching = false;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);

    cubeRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.set(-5, 0, 0);

    let controls = new OrbitUnlimitedControls(camera, renderer.domElement);
    changeDefaultContros(controls);
    let startTouching;

    var isAscending = true;
    var maxYPosition = data.params.position.y + 0.15; // Maximum height to which the model will rise
    var minYPosition = data.params.position.y - 0.15; // Minimum height at which the model will be placed

    var animate = function () {
      requestAnimationFrame(animate);
      if (IsTouching) {
      } else {
        if (wasTouched) {
          let defTime = Date.now() - startTouching;
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
        model.position.set(data.params.position.x, data.params.position.y, data.params.position.z);
        model.scale.set(data.params.scale.x, data.params.scale.y, data.params.scale.z);
        scene.add(model);
        mixer = model;
        setForModel(model);
        animate();
        setLoading(true);
      },
      undefined,
      function (e) {
        console.error(e);
      },
    );
    setSelectedItem(data);
  }, [data]);

  useEffect(() => {
    if (loadingProgress === 100) {
      changeBlockStyle(cubeRef);
    }
  }, [loadingProgress]);

  return (
    <div className="model">
      <div className="wrap">
        <Link to={`/models/${prev.id}`}>
          <ArrowButton side="left" rotate={180} />
        </Link>
        <div className="first-view">
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
              <div className="name-model">{data.background.word}</div>
            </div>
          )}
          <div onClick={scrollToExplore} className="scroll-to-explore">
            <div className="sclr-exp-text">
              {userLanguage === 'ru' ? 'ПРОКРУТИ ЧТОБЫ УЗНАТЬ' : 'SCROLL TO EXPLORE'}
            </div>
            <div className="vertical-line"></div>
          </div>
        </div>
        <Link to={`/models/${next.id}`}>
          <ArrowButton side="right" rotate={0} />
        </Link>
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
