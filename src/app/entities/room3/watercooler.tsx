import { useGLTF } from "@react-three/drei";

export default function WaterCooler() {
    const { scene } = useGLTF('/models/room3/water_cooler.glb')
    return (
        <primitive
            object={scene}
            position={[-3.2, -1, -2.6]}
            rotation={[0, 1.55, 0]}
            scale={0.015}
        />
    )
}

useGLTF.preload('/models/room3/water_cooler.glb')