import './style.css'


import * as THREE from 'three'
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
const canvas = document.querySelector('#canvas')



const pixelRatio = Math.min(window.devicePixelRatio , 2)
const sizes = {
  w:window.innerWidth,
  h:window.innerHeight,
}


window.addEventListener('dblclick',()=>{
  
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!document.fullscreenElement){
    canvas.requestFullscreen()
  }else{
    document.exitFullscreen()
  }

})

window.addEventListener('resize',()=>{
  sizes.w = window.innerWidth 
  sizes.h = window.innerHeight 

  camera.aspect = sizes.w / sizes.h
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.w,sizes.h)
  renderer.setPixelRatio(pixelRatio)

})
const cursor = {
  x:0,
  y:0
}

window.addEventListener('mousemove',(event)=>{
    cursor.x = (event.clientX / sizes.w) - 0.5
    cursor.y= -( (event.clientY / sizes.h) - 0.5)    
})

const scene = new THREE.Scene()
const cube = new THREE.Mesh(
new THREE.BoxGeometry(2,.2,2,5,5,1),
new THREE.MeshBasicMaterial({color:0x001616})
)

cube.receiveShadow = true
cube.castShadow = true

scene.add(cube)

const camera = new THREE.PerspectiveCamera(75,sizes.w/sizes.h,.1,100)
camera.position.y=2
camera.position.x=2
camera.position.z=2.5
camera.lookAt(cube.position)
scene.add(camera)

const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
  antialias:true,
  canvas:canvas
})

renderer.setSize(sizes.w,sizes.h)
renderer.shadowMap.enabled = true

renderer.setClearColor(0xc0c0c0,0)
renderer.setPixelRatio(pixelRatio)

const clock = new THREE.Clock()

const tick = ( ) => {

  const elTime = clock.getElapsedTime()
  controls.update()
  renderer.render(scene,camera)

  window.requestAnimationFrame(tick)

}

tick()

