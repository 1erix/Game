'use client'
import Door from '@/app/entities/objects/door'
import Armchair from '@/app/entities/start/armchair'
import Bookcase from '@/app/entities/start/bookcase'
import Books_and_Magazines from '@/app/entities/start/booksMag'
import Carpet from '@/app/entities/start/carpet'
import Magazines from '@/app/entities/start/magazines'
import Pictures from '@/app/entities/start/pictures'
import Plant from '@/app/entities/start/plant'
import Table from '@/app/entities/start/table'
import { OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import BusinessCards from '@/app/entities/start/business_cards'
import Monstera from '@/app/entities/start/monstera'
import Player from '@/app/entities/objects/player'
import { useRef } from 'react'
import * as THREE from 'three'

function CameraController() {
    const controlsRef = useRef<any>(null)

    const roomSize = {
        width: 1,
        height: 0.8,
        depth: 1.8
    }

    useFrame(() => {
        if (controlsRef.current) {
            const controls = controlsRef.current
            const target = controls.target
            const camera = controls.object

            target.x = THREE.MathUtils.clamp(target.x, -roomSize.width, roomSize.width)
            target.y = THREE.MathUtils.clamp(target.y, -0.8, 1.8)
            target.z = THREE.MathUtils.clamp(target.z, -roomSize.depth, roomSize.depth)

            camera.position.x = THREE.MathUtils.clamp(camera.position.x, -roomSize.width - 0.1, roomSize.width + 0.1)
            camera.position.y = THREE.MathUtils.clamp(camera.position.y, -0.7, roomSize.height + 1)
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, -roomSize.depth - 0.1, roomSize.depth + 0.1)

            controls.update()
        }
    })

    return (
        <OrbitControls
            ref={controlsRef}
            enablePan={true}
            minDistance={1.5}
            maxDistance={4}
            target={[0, 0.5, 0]}
        />
    )
}

function PlayerController() {
    const { scene } = useThree()

    const boundsPlayer = {
        minX: -3.2,
        maxX: 3.2,
        minZ: -2.2,
        maxZ: 2.2
    }

    const furnitureColliders = [
        { position: [2, 1.5], radius: 0.6, name: 'Armchair' },
        { position: [-0.8, 1.6], radius: 0.8, name: 'Table' },
        { position: [-2.8, 1.8], radius: 0.4, name: 'Plant' },
        { position: [-3.01, -1], radius: 0.5, name: 'Bookcase' },
        { position: [-0.3, 1.9], radius: 0.3, name: 'Monstera' }
    ]

    useFrame(() => {
        const player = scene.getObjectByName('player')
        if (!player) return

        const playerPos = player.position.clone()

        if (playerPos.x < boundsPlayer.minX) playerPos.x = boundsPlayer.minX
        if (playerPos.x > boundsPlayer.maxX) playerPos.x = boundsPlayer.maxX
        if (playerPos.z < boundsPlayer.minZ) playerPos.z = boundsPlayer.minZ
        if (playerPos.z > boundsPlayer.maxZ) playerPos.z = boundsPlayer.maxZ

        for (const furniture of furnitureColliders) {
            const distance = Math.sqrt(
                Math.pow(playerPos.x - furniture.position[0], 2) +
                Math.pow(playerPos.z - furniture.position[1], 2)
            )

            if (distance < furniture.radius + 0.3) {
                const direction = new THREE.Vector3(
                    playerPos.x - furniture.position[0],
                    0,
                    playerPos.z - furniture.position[1]
                ).normalize()

                playerPos.add(direction.multiplyScalar(0.05))
            }
        }

        player.position.copy(playerPos)
    })

    return null
}

export default function Home() {
    const router = useRouter()

    const handleDoor1Click = () => {
        router.push('/pages/game')
    }

    const handleDoor2Click = () => {
        router.push('/pages/game2')
    }

    const handleDoor3Click = () => {
        router.push('/pages/game3')
    }

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas>
                <CameraController />
                <PlayerController />

                <ambientLight intensity={1.2} />
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
                    shadow-camera-bottom={-10}
                />
                <pointLight position={[10, 10, 10]} />

                <Door scale={0.01} position={[-2, -1, -2.45]} onDoorClick={handleDoor1Click} />
                <Door scale={0.01} position={[0, -1, -2.45]} onDoorClick={handleDoor2Click} />
                <Door scale={0.01} position={[2, -1, -2.45]} onDoorClick={handleDoor3Click} />

                <Armchair scale={1} position={[2, 0, 1.5]} rotation={[0, 2, 0]} />
                <Table />
                <Carpet />
                <Bookcase />
                <Plant />
                <Pictures />
                <Magazines />
                <Books_and_Magazines />
                <BusinessCards />
                <Monstera />

                <Player />

                <group>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <planeGeometry args={[7, 5]} />
                        <meshStandardMaterial
                            color={'#7b746f'}
                            roughness={0.3}
                            transparent
                            opacity={1}
                        />
                    </mesh>

                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
                        <planeGeometry args={[7, 5]} />
                        <meshStandardMaterial color={'#7b746f'} />
                    </mesh>

                    <mesh position={[0, 0.5, -2.5]}>
                        <boxGeometry args={[7, 3, 0.2]} />
                        <meshStandardMaterial color={'#fbece5'} />
                    </mesh>

                    <mesh position={[0, 0.5, 2.5]}>
                        <boxGeometry args={[7, 3, 0.2]} />
                        <meshStandardMaterial color={'#fbece5'} />
                    </mesh>

                    <mesh rotation={[0, Math.PI / 2, 0]} position={[3.5, 0.5, 0]}>
                        <boxGeometry args={[5, 3, 0.2]} />
                        <meshStandardMaterial color={'#fbece5'} />
                    </mesh>

                    <Text
                        position={[0, 1, 2.3]}
                        rotation={[0, Math.PI, 0]}
                        fontSize={0.3}
                        color="#333"
                    >
                        CHULAKOV
                    </Text>

                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.5, 0.5, 0]}>
                        <boxGeometry args={[5, 3, 0.2]} />
                        <meshStandardMaterial color={'#fbece5'} />
                    </mesh>
                </group>
            </Canvas>
        </div>
    )
}