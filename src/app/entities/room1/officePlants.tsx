import { useGLTF } from "@react-three/drei";

export default function OfficePlants() {
    const { scene } = useGLTF('/models/room1/indoor_plants.glb')

    return (
        <primitive
            object={scene}
            position={[-4.7, -1, 4]}
            rotation={[0, 1.5, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room1/indoor_plants.glb')