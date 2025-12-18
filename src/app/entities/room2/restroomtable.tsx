import { useGLTF } from "@react-three/drei";

export default function CoffeTable() {
    const { scene } = useGLTF('/models/room2/kameko_coffee_table.glb')

    return (
        <primitive
            object={scene}
            position={[-3, -0.99, 3]}
            rotation={[0, 0, 0]}
            scale={0.01}
        />
    )
}

useGLTF.preload('/models/room2/kameko_coffee_table.glb')