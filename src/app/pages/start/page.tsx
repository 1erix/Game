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
import { Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import BusinessCards from '@/app/entities/start/business_cards'
import Monstera from '@/app/entities/start/monstera'
import Player from '@/app/entities/objects/player'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import HideCursor from '@/app/entities/functions/hideCursor'
import DoorInteraction from '@/app/entities/functions/doorFunc'
import LoadingScreen from '@/app/entities/functions/loading'

function HybridCamera() {
    const { camera } = useThree()
    const player = useThree(state => state.scene.getObjectByName('player'))

    const cameraPosition = useRef(new THREE.Vector3())
    const cameraLookAt = useRef(new THREE.Vector3())
    const mouseRotation = useRef({ x: 0, y: 0 })

    const baseOffset = new THREE.Vector3(1, 1, -2)

    const roomBounds = {
        minX: -3.4,
        maxX: 3.4,
        minY: 0.5,
        maxY: 3,
        minZ: -2.4,
        maxZ: 2.4
    }

    const mouseSensitivity = 0.006

    useEffect(() => {

        const handleMouseMove = (event: MouseEvent) => {
            if (!player) return

            mouseRotation.current.x += event.movementX * mouseSensitivity
            mouseRotation.current.y += event.movementY * mouseSensitivity

            mouseRotation.current.y = Math.max(-0.8, Math.min(0.8, mouseRotation.current.y))
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [player])

    useFrame((state, delta) => {
        if (!player) return

        const targetPosition = new THREE.Vector3()
        const lookAtTarget = new THREE.Vector3()

        const spherical = new THREE.Spherical()
        spherical.radius = baseOffset.length()
        spherical.theta = mouseRotation.current.x + Math.PI
        spherical.phi = Math.PI / 2 + mouseRotation.current.y

        const offset = new THREE.Vector3()
        offset.setFromSpherical(spherical)

        targetPosition.copy(player.position).add(offset)
        lookAtTarget.copy(player.position)

        targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, roomBounds.minX, roomBounds.maxX)
        targetPosition.y = THREE.MathUtils.clamp(targetPosition.y, roomBounds.minY, roomBounds.maxY)
        targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, roomBounds.minZ, roomBounds.maxZ)

        lookAtTarget.x = THREE.MathUtils.clamp(lookAtTarget.x, roomBounds.minX + 0.5, roomBounds.maxX - 0.5)
        lookAtTarget.z = THREE.MathUtils.clamp(lookAtTarget.z, roomBounds.minZ + 0.5, roomBounds.maxZ - 0.5)

        cameraPosition.current.lerp(targetPosition, 5 * delta)
        cameraLookAt.current.lerp(lookAtTarget, 5 * delta)

        camera.position.copy(cameraPosition.current)
        camera.lookAt(cameraLookAt.current)
    })

    return null
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
        { position: [-0.3, 1.9], radius: 0.3, name: 'Monstera' },
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
        router.push('/pages/room1?spawn=door')
    }

    const handleDoor2Click = () => {
        router.push('/pages/room2?spawn=door')
    }

    const handleDoor3Click = () => {
        router.push('/pages/room3?spawn=door')
    }

    const doorPositions = [
        {
            position: [-2, -1, -2.45] as [number, number, number],
            onInteract: handleDoor1Click
        },
        {
            position: [0, -1, -2.45] as [number, number, number],
            onInteract: handleDoor2Click
        },
        {
            position: [2, -1, -2.45] as [number, number, number],
            onInteract: handleDoor3Click
        }
    ]

    return (

        <div style={{ width: '100vw', height: '100vh' }}>
            <LoadingScreen />
            <Canvas>
                <HideCursor />
                <HybridCamera />
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

                <DoorInteraction doorPositions={doorPositions} />


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