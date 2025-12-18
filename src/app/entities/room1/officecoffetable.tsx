import { useGLTF } from "@react-three/drei";

export default function OfficeCoffeTable() {
    const { scene } = useGLTF('/models/room1/coffe_table.glb')

    return (
        <primitive
            object={scene}
            position={[2.6, -1, -2.4]}
            rotation={[0, 0, 0]}
            scale={0.2}
        />
    )
}

useGLTF.preload('/models/room1/coffe_table.glb')