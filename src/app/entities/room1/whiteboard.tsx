import { useGLTF } from "@react-three/drei";

export default function Whiteboard() {
    const { scene } = useGLTF('/models/room1/low_poly_whiteboard.glb')

    return (
        <primitive
            object={scene}
            position={[-3.5, -0.87, -3]}
            rotation={[0, 2.5, 0]}
            scale={0.7}
        />
    )
}

useGLTF.preload('/models/room1/low_poly_whiteboard.glb')