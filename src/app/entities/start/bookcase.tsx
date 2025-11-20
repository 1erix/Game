import { useGLTF } from "@react-three/drei";

export default function Bookcase() {
    const { scene } = useGLTF('/models/bookcase.glb')

    return (
        <primitive object={scene}
            position={[-3.01, -1, -1]}
            rotation={[0, 7.84, 0]}
            scale={1} />
    )
}

useGLTF.preload('/models/bookcase.glb')