/* Import */
import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

THREE.Cache.enabled = true;

/* Draco loader to load draco compressed models from blender */
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

/* Div container creation to hold threejs experience */
const container = document.createElement('div')
document.body.appendChild(container)

/* Scene creation */
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/*  Helpers */
const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

/* Renderer config */
const renderer = new THREE.WebGLRenderer({ antialias: true }) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

/* Cameras config */
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100)
camera.position.set(-34, 16, -20)

scene.add(camera)

/*  Make experience full screen */
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
})

/* Create orbit controls */
const controls = new OrbitControls(camera, renderer.domElement)

/* Define orbit controls limits */
function setOrbitControlsLimits() {
    controls.enableDamping = true
    controls.dampingFactor = 0.04
    controls.minDistance = 35
    controls.maxDistance = 60
    controls.enableRotate = true
    controls.enableZoom = true
    controls.maxPolarAngle = Math.PI / 2.5
}
/* Scene lights */
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
scene.add(ambient)

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96)
sunLight.position.set(-69, 44, 14)
scene.add(sunLight)

/* Loading glb/gltf model */
loader.load('models/gltf/warehouse.glb', (warehouse) => {
    scene.add(warehouse.scene)
})

// let warehouseRoof = new THREE.Object3D();
// loader.load('models/gltf/warehouseRoof.glb', (warehouseRoof) => {
//     warehouseRoof = warehouseRoof
//     scene.add(warehouseRoof.scene)
// })

// document.getElementById('toggleRoof')
//     .addEventListener('click', () => { 
//         warehouseRoof.visible = !warehouseRoof.visible;
//         warehouseRoof
//         debugger
//     }

//     );

let truck_1;
let truck_2;

loader.load('models/gltf/truck.glb', (truck) => {
    truck_1 = truck.scene.children[0]
    truck_1.position.set(-10, 0, -2)

    truck_2 = THREE.Object3D.prototype.clone.call(truck_1);
    truck_2.position.set(-10, 0, -5)

    scene.add(truck_1)
    scene.add(truck_2)
})


let truckLoader_1;
let truckLoader_2;
let truckLoader_3;

loader.load('models/gltf/truckLoader.glb', (truckLoader) => {
    truckLoader_1 = truckLoader.scene
    truckLoader_1.position.set(0, 0, 0)
    truckLoader_1.rotation.y = 230 * Math.PI / 180;

    truckLoader_2 = THREE.Object3D.prototype.clone.call(truckLoader_1);
    truckLoader_2.position.set(0, 0, -5)

    truckLoader_3 = THREE.Object3D.prototype.clone.call(truckLoader_1);
    truckLoader_3.rotation.y = 130 * Math.PI / 180;
    truckLoader_3.position.set(-4, 0, 3)

    scene.add(truckLoader_1)
    scene.add(truckLoader_2)
    scene.add(truckLoader_3)
})

/* Intro camera animation using tween */
function introAnimation() {
    controls.enabled = false //disable orbit controls to animate the camera

    new TWEEN.Tween(camera.position.set(26, 4, -35))
        .to({ x: -25, y: 20, z: 30 }, 6500)
        .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start()
        .onComplete(function () {
            controls.enabled = true
            setOrbitControlsLimits()
            TWEEN.remove(this)
        })
}

/* Vehicle  animation using tween */
const truckStartPosition = { x: -10, y: 0 }
const truckTargetPosition = { x: -25, y: 0 }

const truck_1_Animation = new TWEEN.Tween(truckStartPosition)
    .to(truckTargetPosition, 2500)
    .repeat(Infinity)
    .delay(5000)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate((coords) => {
        if (truck_1) {
            truck_1.position.x = coords.x;
            truck_1.position.y = coords.y;
        }
    })

const truck_2_Animation = new TWEEN.Tween(truckStartPosition)
    .to(truckTargetPosition, 5000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate((coords) => {
        if (truck_1) {
            truck_2.position.x = coords.x;
            truck_2.position.y = coords.y;
        }
    })

const truckLoader_1_Animation = new TWEEN.Tween({ x: 0, y: -2.5 })
    .to({ x: -7, y: -2.5 }, 4000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.In)
    .onUpdate((coords) => {
        if (truckLoader_1) {
            truckLoader_1.position.x = coords.x;
            truckLoader_1.position.z = coords.y;
        }
    })

const truckLoader_2_Animation = new TWEEN.Tween({ x: 0, y: -5.5 })
    .to({ x: -7, y: -5.5 }, 7500)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate((coords) => {
        if (truckLoader_2) {
            truckLoader_2.position.x = coords.x;
            truckLoader_2.position.z = coords.y;
        }
    })

const truckLoader_3_Animation = new TWEEN.Tween({ x: -6, y: 3 })
    .to({ x: 7, y: 3 }, 5000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate((coords) => {
        if (truckLoader_3) {
            truckLoader_3.position.x = coords.x;
            truckLoader_3.position.z = coords.y;
        }
    })

/* Animation start */
truckLoader_1_Animation.start()
truckLoader_2_Animation.start()
truckLoader_3_Animation.start()

truck_1_Animation.start()
truck_2_Animation.start()

introAnimation()

/* render loop function */
function rendeLoop() {

    TWEEN.update() // update animations

    controls.update() // update orbit controls

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(rendeLoop) //loop the render function
}

rendeLoop() //start rendering