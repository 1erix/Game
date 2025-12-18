import { useGLTF } from "@react-three/drei";

export default function EmtyBookcase() {
    const { scene } = useGLTF('/models/room3/estante_-_bookcase.glb')
    return (
        <primitive
            object={scene}
            position={[2.9, 0, -2]}
            rotation={[0, -1.59, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/estante_-_bookcase.glb')