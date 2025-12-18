import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from 'three'

export default function OfficeTable({ position, rotation }:
    {
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { scene } = useGLTF('/models/room1/industiral_wooden_table_with_metal_legs.glb')
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

useGLTF.preload('/models/room1/industiral_wooden_table_with_metal_legs.glb')