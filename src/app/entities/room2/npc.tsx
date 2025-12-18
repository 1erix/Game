// app/entities/room2/NPC.tsx
'use client'

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { getNPCPosition, getNPCRotation } from "../functions/missions/room2/npc-mission";

export default function NPC() {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/models/room2/puppet_kid_free_demo.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        const idleAnimation = actions['Idle']
        if (idleAnimation) {
            idleAnimation.play()
        }

        return () => {
            Object.values(actions).forEach(action => action?.stop())
        }
    }, [actions]);

    // Получаем позицию и поворот из миссии (Y=0 для уровня пола)
    const position = getNPCPosition();
    const rotation = getNPCRotation();

    return (
        <group ref={group} name="npc">
            <primitive
                object={scene}
                position={[position.x, position.y, position.z]}
                rotation={[rotation[0], rotation[1], rotation[2]]}
                scale={0.7}
            />
        </group>
    );
}

useGLTF.preload('/models/room2/puppet_kid_free_demo.glb');