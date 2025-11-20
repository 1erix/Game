'use client'

import { OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Door from "../objects/door"
import { useRouter } from "next/navigation"


useGLTF.preload('/models/office_table.glb')
useGLTF.preload('/models/yellow_armchair.glb')


export default function FirstMission() {

    const router = useRouter()

    function handleDoorClick() {
        router.push('/pages/start')
    }
    return (
        <Canvas
            style={{
                width: '100vw',
                height: '100vh',
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0
            }}

            shadows>
            <Suspense fallback={null} >

                <OrbitControls />

                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10} />
                <pointLight position={[-5, 2, -5]} intensity={2} color={'pink'} />

                <Door position={[0, -1, -10]} scale={0.03} onDoorClick={handleDoorClick} />

                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#FFD6AF" />
                </mesh>

                <mesh position={[0, 3, -9.9]} receiveShadow>
                    <boxGeometry args={[20, 8, 0.2]} />
                    <meshStandardMaterial color="#FFFAE3" />
                </mesh>

                <mesh position={[0, 3, 9.9]} receiveShadow>
                    <boxGeometry args={[20, 8, 0.2]} />
                    <meshStandardMaterial color="#FFFAE3" />
                </mesh>

                <mesh rotation={[0, Math.PI / 2, 0]} position={[9.9, 3, 0]} receiveShadow>
                    <boxGeometry args={[20, 8, 0.2]} />
                    <meshStandardMaterial color="#FFFAE3" />
                </mesh>

                <mesh rotation={[0, Math.PI / 2, 0]} position={[-9.9, 3, 0]} receiveShadow>
                    <boxGeometry args={[20, 8, 0.2]} />a
                    <meshStandardMaterial color="#F4D8CD" />
                </mesh>

            </Suspense >
        </Canvas >
    )
}