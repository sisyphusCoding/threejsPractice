import './style.css'

import{Pane} from 'tweakpane'
import * as THREE from 'three'
import gsap from 'gsap'
import{FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import{TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { TextureLoader } from 'three'

const canvas = document.querySelector('#canvas')

const textureLoader = new THREE.TextureLoader()

const matCap01 = textureLoader.load('/textures/matcaps/8.png') 



const scene = new THREE.Scene()
const fontLoader =  new FontLoader()
fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font)=>{
    const textGeometry = new TextGeometry(
      'Hello Three.JS',
      {
        font:font,
        size:0.5,
        height:0.2,
        curveSegments:6,
        bevelEnabled:true,
        bevelThickness:0.03,
        bevelSize:0.02,
        bevelOffset:0,
        bevelSegments:4
      }
    )
          
    textGeometry.center()

    const material  = new THREE.MeshMatcapMaterial()
    material.matcap = matCap01


handleColor.on('change',(e)=>{
textMaterial.color.set(e.value)
})
    const text = new THREE.Mesh(textGeometry,material)
    scene.add(text)

    console.time('donut')


      const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
    for(let i = 0 ; i <150;i++){

      const donut = new THREE.Mesh(donutGeometry,material)

      donut.position.x  = (Math.random() - 0.5) * 10
      donut.position.y  = (Math.random() - 0.5) * 10
      donut.position.z  = (Math.random() - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI

      donut.rotation.y = Math.random() * Math.PI

      const thisScale = Math.random()

      donut.scale.set(thisScale,thisScale,thisScale)

      scene.add(donut)
    }

    console.timeEnd('donut')
  }
)



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


const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,0.5)
pointLight.position.x=2
pointLight.position.y=2
pointLight.position.z = 5

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

const handleColor =   pane.addInput(param,'color',{view:'color'})


const handleSpin=  pane.addButton({
  label:'Animate',title:'Spin'
})

handleSpin.on('click',()=>{

   param.spin()
})





