'use client'

import DoorInteraction from "@/app/entities/functions/doorFunc"
import LoadingScreen from "@/app/entities/functions/loading"
import TransparencyMission, { TransparencyMissionUI } from "@/app/entities/functions/missions/room3/bin-mission"
import Door from "@/app/entities/objects/door"
import Player from "@/app/entities/objects/player"
import Bin from "@/app/entities/room3/bin"
import Bookcase from "@/app/entities/room3/bookcase"
import CoffeeTable from "@/app/entities/room3/coffetable"
import ConferenceChair from "@/app/entities/room3/conferencechair"
import ConferenceTable from "@/app/entities/room3/conferencetable"
import EmtyBookcase from "@/app/entities/room3/emptybookcase"
import Haworthia from "@/app/entities/room3/haworthia"
import MacBook from "@/app/entities/room3/macbook"
import MagazinesHolder from "@/app/entities/room3/madazinesholder"
import OfficePaper from "@/app/entities/room3/officepeper"
import PenOrganizer from "@/app/entities/room3/penorganiser"
import Plant from "@/app/entities/room3/plant"
import Sofa from "@/app/entities/room3/sofa"
import Clock from "@/app/entities/room3/wall-clock"
import WallDecoration from "@/app/entities/room3/walldecorations"
import WallMountedTv from "@/app/entities/room3/walltv"
import WaterCooler from "@/app/entities/room3/watercooler"
import FloorTexture from "@/app/entities/textures/floortexture"
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
    const isInitialized = useRef(false)
    const cursorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const baseOffset = new THREE.Vector3(1, 1, -2)

    const roomBounds = {
        minX: -2.9,
        maxX: 2.9,
        minY: 0.5,
        maxY: 3,
        minZ: -2.9,
        maxZ: 2.9
    }

    const mouseSensitivity = 0.006

    useEffect(() => {
        cursorTimeoutRef.current = setTimeout(() => {
            document.body.style.cursor = 'none'
        }, 2000)

        const initTimeout = setTimeout(() => {
            if (player && !isInitialized.current) {
                const initialPosition = new THREE.Vector3()
                const lookAt = new THREE.Vector3()

                const spherical = new THREE.Spherical()
                spherical.radius = baseOffset.length()
                spherical.theta = Math.PI
                spherical.phi = Math.PI / 2

                const offset = new THREE.Vector3()
                offset.setFromSpherical(spherical)

                initialPosition.copy(player.position).add(offset)
                lookAt.copy(player.position)

                initialPosition.x = THREE.MathUtils.clamp(initialPosition.x, roomBounds.minX, roomBounds.maxX)
                initialPosition.y = THREE.MathUtils.clamp(initialPosition.y, roomBounds.minY, roomBounds.maxY)
                initialPosition.z = THREE.MathUtils.clamp(initialPosition.z, roomBounds.minZ, roomBounds.maxZ)

                lookAt.x = THREE.MathUtils.clamp(lookAt.x, roomBounds.minX + 0.5, roomBounds.maxX - 0.5)
                lookAt.z = THREE.MathUtils.clamp(lookAt.z, roomBounds.minZ + 0.5, roomBounds.maxZ - 0.5)

                camera.position.copy(initialPosition)
                camera.lookAt(lookAt)

                cameraPosition.current.copy(initialPosition)
                cameraLookAt.current.copy(lookAt)

                isInitialized.current = true
            }
        }, 100)

        const handleMouseMove = (event: MouseEvent) => {
            if (!player) return

            mouseRotation.current.x += event.movementX * mouseSensitivity
            mouseRotation.current.y += event.movementY * mouseSensitivity

            mouseRotation.current.y = Math.max(-0.8, Math.min(0.8, mouseRotation.current.y))
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            if (cursorTimeoutRef.current) {
                clearTimeout(cursorTimeoutRef.current)
            }
            clearTimeout(initTimeout)
            window.removeEventListener('mousemove', handleMouseMove)
            document.body.style.cursor = 'default'
        }
    }, [player, camera])

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

        if (!isInitialized.current) {
            cameraPosition.current.copy(targetPosition)
            cameraLookAt.current.copy(lookAtTarget)
            camera.position.copy(targetPosition)
            camera.lookAt(lookAtTarget)
            isInitialized.current = true
        } else {
            cameraPosition.current.lerp(targetPosition, 5 * delta)
            cameraLookAt.current.lerp(lookAtTarget, 5 * delta)

            camera.position.copy(cameraPosition.current)
            camera.lookAt(cameraLookAt.current)
        }
    })

    return null
}

function PlayerController() {
    const { scene } = useThree()

    const boundsPlayer = {
        minX: -2.9,
        maxX: 2.9,
        minY: 0.5,
        maxY: 3,
        minZ: -2.9,
        maxZ: 2.9
    }

    const furnitureColliders = [
        { position: [-3.4, 0], rotation: [0, 1.55, 0], radius: 1, name: 'sofa' },
        { position: [2, 1], rotation: [0, 1, 0], radius: 1, name: 'conferencetable' },
        { position: [0.43, 1], rotation: [0, 0, 0], radius: 1, name: 'conferencetable2' },
        { position: [3.4, -2,], rotation: [0, 0, 0], radius: 0.5, name: 'emptybookcase' },
        { position: [-3.23, -2.6,], rotation: [0, 0, 0], radius: 0.5, name: 'cooler' },
        { position: [-3.05, -1.57,], rotation: [0, 0, 0], radius: 0.5, name: 'coffetable' },
        { position: [-3.28, 2.45,], rotation: [0, 0, 0], radius: 0.5, name: 'bookcase' },
        { position: [3.1, -1.3,], rotation: [0, 0, 0], radius: 0.5, name: 'bin' },

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

export default function ThirdRoom() {
    const router = useRouter()

    function handleDoorClick() {
        router.push('/pages/start?spawn=door')
    }

    const doorPosition = [
        {
            position: [0, -1, -3.4] as [number, number, number],
            onInteract: handleDoorClick
        }
    ]
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <LoadingScreen />
            <TransparencyMissionUI />
            <Canvas>
                <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <directionalLight
                        position={[7, 7, 3.5]}
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

                    <Door position={[0, -1, -3.4]} scale={0.01} onDoorClick={handleDoorClick} />
                    <DoorInteraction doorPositions={doorPosition} />

                    <Sofa />

                    <ConferenceTable />

                    <MacBook />

                    <EmtyBookcase />

                    <MagazinesHolder />

                    <OfficePaper />

                    <PenOrganizer />

                    <Plant />

                    <Haworthia />

                    <WallDecoration />

                    <Clock position={[0, 0.7, 3.3]} rotation={[0, -3.1, 0]} />

                    <Player />

                    <TransparencyMission />

                    <ConferenceChair position={[0, -1, 0.4]} rotation={[0, 0, 0]} />
                    <ConferenceChair position={[3, -1, 0.4]} rotation={[0, 0, 0]} />
                    <ConferenceChair position={[1.5, -1, 0.4]} rotation={[0, 0, 0]} />
                    <ConferenceChair position={[1.5, -1, 2.65]} rotation={[0, 3.1, 0]} />
                    <ConferenceChair position={[0, -1, 2.65]} rotation={[0, 3.1, 0]} />
                    <ConferenceChair position={[3, -1, 2.65]} rotation={[0, 3.1, 0]} />

                    <WallMountedTv />

                    <Bookcase />

                    <WaterCooler />

                    <CoffeeTable />

                    <Bin />

                    <group>
                        <FloorTexture widthSize={7} heightSize={7} />
                        <mesh position={[0, 0.5, -3.5]} receiveShadow>
                            <boxGeometry args={[7, 3, 0.2]} />
                            <meshStandardMaterial color="#585e89" roughness={0.4} />
                        </mesh>

                        <mesh position={[0, 0.5, 3.5]} receiveShadow>
                            <boxGeometry args={[7, 3, 0.2]} />
                            <meshStandardMaterial color="#585e89" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[0, Math.PI / 2, 0]} position={[3.5, 0.5, 0]} receiveShadow>
                            <boxGeometry args={[7, 3, 0.2]} />
                            <meshStandardMaterial color="#585e89" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[0, Math.PI / 2, 0]} position={[-3.5, 0.5, 0]} receiveShadow>
                            <boxGeometry args={[7, 3, 0.2]} />
                            <meshStandardMaterial color="#585e89" roughness={0.4} />
                        </mesh>

                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2, 0]}>
                            <planeGeometry args={[7, 7]} />
                            <meshStandardMaterial color={'#282f48'} />
                        </mesh>
                    </group>
                </Suspense>
            </Canvas>
        </div>
    )
}