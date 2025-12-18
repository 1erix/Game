import { useGLTF } from "@react-three/drei";

export default function Plant() {
    const { scene } = useGLTF('/models/room3/majesty_palm_plant.glb')
    return (
        <primitive
            object={scene}
            position={[-3.3, -0.1, -1.5]}
            rotation={[0, -1.5, 0]}
            scale={0.6}
        />
    )
}

useGLTF.preload('/models/room3/majesty_palm_plant.glb')