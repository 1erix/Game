import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

export default function Player() {
    const group = useRef<THREE.Group>(null)
    const { scene, animations } = useGLTF('/models/lowpoly_toon_characters_free_demo__animations.glb')
    const { actions } = useAnimations(animations, group)
    const [animation, setAnimation] = useState('Idle')

    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        right: false,
        left: false,
        run: false,
        jump: false
    })

    const jumpState = useRef({
        isJumping: false,
        velocity: 0,
        startY: -1
    })

    const jumpHeight = 0.5
    const gravity = 9.8
    const floorY = -1
    const ceilingY = 1.5

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: true })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: true })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: true })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: true })); break
                case 'ShiftLeft': setMovement(prev => ({ ...prev, run: true })); break
                case 'Space':
                    if (!jumpState.current.isJumping && group.current) {
                        const currentY = group.current.position.y
                        if (currentY <= floorY + 0.1) {
                            setMovement(prev => ({ ...prev, jump: true }))
                            jumpState.current.isJumping = true
                            jumpState.current.velocity = Math.sqrt(2 * gravity * jumpHeight)
                            jumpState.current.startY = currentY
                        }
                    }
                    break
            }
        }

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'KeyW': setMovement(prev => ({ ...prev, forward: false })); break
                case 'KeyS': setMovement(prev => ({ ...prev, backward: false })); break
                case 'KeyD': setMovement(prev => ({ ...prev, right: false })); break
                case 'KeyA': setMovement(prev => ({ ...prev, left: false })); break
                case 'ShiftLeft': setMovement(prev => ({ ...prev, run: false })); break
                case 'Space': setMovement(prev => ({ ...prev, jump: false })); break
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

        const baseSpeed = 1
        const runSpeedMultiplier = 2
        const rotationSpeed = 5
        const deltaTime = Math.min(delta, 0.05)

        if (jumpState.current.isJumping && group.current) {
            jumpState.current.velocity -= gravity * deltaTime
            const newY = group.current.position.y + jumpState.current.velocity * deltaTime

            if (newY > jumpState.current.startY + ceilingY) {
                group.current.position.y = jumpState.current.startY + ceilingY
                jumpState.current.velocity = 0
            } else if (newY <= floorY) {
                group.current.position.y = floorY
                jumpState.current.isJumping = false
                jumpState.current.velocity = 0
                setMovement(prev => ({ ...prev, jump: false }))
            } else {
                group.current.position.y = newY
            }
        }

        const currentSpeed = movement.run ? baseSpeed * runSpeedMultiplier : baseSpeed
        const moveDirection = new THREE.Vector3()

        if (movement.forward) moveDirection.z -= 1
        if (movement.backward) moveDirection.z += 1
        if (movement.right) moveDirection.x += 1
        if (movement.left) moveDirection.x -= 1

        moveDirection.normalize()
        moveDirection.multiplyScalar(currentSpeed * deltaTime)

        let newAnimation = 'Idle'

        if (jumpState.current.isJumping) {
            newAnimation = 'Jump'
        } else if (moveDirection.length() > 0) {
            newAnimation = movement.run ? 'Run' : 'Walk'
        }

        if (moveDirection.length() > 0) {
            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z)
            group.current.rotation.y = THREE.MathUtils.lerp(
                group.current.rotation.y,
                targetRotation,
                rotationSpeed * deltaTime
            )
        }

        if (!jumpState.current.isJumping || moveDirection.length() > 0) {
            group.current.position.x += moveDirection.x
            group.current.position.z += moveDirection.z
        }

        if (newAnimation !== animation) {
            setAnimation(newAnimation)
        }
    })

    useEffect(() => {
        const currentAction = actions[animation]

        if (currentAction) {
            Object.values(actions).forEach(action => {
                if (action && action !== currentAction) {
                    action.stop()
                }
            })

            const action = actions[animation]
            if (action) {
                action.reset()

                if (animation === 'Run') {
                    action.setEffectiveTimeScale(1.5)
                } else if (animation === 'Walk') {
                    action.setEffectiveTimeScale(1.0)
                } else if (animation === 'Jump') {
                    action.setEffectiveTimeScale(1.2)
                    action.clampWhenFinished = true
                    action.setLoop(THREE.LoopOnce, 1)
                } else {
                    action.setEffectiveTimeScale(1.0)
                    action.setLoop(THREE.LoopRepeat, Infinity)
                }

                action.play()
            }
        }
    }, [animation, actions])

    return (
        <group ref={group} name="player">
            <primitive
                object={scene}
                position={[0, -1, 0]}
                rotation={[0, 0, 0]}
                scale={0.5}
            />
        </group>
    )
}

useGLTF.preload('/models/lowpoly_toon_characters_free_demo__animations.glb')