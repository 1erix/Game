import { useGLTF } from "@react-three/drei";

export default function WallDecor() {
    const { scene } = useGLTF('/models/room2/wall_decoration_picture.glb')

    return (
        <primitive
            object={scene}
            position={[-3, 0.5, -4.87]}
            rotation={[0, -1.57, 0]}
            scale={1}
        />
    )
}

useGLTF.preload('/models/room2/wall_decoration_picture.glb')