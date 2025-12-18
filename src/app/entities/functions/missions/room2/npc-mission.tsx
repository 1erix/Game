// app/entities/functions/missions/room2/ResponsibilityMission.tsx
'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

// Простое состояние миссии с реактивностью
const createMissionState = () => ({
    isMissionActive: false,
    isMissionComplete: false,
    canTakeMission: true,
    currentStep: 0,
    showNPCMind: true,
    showHint: false,
    playerMessage: '',
    npcMessage: '',
    objectives: [
        { id: 1, name: 'Кофемашина', done: false },
        { id: 2, name: 'Холодильник', done: false },
        { id: 3, name: 'Микроволновка', done: false },
        { id: 4, name: 'Стол для пинг-понга', done: false }
    ],
    // Добавляем слушателей для реактивности
    listeners: new Set<() => void>(),
    // Метод для обновления состояния
    update() {
        this.listeners.forEach(listener => listener())
    }
})

const missionState = createMissionState()

// Позиции объектов и NPC (Y = -1 для NPC, 0 для объектов)
const createPositions = () => ({
    // Начальная позиция NPC (на уровне пола для вашей модели)
    npc: new THREE.Vector3(2, -1, -3),

    // Объекты для заданий (на уровне пола)
    objects: {
        coffee: new THREE.Vector3(2.5, 0, 3.5),
        fridge: new THREE.Vector3(4, 0, 4.5),
        microwave: new THREE.Vector3(2.8, 0, 4.7),
        pingpong: new THREE.Vector3(-3, 0, -2.5)
    },

    // Куда телепортировать NPC для каждого объекта
    npcTeleports: {
        coffee: new THREE.Vector3(1.8, -1, 3.2),
        fridge: new THREE.Vector3(3.5, -1, 4.2),
        microwave: new THREE.Vector3(2.3, -1, 4.4),
        pingpong: new THREE.Vector3(-2.4, -1, -2.2)
    }
})

const positions = createPositions()

// Диалоги для каждого объекта
const dialogs = {
    coffee: {
        player: 'Это кофемашина. Здесь можно взять кофе в любое время.',
        npc: 'А, кофемашина! Значит, кофе здесь бесплатный?'
    },
    fridge: {
        player: 'Это холодильник. Подписывайте контейнеры со своей едой.',
        npc: 'Холодильник! А как понять, где чья еда?'
    },
    microwave: {
        player: 'Микроволновка. Разогревайте еду по очереди.',
        npc: 'Понятно, надо соблюдать очередь и убирать за собой.'
    },
    pingpong: {
        player: 'Стол для тенниса. Играйте в перерывах.',
        npc: 'Отлично! Значит, здесь можно отдохнуть в перерыве.'
    }
}

// Хук для использования состояния миссии с реактивностью
function useMissionState() {
    const [state, setState] = useState(missionState)

    useEffect(() => {
        const listener = () => setState({ ...missionState })
        missionState.listeners.add(listener)
        return () => {
            missionState.listeners.delete(listener)
        }
    }, [])

    return state
}

// Компонент иконки задания над NPC
function MissionIcon() {
    const state = useMissionState()
    // Показываем иконку только если миссия доступна и еще не начата
    const showIcon = state.canTakeMission && !state.isMissionActive && !state.isMissionComplete

    if (!showIcon) return null

    return (
        <Html position={[positions.npc.x, positions.npc.y + 1.5, positions.npc.z]} center style={{ pointerEvents: 'none' }}>
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
                    background: 'linear-gradient(135deg, #ff9900, #ff6600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(255, 153, 0, 0.4)',
                    border: '2px solid #ff9900',
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
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
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
                </div>
                <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ff9900',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap'
                }}>
                    ЗАДАНИЕ
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

// Компонент для реплик NPC (НАД ГОЛОВОЙ NPC)
function NPCSpeech() {
    const state = useMissionState()
    const [npcPos, setNpcPos] = useState<[number, number, number]>([2, 1, -3])

    useFrame(() => {
        // Реплика над головой NPC (Y + 1.5)
        setNpcPos([positions.npc.x, positions.npc.y + 1.5, positions.npc.z])
    })

    if (!state.npcMessage) return null

    return (
        <Html position={npcPos} center style={{ pointerEvents: 'none' }}>
            <div style={{
                background: 'rgba(52, 152, 219, 0.95)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid #2980b9',
                maxWidth: '250px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                {state.npcMessage}
                <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #2980b9'
                }} />
            </div>
        </Html>
    )
}

// Компонент для реплик игрока (НАД ГОЛОВОЙ игрока)
function PlayerSpeech() {
    const state = useMissionState()
    const [playerPos, setPlayerPos] = useState<[number, number, number]>([0, 0, 0])
    const { scene } = useThree()

    useFrame(() => {
        const player = scene.getObjectByName('player')
        if (player) {
            const pos = new THREE.Vector3()
            player.getWorldPosition(pos)
            // Реплика над головой игрока (Y + 1.5)
            setPlayerPos([pos.x, pos.y + 1.5, pos.z])
        }
    })

    if (!state.playerMessage) return null

    return (
        <Html position={playerPos} center style={{ pointerEvents: 'none' }}>
            <div style={{
                background: 'rgba(46, 204, 113, 0.95)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid #27ae60',
                maxWidth: '250px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                position: 'relative'
            }}>
                {state.playerMessage}
                <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #27ae60'
                }} />
            </div>
        </Html>
    )
}

// Компонент мыслей NPC (над головой)
function NPCMind() {
    const state = useMissionState()
    const [thought, setThought] = useState('')
    const thoughts = [
        "Я тут никого не знаю...",
        "Как страшно что-либо делать...",
        "Всё такое чужое...",
        "Лучше бы мне дома остаться..."
    ]

    useEffect(() => {
        if (!state.showNPCMind || state.isMissionActive) {
            setThought('')
            return
        }

        let index = 0
        const updateThought = () => {
            setThought(thoughts[index])
            index = (index + 1) % thoughts.length
        }

        updateThought()
        const interval = setInterval(updateThought, 3000)
        return () => clearInterval(interval)
    }, [state.showNPCMind, state.isMissionActive])

    if (!thought) return null

    return (
        <Html position={[positions.npc.x, positions.npc.y + 1.5, positions.npc.z]} center style={{ pointerEvents: 'none' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#333',
                padding: '6px 10px',
                borderRadius: '12px',
                border: '2px solid #3498db',
                maxWidth: '180px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                transform: 'translate(-50%, -100%)',
                position: 'relative'
            }}>
                {thought}
                <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #3498db'
                }} />
            </div>
        </Html>
    )
}

// Основной компонент миссии
export default function ResponsibilityMission() {
    const { scene } = useThree()
    const dialogTimer = useRef<NodeJS.Timeout>()
    const [playerPos, setPlayerPos] = useState(new THREE.Vector3())
    const playerRef = useRef<THREE.Object3D | null>(null)

    // Находим игрока один раз при монтировании
    useEffect(() => {
        const findPlayer = () => {
            playerRef.current = scene.getObjectByName('player')
        }

        findPlayer()
        const interval = setInterval(findPlayer, 1000)
        return () => clearInterval(interval)
    }, [scene])

    // Обновляем позицию игрока каждый кадр
    useFrame(() => {
        if (playerRef.current) {
            const pos = new THREE.Vector3()
            playerRef.current.getWorldPosition(pos)
            setPlayerPos(pos)

            // Проверяем расстояние до NPC
            const distanceToNPC = pos.distanceTo(positions.npc)

            // Обновляем состояние подсказки
            missionState.showHint = distanceToNPC < 2.5 &&
                !missionState.isMissionActive &&
                missionState.canTakeMission &&
                !missionState.isMissionComplete

            // Показываем мысли только если игрок далеко
            missionState.showNPCMind = distanceToNPC > 3 &&
                !missionState.isMissionActive &&
                missionState.canTakeMission &&
                !missionState.isMissionComplete

            missionState.update()
        }

        // Если миссия активна, проверяем достижение объектов
        if (missionState.isMissionActive && !missionState.isMissionComplete) {
            checkObjectives(playerPos)
        }
    })

    // Обработка нажатия клавиши F
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А' && missionState.showHint && missionState.canTakeMission) {
                startMission()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    // Проверка достижения объектов и телепортация NPC
    const checkObjectives = (playerPosition: THREE.Vector3) => {
        const objectives = [
            { key: 'coffee', pos: positions.objects.coffee },
            { key: 'fridge', pos: positions.objects.fridge },
            { key: 'microwave', pos: positions.objects.microwave },
            { key: 'pingpong', pos: positions.objects.pingpong }
        ]

        if (missionState.currentStep >= objectives.length) return

        const currentObjective = objectives[missionState.currentStep]
        const distance = playerPosition.distanceTo(currentObjective.pos)

        // Если игрок близко к объекту (<1.5м) и NPC еще не телепортировался
        if (distance < 1.5 && !missionState.objectives[missionState.currentStep].done) {
            console.log(`Игрок подошел к ${currentObjective.key} на расстояние ${distance.toFixed(2)}м`)

            // Телепортируем NPC к объекту
            teleportNPC(currentObjective.key as keyof typeof positions.npcTeleports)

            // Помечаем объект как выполненный
            missionState.objectives[missionState.currentStep].done = true

            // Показываем диалог
            const dialog = dialogs[currentObjective.key as keyof typeof dialogs]
            showDialog(dialog.player, dialog.npc)

            // Переходим к следующему этапу
            missionState.currentStep++

            missionState.update()

            // Проверяем завершение миссии
            if (missionState.currentStep >= missionState.objectives.length) {
                setTimeout(finishMission, 3000)
            }
        }
    }

    // Запуск миссии
    const startMission = () => {
        console.log('Миссия начата!')
        missionState.isMissionActive = true
        missionState.canTakeMission = false
        missionState.showHint = false
        missionState.showNPCMind = false
        missionState.currentStep = 0

        missionState.update()

        showDialog('Привет! Давай я покажу тебе комнату отдыха.', 'Привет! Я новенький, не знаю тут ничего...')
    }

    // Телепортация NPC
    const teleportNPC = (target: keyof typeof positions.npcTeleports) => {
        const newPos = positions.npcTeleports[target]
        positions.npc.copy(newPos)
        console.log(`NPC телепортирован к ${target}:`, newPos.toArray())

        // Обновляем NPC позицию через глобальное состояние
        if (window.updateNPCPosition) {
            window.updateNPCPosition(newPos.x, newPos.y, newPos.z)
        }
    }

    // Показ диалога
    const showDialog = (playerText: string, npcText: string) => {
        console.log('Показываем диалог:', { playerText, npcText })
        missionState.playerMessage = playerText
        missionState.npcMessage = npcText

        missionState.update()

        if (dialogTimer.current) clearTimeout(dialogTimer.current)
        dialogTimer.current = setTimeout(() => {
            missionState.playerMessage = ''
            missionState.npcMessage = ''
            missionState.update()
        }, 3000)
    }

    // Завершение миссии
    const finishMission = () => {
        showDialog(
            'Теперь ты знаешь все правила нашей комнаты отдыха!',
            'Спасибо большое! Теперь всё понятно. Чувствую себя своим!'
        )

        setTimeout(() => {
            missionState.isMissionActive = false
            missionState.isMissionComplete = true
            missionState.showNPCMind = false // Выключаем мысли после завершения
            missionState.update()
        }, 3000)
    }

    const state = useMissionState()

    return (
        <>
            <MissionIcon />
            <NPCMind />
            <NPCSpeech />
            <PlayerSpeech />

            {/* Маркеры текущей цели (на уровне пола Y=0) */}
            {state.isMissionActive && !state.isMissionComplete && (
                <>
                    {state.currentStep === 0 && (
                        <Html position={[2.5, 0, 3.5]} center style={{ pointerEvents: 'none' }}>
                            <div style={{
                                transform: 'translate(-50%, -80%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#3498db',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 0 10px #3498db'
                                }} />
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                    background: 'rgba(0,0,0,0.7)',
                                    padding: '2px 6px',
                                    borderRadius: '8px'
                                }}>
                                    Кофемашина
                                </div>
                            </div>
                        </Html>
                    )}
                    {state.currentStep === 1 && (
                        <Html position={[4, 0, 4.5]} center style={{ pointerEvents: 'none' }}>
                            <div style={{
                                transform: 'translate(-50%, -80%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#3498db',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 0 10px #3498db'
                                }} />
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                    background: 'rgba(0,0,0,0.7)',
                                    padding: '2px 6px',
                                    borderRadius: '8px'
                                }}>
                                    Холодильник
                                </div>
                            </div>
                        </Html>
                    )}
                    {state.currentStep === 2 && (
                        <Html position={[2.8, 0, 4.7]} center style={{ pointerEvents: 'none' }}>
                            <div style={{
                                transform: 'translate(-50%, -80%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#3498db',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 0 10px #3498db'
                                }} />
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                    background: 'rgba(0,0,0,0.7)',
                                    padding: '2px 6px',
                                    borderRadius: '8px'
                                }}>
                                    Микроволновка
                                </div>
                            </div>
                        </Html>
                    )}
                    {state.currentStep === 3 && (
                        <Html position={[-3, 0, -2.5]} center style={{ pointerEvents: 'none' }}>
                            <div style={{
                                transform: 'translate(-50%, -80%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: '#3498db',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    boxShadow: '0 0 10px #3498db'
                                }} />
                                <div style={{
                                    marginTop: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                                    background: 'rgba(0,0,0,0.7)',
                                    padding: '2px 6px',
                                    borderRadius: '8px'
                                }}>
                                    Стол для пинг-понга
                                </div>
                            </div>
                        </Html>
                    )}
                </>
            )}
        </>
    )
}

// UI компонент
export function ResponsibilityMissionUI() {
    const state = useMissionState()

    return (
        <>
            {/* Подсказка о нажатии F */}
            {state.showHint && !state.isMissionActive && !state.isMissionComplete && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '2px solid #ff9900',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: 1000
                }}>
                    Помочь новичку освоиться? (Нажмите F)
                </div>
            )}

            {/* Индикатор миссии */}
            {state.isMissionActive && !state.isMissionComplete && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '15px',
                    borderRadius: '10px',
                    border: '2px solid #3498db',
                    color: 'white',
                    minWidth: '200px',
                    zIndex: 1000
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#3498db' }}>Помогите новичку</h3>

                    {state.objectives.map((obj, index) => (
                        <div key={obj.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '5px',
                            color: obj.done ? '#2ecc71' : index === state.currentStep ? '#3498db' : '#ccc'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: obj.done ? '#2ecc71' : index === state.currentStep ? '#3498db' : '#666',
                                marginRight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {obj.done ? '✓' : index + 1}
                            </div>
                            <span>{obj.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Сообщение о завершении */}
            {state.isMissionComplete && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    padding: '30px',
                    borderRadius: '15px',
                    border: '3px solid #2ecc71',
                    textAlign: 'center',
                    zIndex: 1000
                }}>
                    <h2 style={{ color: '#2ecc71' }}>🎉 Миссия выполнена!</h2>
                    <p>Вы помогли новичку освоиться!</p>
                    <button
                        onClick={() => {
                            missionState.isMissionComplete = false
                            missionState.update()
                        }}
                        style={{
                            marginTop: '15px',
                            padding: '10px 20px',
                            background: '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        OK
                    </button>
                </div>
            )}
        </>
    )
}

// Глобальная переменная для обновления NPC
declare global {
    interface Window {
        updateNPCPosition: (x: number, y: number, z: number) => void
        getNPCPosition: () => THREE.Vector3
    }
}

// Инициализация глобальных функций
if (typeof window !== 'undefined') {
    window.updateNPCPosition = (x: number, y: number, z: number) => {
        positions.npc.set(x, y, z)
    }

    window.getNPCPosition = () => positions.npc
}

// Простая функция для получения позиции NPC
export function getNPCPosition() {
    return positions.npc
}

// Простая функция для получения поворота NPC
export function getNPCRotation() {
    return [0, 0, 0] as [number, number, number]
}