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
camera.position.set(-34, 16, -20) //34, 16, -20

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


let warehouseRoof = new THREE.Object3D();
loader.load('models/gltf/warehouseRoof.glb', (warehouseRoof) => {
    warehouseRoof = warehouseRoof
    scene.add(warehouseRoof.scene)
})

let truck_1;
let truck_2;
let truck_3;
let truck_4;

loader.load('models/gltf/truck.glb', (truck) => {
    truck_1 = truck.scene.children[0]
    truck_1.position.set(-10, -0.25, -2)


    truck_2 = THREE.Object3D.prototype.clone.call(truck_1);
    truck_2.position.set(-10, -0.25, -5)

    truck_3 = THREE.Object3D.prototype.clone.call(truck_1);
    truck_3.position.set(-5, -0.25, 7)
    truck_3.rotation.y = Math.PI

    truck_4 = THREE.Object3D.prototype.clone.call(truck_1);
    truck_4.position.set(-4, -0.25, -9)
    truck_4.rotation.y = Math.PI
    // truck_1.children[5].material.color.setHex(0x000)

    scene.add(truck_1)
    scene.add(truck_2)
    scene.add(truck_3)
    scene.add(truck_4)
})


let truckLoader_1;
let truckLoader_2;
let truckLoader_3;

loader.load('models/gltf/truckLoader.glb', (truckLoader) => {
    truckLoader_1 = truckLoader.scene

    truckLoader_2 = THREE.Object3D.prototype.clone.call(truckLoader_1);
    truckLoader_2.position.set(-20, -0.25, 0)

    truckLoader_3 = THREE.Object3D.prototype.clone.call(truckLoader_1);
    truckLoader_3.position.set(0, -0.25, 0)

    scene.add(truckLoader_1)
    scene.add(truckLoader_2)
    scene.add(truckLoader_3)
})

/* Intro camera animation using tween */
function introAnimation() {
    controls.enabled = false //disable orbit controls to animate the camera

    new TWEEN.Tween(camera.position.set(26, 4, -35)).to({ // from camera position
        x: 16, //desired x position to go
        y: 50, //desired y position to go
        z: -0.15 //desired z position to go
    }, 6500) // time take to animate
        .delay(1000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
        .onComplete(function () { //on finish animation
            controls.enabled = true //enable orbit controls
            setOrbitControlsLimits() //enable controls limits
            TWEEN.remove(this) // remove the animation from memory
        })
}

// const roof_Animation = new TWEEN.Tween({ x: 0, y: 0 })
//     .to({ x: 100, y: 0}, 3000)
//     // .repeat(Infinity)
//     // .delay(1000)
//     // .yoyo(true)
//     // .easing(TWEEN.Easing.Elastic.InOut)
//     .onUpdate((coords) => {
//         if (warehouseRoof) {
//             console.log(warehouseRoof);
//             warehouseRoof.position.x = coords.x;
//             warehouseRoof.position.y = coords.y;
//             // warehouseRoof.position.z = coords.z;
//         }
//     })
// roof_Animation.start();

// document.getElementById("toggleRoof").addEventListener("click", () => {
//     console.log('click')
//     if (warehouseRoof) {
//         roof_Animation.start();
//     }
// });

/* Vehicle  animation using tween */
const truckStartPosition = { x: -10, y: 0 }
const truckTargetPosition = { x: -25, y: 0 }

const truck_1_Animation = new TWEEN.Tween(truckStartPosition)
    .to(truckTargetPosition, 3000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Elastic.InOut)
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

const truck_3_Animation = new TWEEN.Tween(truckStartPosition)
    .to(truckTargetPosition, 2000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate((coords) => {
        if (truck_1) {
            truck_3.position.x = coords.x;
            truck_3.position.y = coords.y;
        }
    })

const truck_4_Animation = new TWEEN.Tween(truckStartPosition)
    .to(truckTargetPosition, 4000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate((coords) => {
        if (truck_1) {
            truck_4.position.x = coords.x;
            truck_4.position.y = coords.y;
        }
    })

const truckLoader_Animation = new TWEEN.Tween({ x: 0, y: 0 })
    .to({ x: -8, y: 0 }, 10000)
    .repeat(Infinity)
    .delay(1000)
    .yoyo(true)
    .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate((coords) => {
        if (truckLoader_1) {
            truckLoader_1.position.x = coords.x;
            truckLoader_1.position.y = coords.y;
        }
    })

/* Animation start */
introAnimation()

truck_1_Animation.start()
truck_2_Animation.start()
// truck_3_Animation.start()
// truck_4_Animation.start()
truckLoader_Animation.start()

/* render loop function */
function rendeLoop() {

    TWEEN.update() // update animations

    controls.update() // update orbit controls

    renderer.render(scene, camera) // render the scene using the camera

    requestAnimationFrame(rendeLoop) //loop the render function
}

rendeLoop() //start rendering