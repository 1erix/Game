'use client'

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Door from "@/app/entities/objects/door"
import OfficeTable from "@/app/entities/room1/officeTable"
import OfficeChair from "@/app/entities/room1/officeChair"
import Whiteboard from "@/app/entities/room1/whiteboard"
import OfficeSofa from "@/app/entities/room1/officesofa"
import OfficeCoffeTable from "@/app/entities/room1/officecoffetable"
import Shelf from "@/app/entities/room1/shelf"
import Imac from "@/app/entities/room1/imac"
import WallShelf from "@/app/entities/room1/wallshelf"
import OfficePlants from "@/app/entities/room1/officePlants"
import Player from "@/app/entities/objects/player"
import FloorTexture from "@/app/entities/textures/floortexture"
import * as THREE from 'three'
import HideCursor from "@/app/entities/functions/hideCursor"
import DoorInteraction from "@/app/entities/functions/doorFunc"
import LoadingScreen from "@/app/entities/functions/loading"
import Clock from "@/app/entities/room3/wall-clock"
import ClickSprintMission, { SpeedMissionUI } from "@/app/entities/functions/missions/room1/coffee-cups"
import ComputerSpeedMission, { ComputerSpeedMissionUI } from "@/app/entities/functions/missions/room1/computer-mission"

function HybridCamera() {
    const { camera } = useThree()
    const player = useThree(state => state.scene.getObjectByName('player'))

    const cameraPosition = useRef(new THREE.Vector3())
    const cameraLookAt = useRef(new THREE.Vector3())
    const mouseRotation = useRef({ x: 0, y: 0 })

    const baseOffset = new THREE.Vector3(1, 1, -2)

    const roomBounds = {
        minX: -4.8,
        maxX: 4.8,
        minY: 0.5,
        maxY: 3,
        minZ: -4.8,
        maxZ: 4.8
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
        minX: -4.8,
        maxX: 4.8,
        minZ: -4.8,
        maxZ: 4.8
    }

    const furnitureColliders = [
        { position: [0, 2], radius: 0, name: 'table1' },
        { position: [-1.7, 4], radius: 0, name: 'table2' },
        { position: [1.7, 4], radius: 0, name: 'table3' },
        { position: [1.7, 2], radius: 0, name: 'table4' },
        { position: [0, 4], radius: 0, name: 'table5' },
        { position: [-1.7, 2], radius: 0, name: 'table6' },
        { position: [-1.7, 4.3], radius: 0, name: 'chair1' },
        { position: [0, 4.3], radius: 0, name: 'chair2' },
        { position: [1.7, 4.6], radius: 0, name: 'chair3' },
        { position: [0, 2.7], radius: 0, name: 'chair4' },
        { position: [-1.7, 2.5], radius: 0, name: 'chair5' },
        { position: [1.7, 2.5], radius: 0, name: 'chair6' },
        { position: [-3.5, -3], radius: 0, name: 'whiteboard' },
        { position: [3.3, -3], radius: 1.7, name: 'sofa' },
        { position: [2.6, -2.4], radius: -0.5, name: 'coffeTable' },
        { position: [4.9, -0.3], radius: 0, name: 'shelf' },
        { position: [2, 4.9], radius: 0.3, name: 'wallshelf' },
        { position: [-1, 4.8], radius: 0.3, name: 'clock' },
        { position: [2.6, -2.4], radius: 0.3, name: 'flowers' },
        { position: [-4.7, 4], radius: 0.3, name: 'plants' },
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

export default function FirstRoom() {

    const router = useRouter()

    function handleDoorClick() {
        router.push('/pages/start?spawn=door')
    }

    const doorPosition = [
        {
            position: [0, -1, -4.9] as [number, number, number],
            onInteract: handleDoorClick
        }
    ]
    return (
        <div>
            <LoadingScreen />
            <SpeedMissionUI />
            <ComputerSpeedMissionUI />
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
                    <HideCursor />
                    <HybridCamera />

                    {/* <OrbitControls /> */}
                    <PlayerController />

                    <ambientLight intensity={1} />
                    <directionalLight
                        position={[10, 10, 3.5]}
                        intensity={0.5}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10} />
                    <pointLight position={[0, 2, 2.5]} intensity={2} color={'white'} />

                    <Player />

                    <DoorInteraction doorPositions={doorPosition} />

                    <Door position={[0, -1, -4.9]} scale={0.01} onDoorClick={handleDoorClick} />

                    <OfficeTable position={[0, -1, 1]} rotation={[0, 0, 0]} />
                    <OfficeTable position={[-1.7, -1, 4]} rotation={[0, 0, 0]} />
                    <OfficeTable position={[1.7, -1, 4]} rotation={[0, 0, 0]} />
                    <OfficeTable position={[1.7, -1, 1]} rotation={[0, 0, 0]} />
                    <OfficeTable position={[0, -1, 4]} rotation={[0, 0, 0]} />
                    <OfficeTable position={[-1.7, -1, 1]} rotation={[0, 0, 0]} />

                    <OfficeChair position={[-1.7, -1, 4.3]} rotation={[0, Math.PI / -1.5, 0]} />
                    <OfficeChair position={[0, -1, 4.3]} rotation={[0, Math.PI / 1.7, 0]} />
                    <OfficeChair position={[1.7, -1, 4.6]} rotation={[0, Math.PI / 1, 0]} />
                    <OfficeChair position={[0, -1, 1.7]} rotation={[0, Math.PI / 1, 0]} />
                    <OfficeChair position={[-1.7, -1, 1.5]} rotation={[0, Math.PI / -1.7, 0]} />
                    <OfficeChair position={[1.7, -1, 1.5]} rotation={[0, Math.PI / -1.5, 0]} />

                    <Whiteboard />

                    <OfficeSofa />

                    <OfficeCoffeTable />

                    <ClickSprintMission />

                    <ComputerSpeedMission position={[0, 0, 0]}
                        rotation={[0, 0, 0]} />

                    <Shelf />

                    <Imac position={[0, -0.4, 0.5]} rotation={[0, 0, 0]} />
                    <Imac position={[-1.7, -0.4, 0.5]} rotation={[0, 0, 0]} />
                    <Imac position={[1.7, -0.4, 0.5]} rotation={[0, 0, 0]} />
                    <Imac position={[0, -0.4, 3.5]} rotation={[0, 0, 0]} />
                    <Imac position={[-1.7, -0.4, 3.5]} rotation={[0, 0, 0]} />
                    <Imac position={[1.7, -0.4, 3.5]} rotation={[0, 0, 0]} />

                    <WallShelf />

                    <Clock position={[0, 0.6, 4.8]} rotation={[0, -3.1, 0]} />

                    {/* <Flowers /> */}

                    <OfficePlants />

                    <FloorTexture widthSize={10} heightSize={10} />

                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
                        <planeGeometry args={[10, 10]} />
                        <meshStandardMaterial color={'#7b746f'} />
                    </mesh>

                    <mesh position={[0, 0.5, -5]} receiveShadow>
                        <boxGeometry args={[10, 3, 0.2]} />
                        <meshStandardMaterial color="#b1a291" roughness={0.4} />
                    </mesh>

                    <mesh position={[0, 0.5, 5]} receiveShadow>
                        <boxGeometry args={[10, 3, 0.2]} />
                        <meshStandardMaterial color="#b1a291" roughness={0.4} />
                    </mesh>

                    <mesh rotation={[0, Math.PI / 2, 0]} position={[5, 0.5, 0]} receiveShadow>
                        <boxGeometry args={[10, 3, 0.2]} />
                        <meshStandardMaterial color="#b1a291" roughness={0.4} />
                    </mesh>

                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 0.5, 0]} receiveShadow>
                        <boxGeometry args={[10, 3, 0.2]} />a
                        <meshStandardMaterial color="#b1a291" roughness={0.4} />
                    </mesh>

                </Suspense >
            </Canvas >
        </div>
    )
}