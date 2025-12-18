'use client'

import DoorInteraction from "@/app/entities/functions/doorFunc"
import HideCursor from "@/app/entities/functions/hideCursor"
import LoadingScreen from "@/app/entities/functions/loading"
import ResponsibilityMission, { ResponsibilityMissionUI } from "@/app/entities/functions/missions/room2/npc-mission"
import Door from "@/app/entities/objects/door"
import Player from "@/app/entities/objects/player"
import BarChairs from "@/app/entities/room2/barChairs"
import BookCase from "@/app/entities/room2/bookcase"
import CoffeeMachine from "@/app/entities/room2/coffeemachine"
import ConsoleTable from "@/app/entities/room2/consoleTable"
import Fridge from "@/app/entities/room2/fridge"
import Kitchen from "@/app/entities/room2/kitchen"
import MetalWallArt from "@/app/entities/room2/metalwallrt"
import Microwave from "@/app/entities/room2/microwave"
import NPC from "@/app/entities/room2/npc"
import CoffeTable from "@/app/entities/room2/restroomtable"
import SmallPlant from "@/app/entities/room2/smallplant"
import Sofa from "@/app/entities/room2/sofa"
import TennisTable from "@/app/entities/room2/table-tennis"
import TV from "@/app/entities/room2/tv"
import WallArt from "@/app/entities/room2/wallart"
import WallDecor from "@/app/entities/room2/walldecorations"
import Room2Floor from "@/app/entities/textures/room2floor"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"
import * as THREE from 'three'

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
        { position: [-3.52, 3.52], radius: 0.8, name: 'sofa' },
        { position: [4, -1], radius: 0.8, name: 'console_table' },
        { position: [1.49, 3.1], radius: 0.8, name: 'kitchen' },
        { position: [4.5, 0], radius: 0.8, name: 'barchair1' },
        { position: [3.5, 0], radius: 0.8, name: 'barchair2' },
        { position: [3.5, -1.9], radius: 0.8, name: 'barchair3' },
        { position: [4.5, -1.9], radius: 0.8, name: 'barchair4' },
        { position: [2.5, -1], radius: 0.8, name: 'barchair5' },
        { position: [2.8, 4.7], radius: 0.8, name: 'microwave' },
        { position: [-3, -2.5], radius: 0.8, name: 'tennis_table' },
        { position: [4, 4.5], radius: 0.8, name: 'fridge' },
        { position: [-3, 3], radius: 0.8, name: 'coffe_table' },

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




        // console.log(playerPos)
    })

    return null
}

export default function SecondRoom() {
    const router = useRouter()

    function handleDoorClick() {
        router.push('/pages/start?spawn=door')
    }

    const doorPosition = [
        {
            position: [0, -1, -4.95] as [number, number, number],
            onInteract: handleDoorClick
        }
    ]
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <LoadingScreen />
            <ResponsibilityMissionUI />
            <Canvas>
                <Suspense fallback={null}>
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

                    <HybridCamera />
                    <PlayerController />
                    <HideCursor />

                    <Door position={[0, -1, -4.95]} scale={0.01} onDoorClick={handleDoorClick} />
                    <DoorInteraction doorPositions={doorPosition} />

                    <Sofa />

                    <ConsoleTable />
                    <Kitchen />


                    <BarChairs position={[4.5, -1, 0]} rotation={[0, 1.6, 0]} />
                    <BarChairs position={[3.5, -1, 0]} rotation={[0, 1.6, 0]} />
                    <BarChairs position={[3.5, -1, -1.9]} rotation={[0, 4.7, 0]} />
                    <BarChairs position={[4.5, -1, -1.9]} rotation={[0, 4.7, 0]} />
                    <BarChairs position={[2.5, -1, -1]} rotation={[0, 0, 0]} />

                    <Microwave />

                    <TennisTable position={[-3, -1, -2.5]} rotation={[0, 1.57, 0]} />

                    <TV />

                    <Fridge />

                    <CoffeTable />

                    <CoffeeMachine />

                    <SmallPlant />

                    <BookCase />

                    <WallArt />

                    <WallDecor />

                    <MetalWallArt />

                    <Player />


                    <NPC />

                    {/* <MissionNPCWrapper /> */}

                    <ResponsibilityMission />

                    <group>
                        <Room2Floor widthSize={10} heightSize={10} />
                        <mesh position={[0, 0.5, -5]} receiveShadow>
                            <boxGeometry args={[10, 3, 0.2]} />
                            <meshStandardMaterial color="#faeedd" roughness={0.4} />
                        </mesh>

                        <mesh position={[0, 0.5, 5]} receiveShadow>
                            <boxGeometry args={[10, 3, 0.2]} />
                            <meshStandardMaterial color="#faeedd" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[0, Math.PI / 2, 0]} position={[5, 0.5, 0]} receiveShadow>
                            <boxGeometry args={[10, 3, 0.2]} />
                            <meshStandardMaterial color="#faeedd" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[0, Math.PI / 2, 0]} position={[-5, 0.5, 0]} receiveShadow>
                            <boxGeometry args={[10, 3, 0.2]} />
                            <meshStandardMaterial color="#faeedd" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshStandardMaterial color={'#7b746f'} />
                        </mesh>
                    </group>
                </Suspense>
            </Canvas>
        </div>
    )
}