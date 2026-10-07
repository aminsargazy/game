import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("controller-3d");


// =========================
// Scene
// =========================

const scene = new THREE.Scene();


// =========================
// Camera
// =========================

const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);


// =========================
// Renderer
// =========================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);


// =========================
// Lights
// =========================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    2
);

scene.add(ambientLight);


const blueLight = new THREE.PointLight(
    0x00aaff,
    40,
    10
);

blueLight.position.set(3, 2, 4);

scene.add(blueLight);


const purpleLight = new THREE.PointLight(
    0x8b5cf6,
    35,
    10
);

purpleLight.position.set(-3, 1, 2);

scene.add(purpleLight);


// =========================
// Controller
// =========================

let controller = null;

const loader = new GLTFLoader();

loader.load(
    "assets/models/dualsense.glb",

    (gltf) => {

        controller = gltf.scene;

        scene.add(controller);


        // پیدا کردن اندازه مدل
        const box = new THREE.Box3().setFromObject(
            controller
        );

        const size = box.getSize(
            new THREE.Vector3()
        );

        const center = box.getCenter(
            new THREE.Vector3()
        );


        // مرکز کردن مدل
        controller.position.sub(center);


        // تنظیم اندازه خودکار
        const maxSize = Math.max(
            size.x,
            size.y,
            size.z
        );

        const targetSize = 1.5;

        const scale =
            targetSize / maxSize;

        controller.scale.setScalar(scale);


        // چرخش اولیه
        controller.rotation.x = 0.15;
        controller.rotation.y = -0.35;


        console.log("CONTROLLER LOADED");

    },

    undefined,

    (error) => {

        console.error(
            "MODEL ERROR:",
            error
        );

    }
);


// =========================
// Mouse Movement
// =========================

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            (event.clientX / window.innerWidth) * 2 - 1;

        mouseY =
            (event.clientY / window.innerHeight) * 2 - 1;

    }
);


// =========================
// Scroll
// =========================

let scrollRotation = 0;

window.addEventListener(
    "scroll",
    () => {

        scrollRotation =
            window.scrollY * 0.004;

    }
);


// =========================
// Animation
// =========================

function animate() {

    requestAnimationFrame(animate);


    if (controller) {

        // چرخش با موس
        const targetY =
            scrollRotation +
            mouseX * 0.35;

        const targetX =
            mouseY * 0.2;


        controller.rotation.y +=
            (targetY - controller.rotation.y) * 0.08;

        controller.rotation.x +=
            (targetX - controller.rotation.x) * 0.08;


        // حرکت شناور خیلی نرم
        

    }


    renderer.render(
        scene,
        camera
    );
}

animate();


// =========================
// Responsive
// =========================

window.addEventListener(
    "resize",
    () => {

        const width =
            container.clientWidth;

        const height =
            container.clientHeight;


        camera.aspect =
            width / height;

        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }
);