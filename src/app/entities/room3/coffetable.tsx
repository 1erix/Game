import { useGLTF } from "@react-three/drei";

export default function CoffeeTable() {
    const { scene } = useGLTF('/models/room3/side_table.glb')
    return (
        <primitive
            object={scene}
            position={[-3.04, -1, -1.55]}
            rotation={[0, 0, 0]}
            scale={1.5}
        />
    )
}

useGLTF.preload('/models/room3/side_table.glb')