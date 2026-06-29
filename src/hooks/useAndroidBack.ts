import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { pushBackHandler } from '../utils/backButton'

const isNative = Capacitor.isNativePlatform()

/**
 * 모달/오버레이 컴포넌트가 마운트되는 동안 Android 뒤로가기를 가로채서 onBack을 호출.
 * active=false이면 스택에 등록하지 않음 (isOpen 조건부 모달에 사용).
 * Web/PWA에서는 아무 동작도 하지 않음.
 */
export function useAndroidBack(onBack: () => void, active = true): void {
  useEffect(() => {
    if (!isNative || !active) return
    return pushBackHandler(onBack)
  }, [onBack, active])
}
