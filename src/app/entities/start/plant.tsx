import { useGLTF } from "@react-three/drei";

export default function Plant() {
    const { scene } = useGLTF('/models/plant.glb')

    return (
        <primitive
            object={scene}
            position={[-2.8, -1, 1.8]}
            rotation={[0, 0, 0]}
            scale={0.5}
        />
    )
}

useGLTF.preload('/models/plant.glb')