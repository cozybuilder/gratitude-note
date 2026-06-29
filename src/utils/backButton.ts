// Android 뒤로가기 버튼 핸들러 스택
// 모달이 열릴 때 핸들러를 push, 닫힐 때 제거.
// App.tsx에서 initBackButton()으로 한 번 초기화.

import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

type BackHandler = () => void
const stack: BackHandler[] = []

/** 핸들러를 스택에 추가. 반환 함수를 호출하면 제거. */
export function pushBackHandler(fn: BackHandler): () => void {
  stack.push(fn)
  return () => {
    const idx = stack.lastIndexOf(fn)
    if (idx !== -1) stack.splice(idx, 1)
  }
}

/** App.tsx에서 앱 마운트 시 한 번 호출. 반환 함수로 리스너 제거 가능. */
export function initBackButton(): () => void {
  if (!isNative) return () => {}

  const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
    if (stack.length > 0) {
      // 가장 위의 모달/오버레이를 닫는다
      stack[stack.length - 1]()
    } else if (canGoBack) {
      window.history.back()
    } else {
      App.exitApp()
    }
  })

  return () => {
    listenerPromise.then((h) => h.remove())
  }
}
