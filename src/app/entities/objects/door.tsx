import { useGLTF } from "@react-three/drei"
import { useRef, useState } from "react"
import * as THREE from 'three'

export default function Door({ position,
    scale, onDoorClick }: {
        position: [number, number, number],
        scale: number,
        onDoorClick: () => void
    }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    const { scene } = useGLTF('/models/door.glb')

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            onClick={onDoorClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <primitive object={scene.clone()} />
        </mesh>
    )
}

useGLTF.preload('/models/door.glb')