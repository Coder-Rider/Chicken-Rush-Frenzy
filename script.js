const counterDOM = document.getElementById('counter');
const endDOM = document.getElementById('end');

const scene = new THREE.Scene();

const distance = 500;
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0.1,
  10000
);

camera.rotation.x = 50 * Math.PI / 180;
camera.rotation.y = 20 * Math.PI / 180;
camera.rotation.z = 10 * Math.PI / 180;

const initialCameraPositionY = -Math.tan(camera.rotation.x) * distance;
const initialCameraPositionX = Math.tan(camera.rotation.y) *
  Math.sqrt(distance ** 2 + initialCameraPositionY ** 2);

camera.position.set(initialCameraPositionX, initialCameraPositionY, distance);

const zoom = 2;
const chickenSize = 15;
const positionWidth = 42;

let currentLane = 0;
let currentColumn = 8;

let moves = [];
let stepStartTimestamp;

const chicken = new THREE.Mesh(
  new THREE.BoxGeometry(30, 30, 30),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);

scene.add(chicken);

// lights
scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(-100, -100, 200);
scene.add(dirLight);

// renderer ✅ FIXED
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// ✅ CONTROLS (keyboard + mobile)
window.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("forward");
  if (e.key === "ArrowDown") move("backward");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
});

["forward","backward","left","right"].forEach(id => {
  document.getElementById(id).onclick = () => move(id);
  document.getElementById(id).ontouchstart = () => move(id);
});

function move(direction) {
  moves.push(direction);
}

// animation
function animate(timestamp) {
  requestAnimationFrame(animate);

  if (moves.length > 0) {
    const move = moves.shift();

    switch (move) {
      case "forward":
        chicken.position.y += positionWidth;
        currentLane++;
        counterDOM.innerText = currentLane;
        break;

      case "backward":
        chicken.position.y -= positionWidth;
        break;

      case "left":
        chicken.position.x -= positionWidth;
        break;

      case "right":
        chicken.position.x += positionWidth;
        break;
    }

    camera.position.y = initialCameraPositionY + chicken.position.y;
    camera.position.x = initialCameraPositionX + chicken.position.x;
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

// ✅ RESIZE FIX
window.addEventListener("resize", () => {
  camera.left = window.innerWidth / -2;
  camera.right = window.innerWidth / 2;
  camera.top = window.innerHeight / 2;
  camera.bottom = window.innerHeight / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});