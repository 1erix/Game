import { useGLTF } from "@react-three/drei";

export default function Books_and_Magazines() {
    const { scene } = useGLTF('/models/books_and_magazines.glb')

    return (
        <primitive
            object={scene}
            position={[0.5, -0.7, 2]}
            rotation={[0, 0, 0]}
            scale={0.02}
        />
    )
}

useGLTF.preload('/models/books_and_magazines.glb')