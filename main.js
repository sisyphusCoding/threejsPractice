import './style.css'

import{Pane} from 'tweakpane'
import * as THREE from 'three'
import gsap from 'gsap'
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { CubeTextureLoader } from 'three'
const canvas = document.querySelector('#canvas')


const textureLoader = new THREE.TextureLoader()


const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const colorTexture = textureLoader.load('/textures/door/color.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const metalTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughTexture = textureLoader.load('/textures/door/roughness.jpg')

const gradientTexture01 = textureLoader.load('/textures/gradients/5.jpg')
const matTexture01 = textureLoader.load('/textures/matcaps/8.png')

gradientTexture01.minFilter = THREE.NearestFilter
gradientTexture01.magFilter = THREE.NearestFilter
gradientTexture01.generateMipmaps = false



const cubeLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg'
])




const pane = new Pane({expanded:true})

const param = {
  color: 0x191919,
  spin: ()=>{
  console.log('spinning')

   gsap.from(sphere.rotation,{y:cube.position.y + Math.PI *0}) 
   gsap.to(sphere.rotation,{duration:1,y:cube.position.y + Math.PI *2,ease:'power3.out'}) 
   gsap.from(plane.rotation,{y:cube.position.y + Math.PI *0}) 
   gsap.to(plane.rotation,{duration:1,y:cube.position.y + Math.PI *2,ease:'power3.out'}) 

   gsap.from(torus.rotation,{y:cube.position.y + Math.PI *0}) 
   gsap.to(torus.rotation,{duration:1,y:cube.position.y + Math.PI *2,ease:'power3.out'}) 
  }
}

const pixelRatio = Math.min(window.devicePixelRatio , 2)
const sizes = {
  w:window.innerWidth,
  h:window.innerHeight,
}

window.addEventListener('dblclick',()=>{
  
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!document.fullscreenElement){
  
    if(canvas.requestFullscreen){
      canvas.requestFullscreen()
    }else if(canvas.webkitRequestFullscreen){
        canvas.webkitRequestFullscreen()
    }
    
  }else{
    if(document.exitFullscreen){
      document.exitFullscreen()
    }else if (document.webkitExitFullscreen){
       document.webkitExitFullscreen()
    }
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

const geometry = new THREE.BoxGeometry(2,.2,2)

const material = new THREE.MeshStandardMaterial()

material.metalness = 0.7
material.roughness = 0.2
material.map =colorTexture
material.aoMap = ambientTexture
material.aoMapIntensity = 1
material.displacementMap = heightTexture
material.displacementScale = 0.05
material.metalnessMap = metalTexture
material.roughnessMap = roughTexture
material.normalMap = normalTexture
material.transparent = true
material.alphaMap = alphaTexture

const sphere =  new THREE.Mesh(
  new THREE.SphereGeometry(0.5,64,64),
  material
)

sphere.geometry.setAttribute(
'uv2', 
 new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2))

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1,1,100,100),
  material
)

plane.geometry.setAttribute(
'uv2', 
 new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2))




const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3,0.2,64,128),
  material
)
torus.geometry.setAttribute(
'uv2', 
 new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2))

torus.position.x = 1.5

sphere.position.x = -1.5
scene.add(sphere,plane,torus)

const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.x=2 
pointLight.position.y=3 
pointLight.position.z = 4

scene.add(pointLight)

const camera = new THREE.PerspectiveCamera(75,sizes.w/sizes.h,.1,100)
camera.position.y=2
camera.position.x=2
camera.position.z=2.5
scene.add(camera)


const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
  antialias:true,
  canvas:canvas
})

renderer.setSize(sizes.w,sizes.h)
renderer.shadowMap.enabled = true


renderer.setPixelRatio(pixelRatio)
renderer.setClearColor(0x191919,0.1)


const clock = new THREE.Clock()

const tick = ( ) => {

  const elTime = clock.getElapsedTime()
  controls.update()
  renderer.render(scene,camera)

  window.requestAnimationFrame(tick)

}

tick()


let steps=  1/100

pane.addInput(material,'metalness',{min:0,max:1,steps:steps})
pane.addInput(material,'roughness',{min:0,max:1,steps:steps})
pane.addInput(material,'aoMapIntensity',{min:0,max:10,steps:steps,label:'Ambient Light Occlusion'})

pane.addInput(
material,
'displacementScale',
{min:0,max:1,steps:steps/10,label:'Displacement Scale'}
)

pane.addInput(material,'wireframe')
const handleColor =   pane.addInput(param,'color',{view:'color'})

handleColor.on('change',(e)=>{
material.color.set(e.value)
})

const handleSpin=  pane.addButton({
  label:'Animate',title:'Spin'
})

handleSpin.on('click',()=>{

   param.spin()
})





