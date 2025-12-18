import { useGLTF } from "@react-three/drei";

export default function MagazinesHolder() {
    const { scene } = useGLTF('/models/room3/office_decor_holder_magazine.glb')
    return (
        <primitive
            object={scene}
            position={[3.3, 0.1, -2.2]}
            rotation={[0, -1.5, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room3/office_decor_holder_magazine.glb')