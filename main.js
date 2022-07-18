import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from 'tweakpane'
import { AmbientLight, PerspectiveCamera } from 'three'


const pane = new Pane()

const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene()


const ambientLight = new THREE.AmbientLight()

scene.add(ambientLight)

const directionLight = new THREE.DirectionalLight()

scene.add(directionLight)


const parameters={}

parameters.count = 10000
parameters.size = 0.01
parameters.branches = 3
parameters.radius = 3
parameters.spin = 4
parameters.randomness = 0.09
parameters.randomStrength = 5
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
 
  if(points !==null){
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }



  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count*3)


  const colors = new Float32Array(parameters.count*3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)


  for(let i = 0 ; i <parameters.count; i++){
    
  const i3 = i * 3 

  const radius = Math.random() * parameters.radius

  const spinAngle  = radius * parameters.spin

  const branchAngle  =   (i % parameters.branches) / parameters.branches * Math.PI * 2


  const randomX =  Math.pow(Math.random(),parameters.randomStrength) * (Math.random()< 0.5 ? 1 : -1) * parameters.randomness * radius

  const randomY =  Math.pow(Math.random(),parameters.randomStrength) * (Math.random()< 0.5 ? 1 : -1) * parameters.randomness * radius

  const randomZ =  Math.pow(Math.random(),parameters.randomStrength) * (Math.random()< 0.5 ? 1 : -1) * parameters.randomness * radius

   positions[i3+0] =  Math.cos(branchAngle + spinAngle) * radius + randomX

   positions[i3+1] = randomY

   positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ



  const mixedColor = colorInside.clone()

  mixedColor.lerp(colorOutside, radius/parameters.radius)  




   colors[i3] = mixedColor.r
  colors[i3+1]= mixedColor.g
  colors[i3+2] = mixedColor.b

  }



  geometry.setAttribute(
  'position',
   new THREE.BufferAttribute(positions,3)
  )


  geometry.setAttribute(
  'color',
   new THREE.BufferAttribute(colors,3)
  )


  material = new THREE.PointsMaterial({
    size:parameters.size,
    sizeAttenuation:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexColors:true
  })

  points  = new THREE.Points(geometry,material)
  scene.add(points)

}

generateGalaxy()
const sizes = {
  w:window.innerWidth ,
  h:window.innerHeight
}

window.addEventListener('resize',()=>{
  sizes.w = window.innerWidth
  sizes.h = window.innerHeight

  camera.aspect = sizes.w / sizes.h
  camera.updateProjectionMatrix()


  renderer.setSize(sizes.w,sizes.h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})



const camera = new THREE.PerspectiveCamera(75,sizes.w/sizes.h,1,100)
camera.position.set(3,3,2)
scene.add(camera)

const controls = new OrbitControls(camera,canvas)
controls.enableDamping = true


const renderer = new THREE.WebGLRenderer({canvas:canvas})


renderer.setSize(sizes.w,sizes.h)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))


const clock = new THREE.Clock()

const tick = () =>{
  const elTime = clock.getElapsedTime()

  controls.update()

  renderer.render(scene,camera)

  let r = 3

  


  window.requestAnimationFrame(tick)
} 

tick()

const p1 = pane.addFolder({title:'Particle Parameters'})

p1.addInput(parameters,'count',{
  min:100,max:999999,
  step:100,
  label:'Count'
})

p1.addInput(parameters,'size',{
  min:0.00001,max:0.1,step:0.001,
  label:'Size'
})


p1.addInput(parameters,'radius',{
  min:0.01,max:20,step:0.01,
  label:'Radius'
})



p1.addInput(parameters,'branches',{
  min:3,max:20,step:1,
  label:'Branches'
})


p1.addInput(parameters,'spin',{
  min:-5,max:5,step:0.001,
  label:'Spin'
})

p1.addInput(parameters,'randomness',{
  min:0,max:5,step:0.001,
  label:'Randomness'
})


p1.addInput(parameters,'randomStrength',{
  min:-5,max:5,step:0.1,
  label:'Random Strength'
})

p1.addInput(parameters,'insideColor')

p1.addInput(parameters,'outsideColor')

pane.on('change',()=>{generateGalaxy()})
