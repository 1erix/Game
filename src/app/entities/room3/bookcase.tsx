import { useGLTF } from "@react-three/drei";

export default function Bookcase() {
    const { scene } = useGLTF('/models/room3/bookcase.glb')
    return (
        <primitive
            object={scene}
            position={[-3.2, -1, 2.5]}
            rotation={[0, 0, 0]}
            scale={0.25}
        />
    )
}

useGLTF.preload('/models/room3/bookcase.glb')