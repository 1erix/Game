import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from 'three'

export default function OfficeChair({ position, rotation }:
    {
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { scene } = useGLTF('/models/room1/office_chair.glb')
    const meshRef = useRef<THREE.Mesh>(null)

    return (
        <primitive
            ref={meshRef}
            object={scene.clone()}
            position={position}
            rotation={rotation}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room1/office_chair.glb')