import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

export default function Player() {

    const group = useRef<THREE.Mesh>(null)
    const { scene, animations } = useGLTF('/models/redhead_rock_girl.glb')
    const { actions } = useAnimations(animations, group)
    const [animation, setAnimation] = useState('idle')

    const { camera } = useThree()
    const cameraOffset = useRef(new THREE.Vector3(0, 2, 5))

    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        right: false,
        left: false
    })

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: true })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: true })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: true })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: true })); break
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: false })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: false })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: false })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: false })); break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useFrame((state, delta) => {
        if (!group.current) return

        const speed = 1
        const rotationSpeed = 5

        const moveDirection = new THREE.Vector3()

        if (movement.forward) moveDirection.z -= 1
        if (movement.backward) moveDirection.z += 1
        if (movement.right) moveDirection.x += 1
        if (movement.left) moveDirection.x -= 1

        moveDirection.normalize()
        moveDirection.multiplyScalar(speed * delta)

        if (moveDirection.length() > 0) {
            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z)
            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                targetRotation,
                rotationSpeed * delta
            )
        }

        group.current.position.x += moveDirection.x
        group.current.position.z += moveDirection.z

        const isMoving = moveDirection.length() > 0

        if (isMoving) {
            if (animation !== 'Skeleton|WalkLoop') {
                setAnimation('Skeleton|WalkLoop')
            }
        } else {
            if (animation !== 'None') {
                Object.values(actions).forEach(action => action?.stop())
                setAnimation('None')
            }
        }

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(group.current.position).add(cameraOffset.current)

        camera.position.lerp(cameraPosition, 0 * delta)
        camera.lookAt(group.current.position)
    })

    useEffect(() => {
        if (actions[animation]) {
            Object.values(actions).forEach(action => action?.stop())
            actions[animation]?.play()
        }

    }, [animation, actions])

    return (
        <group ref={group} name="player">
            <primitive
                object={scene}
                position={[0, -1, 0]}
                rotation={[0, 0, 0]}
                scale={0.8}
            />
        </group>
    )
}

useGLTF.preload('/models/redhead_rock_girl.glb')