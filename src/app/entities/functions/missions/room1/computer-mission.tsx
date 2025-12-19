'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

const speedMissionGlobal = {
    showHint: false,
    gameActive: false,
    missionComplete: false,
    timeLeft: 30,
    score: 0,
    gameOver: false,
    countdown: null as number | null,
    speedMultiplier: 1,
    isInteractable: false,
    showSuccessModal: false,
    hasBeenCompletedInSession: false
}

function SpeedMissionIcon({ position, completed = false, visible = true }: {
    position: [number, number, number],
    completed?: boolean,
    visible?: boolean
}) {
    if (!visible) return null

    return (
        <Html
            position={position}
            center
            style={{
                pointerEvents: 'none',
                userSelect: 'none',
                transform: 'translate(-50%, -50%)'
            }}
            occlude={false}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translate(-50%, -50%)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: completed
                        ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                        : 'linear-gradient(135deg, #ff9900, #ff6600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: completed
                        ? '0 8px 20px rgba(46, 204, 113, 0.4)'
                        : '0 8px 20px rgba(255, 153, 0, 0.4)',
                    border: completed
                        ? '2px solid #2ecc71'
                        : '2px solid #ff9900',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {completed ? (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                            >
                                <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8V12" strokeLinecap="round" />
                                <path d="M12 16H12.01" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>

                    {!completed && !speedMissionGlobal.gameActive && speedMissionGlobal.isInteractable && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: '12px',
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            animation: 'pulse 2s infinite'
                        }} />
                    )}
                </div>

                <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: completed ? '#2ecc71' : '#ff9900',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                }}>
                    {completed ? 'ВЫПОЛНЕНО' : 'ЗАДАНИЕ'}
                </div>

                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.05); opacity: 0.2; }
                        100% { transform: scale(1); opacity: 0.5; }
                    }
                `}</style>
            </div>
        </Html>
    )
}

export default function ComputerSpeedMission({
    position = [0, -0.4, 0],
    rotation = [0, 0, 0]
}: {
    position?: [number, number, number],
    rotation?: [number, number, number]
}) {
    const { camera, scene } = useThree()
    const computerRef = useRef<THREE.Group>(null)
    const playerRef = useRef<THREE.Object3D | null>(null)

    const cameraLocked = useRef(false)
    const originalCameraPosition = useRef<THREE.Vector3 | null>(null)
    const originalCameraRotation = useRef<THREE.Euler | null>(null)

    const gameInterval = useRef<NodeJS.Timeout | null>(null)
    const countdownInterval = useRef<NodeJS.Timeout | null>(null)
    const [folders, setFolders] = useState<Array<{
        id: number
        type: 'urgent' | 'client' | 'spam'
        color: string
        position: { x: number; y: number }
        velocity: { x: number; y: number }
    }>>([])

    const [localState, setLocalState] = useState({
        showIcon: true,
        isInteractable: false,
        iconCompleted: false
    })

    useEffect(() => {
        console.log('Инициализация миссии скорости')

        speedMissionGlobal.missionComplete = false
        speedMissionGlobal.hasBeenCompletedInSession = false
        speedMissionGlobal.showSuccessModal = false
        speedMissionGlobal.gameOver = false
        speedMissionGlobal.gameActive = false
        speedMissionGlobal.score = 0

        setLocalState(prev => ({
            ...prev,
            iconCompleted: false
        }))

        const player = scene.getObjectByName('player')
        if (player) {
            playerRef.current = player
        }

        return () => {
            if (gameInterval.current) clearInterval(gameInterval.current)
            if (countdownInterval.current) clearInterval(countdownInterval.current)
            unlockCamera()
        }
    }, [scene])

    useFrame(() => {
        if (computerRef.current && playerRef.current && !speedMissionGlobal.gameActive) {
            const distance = playerRef.current.position.distanceTo(computerRef.current.position)
            const isInteractable = distance < 1.5

            if (isInteractable !== speedMissionGlobal.isInteractable) {
                speedMissionGlobal.isInteractable = isInteractable
                setLocalState(prev => ({ ...prev, isInteractable }))
            }
        }
    })

    const createFolder = () => {
        const types: ('urgent' | 'client' | 'spam')[] = ['urgent', 'client', 'spam']
        const type = types[Math.floor(Math.random() * types.length)]

        return {
            id: Date.now() + Math.random(),
            type,
            color: type === 'urgent' ? '#e74c3c' : type === 'client' ? '#2ecc71' : '#3498db',
            position: {
                x: Math.random() * 600 - 300,
                y: Math.random() * 400 - 200
            },
            velocity: {
                x: (Math.random() - 0.5) * 4 * speedMissionGlobal.speedMultiplier,
                y: (Math.random() - 0.5) * 4 * speedMissionGlobal.speedMultiplier
            }
        }
    }

    const initializeFolders = (count: number = 10) => {
        const newFolders = []
        for (let i = 0; i < count; i++) {
            newFolders.push(createFolder())
        }
        setFolders(newFolders)
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            if ((key === 'f' || key === 'а') &&
                speedMissionGlobal.isInteractable &&
                !speedMissionGlobal.gameActive &&
                !speedMissionGlobal.missionComplete &&
                !speedMissionGlobal.gameOver) {
                startGame()
            }

            if (key === 'escape' && speedMissionGlobal.gameActive) {
                endGame(false)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    const lockCamera = () => {
        console.log('Фиксация камеры для миссии скорости')
        cameraLocked.current = true

        originalCameraPosition.current = camera.position.clone()
        originalCameraRotation.current = camera.rotation.clone()

        document.body.style.cursor = 'default'

        const canvas = document.querySelector('canvas')
        if (canvas) {
            canvas.style.pointerEvents = 'none'
        }
    }

    const unlockCamera = () => {
        console.log('Разблокировка камеры')
        cameraLocked.current = false

        document.body.style.cursor = 'none'

        const canvas = document.querySelector('canvas')
        if (canvas) {
            canvas.style.pointerEvents = 'auto'
        }
    }

    useFrame((state) => {
        if (cameraLocked.current && originalCameraPosition.current && originalCameraRotation.current) {
            camera.position.copy(originalCameraPosition.current)
            camera.rotation.copy(originalCameraRotation.current)

            state.camera.updateMatrixWorld()
        }
    })

    const startGame = () => {
        console.log('Запуск игры "Скорость"')

        lockCamera()

        speedMissionGlobal.gameActive = true
        speedMissionGlobal.gameOver = false
        speedMissionGlobal.score = 0
        speedMissionGlobal.timeLeft = 30
        speedMissionGlobal.speedMultiplier = 1
        speedMissionGlobal.countdown = 3
        speedMissionGlobal.showSuccessModal = false

        let countdown = 3
        speedMissionGlobal.countdown = countdown

        countdownInterval.current = setInterval(() => {
            countdown--
            speedMissionGlobal.countdown = countdown

            if (countdown <= 0) {
                if (countdownInterval.current) {
                    clearInterval(countdownInterval.current)
                }
                speedMissionGlobal.countdown = null
                initializeFolders()
                startGameTimer()
            }
        }, 1000)
    }

    const startGameTimer = () => {
        let timeLeft = 30
        speedMissionGlobal.timeLeft = timeLeft

        gameInterval.current = setInterval(() => {
            timeLeft--
            speedMissionGlobal.timeLeft = timeLeft

            if (timeLeft === 15) {
                speedMissionGlobal.speedMultiplier = 1.8
                setFolders(prev => prev.map(folder => ({
                    ...folder,
                    velocity: {
                        x: folder.velocity.x * 1.8,
                        y: folder.velocity.y * 1.8
                    }
                })))
            }

            setFolders(prev => prev.map(folder => {
                let newX = folder.position.x + folder.velocity.x
                let newY = folder.position.y + folder.velocity.y

                if (newX < -300 || newX > 300) {
                    folder.velocity.x *= -1
                    newX = folder.position.x
                }
                if (newY < -200 || newY > 200) {
                    folder.velocity.y *= -1
                    newY = folder.position.y
                }

                return {
                    ...folder,
                    position: { x: newX, y: newY }
                }
            }))

            if (timeLeft <= 0) {
                endGame(true)
            }
        }, 1000)
    }

    const handleFolderClick = (folderId: number, type: string) => {
        if (!speedMissionGlobal.gameActive || speedMissionGlobal.countdown !== null) return

        if (type === 'spam') {
            endGame(false)
            return
        }

        speedMissionGlobal.score++

        setFolders(prev => prev.filter(f => f.id !== folderId))

        setTimeout(() => {
            setFolders(prev => [...prev, createFolder()])
        }, 100)
    }

    const endGame = (success: boolean) => {
        console.log(success ? 'Игра завершена успешно!' : 'Игра провалена')

        if (gameInterval.current) clearInterval(gameInterval.current)
        if (countdownInterval.current) clearInterval(countdownInterval.current)

        unlockCamera()

        speedMissionGlobal.gameActive = false

        if (success) {
            speedMissionGlobal.missionComplete = true
            speedMissionGlobal.hasBeenCompletedInSession = true
            speedMissionGlobal.gameOver = false
            speedMissionGlobal.showSuccessModal = true

            setLocalState(prev => ({
                ...prev,
                iconCompleted: true
            }))

            console.log('Миссия "computer-speed-mission" отмечена как выполненная')
        } else {
            speedMissionGlobal.gameOver = true
            speedMissionGlobal.missionComplete = false
            speedMissionGlobal.showSuccessModal = false
        }

        setFolders([])
    }

    const iconPosition: [number, number, number] = [
        position[0],
        position[1] - 0.2,
        position[2] + 0.5
    ]

    return (
        <group ref={computerRef} position={position} rotation={rotation}>
            <SpeedMissionIcon
                position={iconPosition}
                completed={localState.iconCompleted}
                visible={!speedMissionGlobal.gameActive && localState.showIcon}
            />

            <mesh>
                <boxGeometry args={[0.3, 0.25, 0.05]} />
                <meshStandardMaterial color="#333" />
                <mesh position={[0, -0.15, -0.05]}>
                    <boxGeometry args={[0.1, 0.1, 0.05]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
            </mesh>

            {speedMissionGlobal.gameActive && (
                <Html
                    fullscreen
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'auto'
                    }}
                    zIndexRange={[100, 0]}
                >
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 999
                    }} />

                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '800px',
                        height: '600px',
                        backgroundColor: '#2c3e50',
                        borderRadius: '10px',
                        border: '2px solid #3498db',
                        overflow: 'hidden',
                        zIndex: 1000,
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            width: '100%',
                            padding: '15px',
                            backgroundColor: '#3498db',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            borderBottom: '2px solid #2980b9'
                        }}>
                            ⚡ МИССИЯ СКОРОСТЬ
                        </div>

                        {speedMissionGlobal.countdown !== null && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '100px',
                                color: '#3498db',
                                fontWeight: 'bold',
                                textShadow: '0 0 20px rgba(52, 152, 219, 0.5)',
                                zIndex: 1001
                            }}>
                                {speedMissionGlobal.countdown}
                            </div>
                        )}

                        {speedMissionGlobal.countdown === null && (
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#1a252f',
                                overflow: 'hidden'
                            }}>
                                {folders.map(folder => (
                                    <div
                                        key={folder.id}
                                        onClick={() => handleFolderClick(folder.id, folder.type)}
                                        style={{
                                            position: 'absolute',
                                            left: `${folder.position.x + 300}px`,
                                            top: `${folder.position.y + 200}px`,
                                            width: '80px',
                                            height: '80px',
                                            backgroundColor: folder.color,
                                            borderRadius: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                            transition: 'transform 0.1s',
                                            textAlign: 'center',
                                            padding: '5px',
                                            zIndex: 1
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {folder.type === 'urgent' ? 'СРОЧНО' :
                                            folder.type === 'client' ? 'КЛИЕНТ' : 'СПАМ'}
                                    </div>
                                ))}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    zIndex: 2,
                                    border: '1px solid #3498db'
                                }}>
                                    <div>⏱️ Время: <span style={{
                                        color: speedMissionGlobal.timeLeft <= 10 ? '#e74c3c' : '#2ecc71',
                                        fontWeight: 'bold'
                                    }}>{speedMissionGlobal.timeLeft} сек</span></div>
                                    <div>🎯 Счет: <span style={{
                                        color: '#2ecc71',
                                        fontWeight: 'bold'
                                    }}>{speedMissionGlobal.score}</span></div>
                                    {speedMissionGlobal.timeLeft <= 15 && (
                                        <div style={{ color: '#f39c12', marginTop: '5px' }}>
                                            ⚡ Скорость увеличена!
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    padding: '8px 15px',
                                    borderRadius: '5px',
                                    fontSize: '14px',
                                    zIndex: 2,
                                    textAlign: 'center',
                                    border: '1px solid #3498db'
                                }}>
                                    Кликайте на красные (СРОЧНО) и зеленые (КЛИЕНТ) папки. Избегайте синих (СПАМ)!
                                </div>
                            </div>
                        )}
                    </div>
                </Html>
            )}
        </group>
    )
}

export function ComputerSpeedMissionUI() {
    const [uiState, setUiState] = useState({
        showHint: false,
        gameActive: false,
        showSuccessModal: false,
        showGameOverModal: false,
        timeLeft: 30,
        score: 0,
        countdown: null as number | null,
        isInteractable: false
    })

    useEffect(() => {
        console.log('UI: Инициализация компонента')

        speedMissionGlobal.showSuccessModal = false
        speedMissionGlobal.gameOver = false
    }, [])

    useEffect(() => {
        const updateUI = () => {
            setUiState(prev => ({
                ...prev,
                showHint: speedMissionGlobal.showHint,
                gameActive: speedMissionGlobal.gameActive,
                showSuccessModal: speedMissionGlobal.showSuccessModal,
                showGameOverModal: speedMissionGlobal.gameOver,
                timeLeft: speedMissionGlobal.timeLeft,
                score: speedMissionGlobal.score,
                countdown: speedMissionGlobal.countdown,
                isInteractable: speedMissionGlobal.isInteractable
            }))
        }

        const interval = setInterval(updateUI, 50)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (uiState.gameActive) {
            document.body.style.cursor = 'default'
        } else {
            document.body.style.cursor = 'none'
        }
    }, [uiState.gameActive])

    const handleCloseSuccessModal = () => {
        console.log('UI: Закрытие модалки успеха')
        speedMissionGlobal.showSuccessModal = false
        speedMissionGlobal.score = 0
        setUiState(prev => ({
            ...prev,
            showSuccessModal: false,
            score: 0
        }))
    }

    const handleCloseGameOverModal = () => {
        console.log('UI: Закрытие модалки проигрыша')
        speedMissionGlobal.gameOver = false
        speedMissionGlobal.score = 0
        setUiState(prev => ({
            ...prev,
            showGameOverModal: false,
            score: 0
        }))
    }

    return (
        <>
            {uiState.isInteractable && !uiState.gameActive && !uiState.showSuccessModal && !uiState.showGameOverModal && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.85)',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    zIndex: 1000,
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: '2px solid #ff9900',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(5px)'
                }}>
                    Нажмите F чтобы начать миссию
                </div>
            )}

            {uiState.showSuccessModal && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.95)',
                    padding: '30px',
                    borderRadius: '15px',
                    zIndex: 3000,
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    border: '3px solid #2ecc71',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)',
                    minWidth: '400px',
                    maxWidth: '500px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        fontSize: '28px',
                        marginBottom: '20px',
                        color: '#2ecc71',
                        fontWeight: 'bold'
                    }}>
                        🎉 Миссия выполнена!
                    </div>

                    <div style={{
                        fontSize: '20px',
                        marginBottom: '15px'
                    }}>
                        Вы успели набрать: <span style={{
                            color: '#2ecc71',
                            fontWeight: 'bold'
                        }}>{uiState.score} очков</span>
                    </div>

                    <div style={{
                        fontSize: '18px',
                        marginBottom: '25px',
                        padding: '15px',
                        background: 'rgba(52, 152, 219, 0.1)',
                        borderRadius: '8px',
                        lineHeight: '1.5'
                    }}>
                        <strong>Ценность компании: Скорость</strong><br />
                        Быстрая реакция на важные задачи и умение расставлять приоритеты!
                    </div>

                    <button
                        onClick={handleCloseSuccessModal}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(45deg, #4CAF50, #2ecc71)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Отлично!
                    </button>

                    <style jsx>{`
                        @keyframes fadeIn {
                            from { 
                                opacity: 0; 
                                transform: translate(-50%, -60%); 
                            }
                            to { 
                                opacity: 1; 
                                transform: translate(-50%, -50%); 
                            }
                        }
                    `}</style>
                </div>
            )}

            {uiState.showGameOverModal && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.95)',
                    padding: '30px',
                    borderRadius: '15px',
                    zIndex: 3000,
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    border: '3px solid #e74c3c',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(231, 76, 60, 0.3)',
                    minWidth: '400px',
                    maxWidth: '500px',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        fontSize: '28px',
                        marginBottom: '20px',
                        color: '#e74c3c',
                        fontWeight: 'bold'
                    }}>
                        ⚠️ Вы кликнули на СПАМ!
                    </div>

                    <div style={{
                        fontSize: '20px',
                        marginBottom: '15px'
                    }}>
                        Вы успели набрать: <span style={{
                            color: '#2ecc71',
                            fontWeight: 'bold'
                        }}>{uiState.score} очков</span>
                    </div>

                    <div style={{
                        fontSize: '18px',
                        marginBottom: '25px',
                        padding: '15px',
                        background: 'rgba(231, 76, 60, 0.1)',
                        borderRadius: '8px',
                        lineHeight: '1.5'
                    }}>
                        <strong>Важно:</strong> Внимательно смотрите на цвет папок.<br />
                        Красные и зеленые - важные, синие - спам!
                    </div>

                    <button
                        onClick={handleCloseGameOverModal}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Попробовать снова
                    </button>

                    <style jsx>{`
                        @keyframes fadeIn {
                            from { 
                                opacity: 0; 
                                transform: translate(-50%, -60%); 
                            }
                            to { 
                                opacity: 1; 
                                transform: translate(-50%, -50%); 
                            }
                        }
                    `}</style>
                </div>
            )}
        </>
    )
}
