import { useGLTF } from "@react-three/drei";

export default function ConsoleTable() {
    const { scene } = useGLTF('/models/room2/console_table.glb')
    return (
        <primitive
            object={scene}
            position={[4, -0.5, -1]}
            rotation={[0, 1.6, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/console_table.glb')