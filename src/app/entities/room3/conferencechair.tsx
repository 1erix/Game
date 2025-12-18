import { useGLTF } from "@react-three/drei";

export default function ConferenceChair({ position, rotation }:
    {
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { scene } = useGLTF('/models/room3/low_poly_conference_room_chair.glb')
    return (
        <primitive
            object={scene.clone()}
            position={position}
            rotation={rotation}
            scale={0.07}
        />
    )
}

useGLTF.preload('/models/room3/low_poly_conference_room_chair.glb')