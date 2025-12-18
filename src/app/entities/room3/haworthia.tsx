import { useGLTF } from "@react-three/drei";

export default function Haworthia() {
    const { scene } = useGLTF('/models/room3/lowpoly_haworthia_plant.glb')
    return (
        <primitive
            object={scene}
            position={[3.3, 0.91, -1.8]}
            rotation={[0, -1.5, 0]}
            scale={0.5}
        />
    )
}

useGLTF.preload('/models/room3/lowpoly_haworthia_plant.glb')