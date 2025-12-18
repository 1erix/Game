import { useGLTF } from "@react-three/drei";

export default function BookCase() {
    const { scene } = useGLTF('/models/room2/open_back_bookcase.glb')

    return (
        <primitive
            object={scene}
            position={[3.5, -1, -4.55]}
            rotation={[0, 1.58, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/open_back_bookcase.glb')