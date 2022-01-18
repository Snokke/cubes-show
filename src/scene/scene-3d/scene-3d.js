import * as THREE from 'three';
import { PictureData } from './data';
import TWEEN from '@tweenjs/tween.js';
import GUIHelper from '../../helpers/gui-helper/gui-helper';
import { GUIFolders } from '../../helpers/gui-helper/gui-helper-config';

export default class Scene3D extends THREE.Group {
  constructor(camera) {
    super();

    this._camera = camera;

    this._geometry = null;
    this._mainMaterial = null;
    this._bgMaterial1 = null;
    this._bgMaterial2 = null;
    this._cubeMaterials = null;
    this._cubes = [];

    this._rowsX = { value: 50 };
    this._columnsZ = { value: 50 };

    this._cubeWidthX = { value: 1 };
    this._cubeHeight = { value: 1 };
    this._cubeDepthZ = { value: 1 };

    this._speed = { value: 4 };

    const centerX = Math.floor(this._rowsX.value * 0.5) - Math.floor(PictureData[0].length * 0.5) - 1;
    this._pictureOffsetX = { value: centerX };

    this._init();
  }

  update(dt) {
    if (this._cubes.length === 0) {
      return;
    }

    for (let rowX = 0; rowX < this._rowsX.value; rowX += 1) {
      const firstRowCube = this._cubes[rowX][0];

      if (dt > 0.03) {
        dt = 0.03;
      }

      firstRowCube.position.z -= dt * this._speed.value;

      for (let columnZ = 1; columnZ < this._columnsZ.value; columnZ += 1) {
        const cube = this._cubes[rowX][columnZ];

        cube.position.z = firstRowCube.position.z + columnZ * this._cubeDepthZ.value;
      }

      if (firstRowCube.position.z < -this._columnsZ.value * this._cubeDepthZ.value * 0.5) {
        this._placeCubeAtStart(firstRowCube);

        const switchCube = this._cubes[rowX].shift();
        this._cubes[rowX].push(switchCube);
      }
    }
  }

  _placeCubeAtStart(cube) {
    cube.position.z = this._columnsZ.value * this._cubeDepthZ.value * 0.5;
    cube.position.y = 20;

    const duration = 1000 + Math.random() * 2000;

    new TWEEN.Tween(cube.position)
      .to({ y: -0.5 }, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
  }

  _init() {
    this._initMaterials();
    this._initCubes();
    this._initGUI();
  }

  _initMaterials() {
    this._mainMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      metalness: 0.3,
      roughness: 0.4,
    });

    this._bgMaterial1 = new THREE.MeshStandardMaterial({
      color: '#cccccc',
      metalness: 0.3,
      roughness: 0.4,
    });

    this._bgMaterial2 = new THREE.MeshStandardMaterial({
      color: '#999999',
      metalness: 0.3,
      roughness: 0.4,
    });

    this._bgMaterial3 = new THREE.MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
    });

    this._cubeMaterials = {
      0: [this._bgMaterial1, this._bgMaterial2, this._bgMaterial3],
      1: [this._mainMaterial],
    };
  }

  _initCubes() {
    this._geometry = new THREE.BoxGeometry(this._cubeWidthX.value, this._cubeHeight.value, this._cubeDepthZ.value);

    const offsetX = this._rowsX.value - PictureData[0].length - this._pictureOffsetX.value;

    for (let rowX = 0; rowX < this._rowsX.value; rowX += 1) {
      this._cubes.push([]);

      for (let columnZ = 0; columnZ < this._columnsZ.value; columnZ += 1) {
        let data = 0;

        if (columnZ < PictureData.length && (rowX >= offsetX && rowX < PictureData[0].length + offsetX)) {
          data = PictureData[PictureData.length - 1 - columnZ][PictureData[0].length - 1 - (rowX - offsetX)];
        }

        const materialsArray = this._cubeMaterials[data];
        const material = this._randomPick(materialsArray);

        const cube = new THREE.Mesh(this._geometry, material);
        this.add(cube);

        cube.receiveShadow = true;
        cube.castShadow = true;

        cube.position.x = -(this._rowsX.value * this._cubeWidthX.value * 0.5) + rowX * this._cubeWidthX.value;
        cube.position.z = -(this._columnsZ.value * this._cubeDepthZ.value * 0.5) + columnZ * this._cubeDepthZ.value;
        cube.position.y = -0.5;

        this._cubes[rowX].push(cube);
      }
    }
  }

  _initGUI() {
    const guiCubesFolder = GUIHelper.getFolder(GUIFolders.Cubes);

    guiCubesFolder.add(this._rowsX, 'value', 1, 100, 1)
      .name('Rows')
      .onChange(() => {
        this._recreateCubes();
        const pictureOffsetController = GUIHelper.getController(guiCubesFolder, 'Picture offset');
        const max = this._rowsX.value - PictureData[0].length;
        pictureOffsetController.max(max);

        if (this._pictureOffsetX.value > max) {
          pictureOffsetController.setValue(max);
        }
      });

    guiCubesFolder.add(this._columnsZ, 'value', 1, 100, 1)
      .name('Column')
      .onChange(() => this._recreateCubes());

    guiCubesFolder.add(this._speed, 'value', 0, 20)
      .name('Speed');

    guiCubesFolder.add(this._pictureOffsetX, 'value', 0, this._rowsX.value - PictureData[0].length, 1)
      .name('Picture offset')
      .onChange(() => this._recreateCubes());

    guiCubesFolder.add(this._cubeWidthX, 'value', 0.1, 5)
      .name('Cube width')
      .onChange(() => this._recreateCubes());

    guiCubesFolder.add(this._cubeHeight, 'value', 0.1, 5)
      .name('Cube height')
      .onChange(() => this._recreateCubes());

    guiCubesFolder.add(this._cubeDepthZ, 'value', 0.1, 5)
      .name('Cube depth')
      .onChange(() => this._recreateCubes());
  }

  _recreateCubes() {
    this._removeAllCubes();
    this._initCubes();
  }

  _removeAllCubes() {
    for (let rowX = 0; rowX < this._cubes.length; rowX += 1) {
      for (let columnZ = 0; columnZ < this._cubes[0].length; columnZ += 1) {
        const cube = this._cubes[rowX][columnZ];
        this.remove(cube);
      }
    }

    this._geometry.dispose();
    this._cubes = [];
  }

  _randomPick(array) {
    const rand = Math.random() * array.length | 0;
    return array[rand];
  }

  _getSign(number) {
    return number < 0 ? -1 : 1;
  }
}
