import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from 'three'

export default function Armchair({ position, scale, rotation }:
    {
        position: [number, number, number],
        scale: number,
        rotation: [number, number, number]
    }) {
    const { scene } = useGLTF('/models/armchair.glb')
    const meshRef = useRef<THREE.Mesh>(null)

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            rotation={rotation}
        >
            <primitive object={scene.clone()} />
        </mesh>
    )
}

useGLTF.preload('/models/armchair.glb')