import { useGLTF } from "@react-three/drei";

export default function Fridge() {
    const { scene } = useGLTF('/models/room2/modern_fridge.glb')
    return (
        <primitive
            object={scene}
            position={[4, 0, 4.5]}
            rotation={[0, -1.55, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/modern_fridge.glb')