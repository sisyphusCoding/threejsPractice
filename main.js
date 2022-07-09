import './style.css'

import{Pane} from 'tweakpane'
import * as THREE from 'three'
import gsap from 'gsap'
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { Mesh } from 'three'
import { normalize } from 'gsap/gsap-core'
const canvas = document.querySelector('#canvas')




const pane = new Pane({expanded:true})

const loadingManager  = new THREE.LoadingManager()

loadingManager.onStart = () =>{console.log('start')}
loadingManager.onProgress=()=>{console.log('progress')}
loadingManager.onLoad =()=>{console.log('loaded')}
loadingManager.onError = () => {console.log('error')}

const textureLoader = new THREE.TextureLoader(loadingManager)


const coltexture = textureLoader.load('/static/textures/minecraft.png')
const alphatexture = textureLoader.load('/static/textures/door/alpha.jpg')
const noramaltexture = textureLoader.load('/static/textures/door/normal.jpg')
const ambienttexture = textureLoader.load('/static/textures/door/ambient.jpg')

coltexture.generateMipmaps = false
coltexture.minFilter = THREE.NearestFilter
coltexture.magFilter = THREE.NearestFilter

const param = {
  color: 0x191919,
  spin: ()=>{
  console.log('spinning')


   gsap.from(cube.rotation,{y:cube.position.y + Math.PI *0}) 
   gsap.to(cube.rotation,{duration:1,y:cube.position.y + Math.PI *2,ease:'power3.out'}) 

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
const material = new THREE.MeshBasicMaterial({map:coltexture})

const cube = new THREE.Mesh(
geometry, material
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

const p = pane.addFolder({
  title:'Position', expanded:false
})

let step = 1/50


p.addInput(cube.position,'x',{min:-5,max:5,step:step})
p.addInput(cube.position,'y',{min:-5,max:5,step:step})
p.addInput(cube.position,'z',{min:-5,max:5,step:step})

const r = pane.addFolder({
  title:'Rotation', expanded:false
})



r.addInput(cube.rotation,'x',{min:-5,max:5,step:step})
r.addInput(cube.rotation,'y',{min:-5,max:5,step:step})
r.addInput(cube.rotation,'z',{min:-5,max:5,step:step})



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





