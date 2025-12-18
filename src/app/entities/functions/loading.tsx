'use client'

import { useState, useEffect } from 'react'

export default function LoadingScreen() {
    const [dots, setDots] = useState('')
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Таймер для скрытия экрана загрузки
        const hideTimer = setTimeout(() => {
            setIsVisible(false)
        }, 3000) // Скрыть через 3 секунды

        // Анимация точек
        const dotsInterval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return ''
                return prev + '.'
            })
        }, 300)

        return () => {
            clearTimeout(hideTimer)
            clearInterval(dotsInterval)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#7c7e83',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                marginBottom: '30px'
            }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '3px solid transparent',
                    borderTop: '3px solid #eae9cc',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '3px solid transparent',
                    borderRight: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spinReverse 1.5s linear infinite'
                }}></div>
            </div>

            <div style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#f8fafc',
                letterSpacing: '1px'
            }}>
                Загрузка{dots}
            </div>

            <div style={{
                fontSize: '14px',
                color: '#94a3b8',
                marginTop: '10px',
                opacity: '0.8'
            }}>
                Пожалуйста, подождите
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spinReverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
            `}</style>
        </div>
    )
}