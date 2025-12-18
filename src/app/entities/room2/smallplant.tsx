import { useGLTF } from "@react-three/drei";

export default function SmallPlant() {
    const { scene } = useGLTF('/models/room2/haworthia_zebra_plant.glb')

    return (
        <primitive
            object={scene}
            position={[2.8, 0, 2]}
            rotation={[0, 0, 0]}
            scale={3}
        />
    )
}

useGLTF.preload('/models/room2/haworthia_zebra_plant.glb')