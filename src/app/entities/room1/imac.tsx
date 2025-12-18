import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from 'three'

export default function Imac({ position, rotation }: {
    position: [number, number, number],
    rotation: [number, number, number]
}
) {
    const { scene } = useGLTF('/models/room1/apple_imac_27_retina.glb')
    const meshRef = useRef<THREE.Mesh>(null)

    return (
        <primitive
            ref={meshRef}
            object={scene.clone()}
            position={position}
            rotation={rotation}
            scale={0.001}
        />
    )
}

useGLTF.preload('/models/room1/apple_imac_27_retina.glb')