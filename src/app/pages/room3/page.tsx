'use client'

import DoorInteraction from "@/app/entities/functions/doorFunc"
import HideCursor from "@/app/entities/functions/hideCursor"
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
import { Suspense, useRef } from "react"
import * as THREE from 'three'

function applyCameraConstraints(camera: THREE.Camera, cameraPosition: THREE.Vector3, playerPosition: THREE.Vector3): THREE.Vector3 {
    const wallOffset = 0.8

    const roomBounds = {
        minX: -3.5 + wallOffset,
        maxX: 3.5 - wallOffset,
        minY: 0.8,
        maxY: 2.2,
        minZ: -3.5 + wallOffset,
        maxZ: 3.5 - wallOffset
    }

    const lookAtTarget = playerPosition.clone().add(new THREE.Vector3(0, 0.8, 0))

    const constrainedPosition = cameraPosition.clone()

    constrainedPosition.x = THREE.MathUtils.clamp(
        constrainedPosition.x,
        roomBounds.minX,
        roomBounds.maxX
    )

    constrainedPosition.y = THREE.MathUtils.clamp(
        constrainedPosition.y,
        roomBounds.minY,
        roomBounds.maxY
    )

    constrainedPosition.z = THREE.MathUtils.clamp(
        constrainedPosition.z,
        roomBounds.minZ,
        roomBounds.maxZ
    )

    camera.position.copy(constrainedPosition)
    camera.lookAt(lookAtTarget)

    return constrainedPosition
}

function CameraController() {
    const { camera, scene } = useThree()
    const cameraPosition = useRef(new THREE.Vector3(0, 0.8, -2.5))

    const horizontalOffset = useRef(new THREE.Vector3(0, 0, -2.5))

    useFrame(() => {
        const player = scene.getObjectByName('player')
        if (!player) return

        const playerRotationY = player.rotation.y

        const rotatedHorizontalOffset = horizontalOffset.current.clone().applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            playerRotationY
        )

        const targetCameraPosition = player.position.clone()
            .add(rotatedHorizontalOffset)
            .add(new THREE.Vector3(0, 0.8, 0))

        cameraPosition.current.lerp(targetCameraPosition, 0.1)

        applyCameraConstraints(camera, cameraPosition.current, player.position)
    })

    return null
}

function PlayerController() {
    const { scene } = useThree()

    const boundsPlayer = {
        minX: -2.9,
        maxX: 2.9,
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
            <Canvas camera={{ position: [0, 0.8, -2.5], fov: 65 }}>
                <Suspense fallback={null}>
                    <CameraController />
                    <PlayerController />
                    <HideCursor />

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