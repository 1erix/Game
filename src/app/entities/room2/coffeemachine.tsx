import { useGLTF } from "@react-three/drei";

export default function CoffeeMachine() {
    const { scene } = useGLTF('/models/room2/coffee_machine_free_model__high_poly.glb')

    return (
        <primitive
            object={scene}
            position={[0.5, -0.1, 4.3]}
            rotation={[0, 3.16, 0]}
            scale={0.5}
        />
    )
}

useGLTF.preload('/models/room2/coffee_machine_free_model__high_poly.glb')