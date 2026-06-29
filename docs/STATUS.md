# STATUS.md — 프로젝트 현재 상태

> 가장 최근 상태를 기록합니다. 변경 발생 시 즉시 갱신.  
> 상세 이력: `docs/CHANGELOG.md` | 출시 절차: `docs/RELEASE_CHECKLIST.md`

---

## 현재 상태 (2026-06-30 기준)

| 항목 | 상태 |
|------|------|
| **앱 버전** | v1.8.0 |
| **Android versionCode** | 4 |
| **Android versionName** | 1.8.0 |
| **웹 빌드** | ✅ 통과 (`npm run build`) |
| **Capacitor Sync** | ✅ 통과 (`npx cap sync android`) |
| **GitHub master** | https://github.com/cozybuilder/gratitude-note |
| **Vercel** | https://gratitude-note-theta.vercel.app (운영 중) |
| **AI API** | 구현 완료, 기본 OFF (`ENABLE_BADGE_AI_API = false`) |
| **Local Notifications** | ✅ 실기기 발송 확인 완료 (채널 생성·SCHEDULE_EXACT_ALARM 포함) |
| **Native Share** | ✅ Android 시스템 공유 시트 정상 동작 |
| **뒤로가기 UX** | ✅ 모달 열림 시 Android 뒤로가기로 닫기 동작 |
| **AdMob** | ⚠️ 패키지·인프라 준비 완료, **v1.8.0 배너 미노출** (v1.9.0 이후 검토) |

---

## Play Store 상태

| 항목 | 상태 |
|------|------|
| **프로덕션 액세스 권한** | ✅ 승인 완료 |
| **현재 단계** | v1.8.0 Signed AAB 빌드 → 프로덕션 업로드 대기 |
| **다음 액션** | Android Studio에서 Signed AAB(versionCode 4) 생성 → Play Console 업로드 |

---

## AAB 빌드 전 준비 완료 항목

- [x] `android/app/build.gradle` — versionCode 4, versionName 1.8.0
- [x] `src/pages/SettingsPage.tsx` — APP_VERSION = '1.8.0'
- [x] `src/utils/backup.ts` — BACKUP_VERSION = '1.8.0'
- [x] `src/utils/notification.ts` — Capacitor LocalNotifications + 채널 생성 + SCHEDULE_EXACT_ALARM
- [x] `android/app/src/main/AndroidManifest.xml` — POST_NOTIFICATIONS / RECEIVE_BOOT_COMPLETED / SCHEDULE_EXACT_ALARM
- [x] `capacitor.config.ts` — LocalNotifications 설정
- [x] `src/utils/backButton.ts` — Android 뒤로가기 핸들러
- [x] `src/utils/shareCard.ts` — 공유 카드 레이아웃 + QR + URL
- [x] `src/components/note/ShareCardModal.tsx` — Capacitor Share + 뒤로가기 처리
- [x] `src/index.css` — OnGel 폰트, font-size 20px, bold 제거
- [x] `npm run build` — 통과 (TS 오류 없음)
- [x] `npx cap sync android` — 통과 (5개 플러그인 등록 확인)
- [ ] Android Studio — Signed AAB 생성 (사장 직접 수행)
- [ ] Play Console — 프로덕션 트랙 업로드
- [ ] 실기기 최종 검증 (아래 항목 참조)

---

## 실기기 최종 테스트 필요 항목

| 항목 | 확인 방법 |
|------|-----------|
| 감사 기록 작성 | 오늘 날짜로 3가지 입력 → 저장 확인 |
| 연속 기록(streak) | 홈 화면 streak 숫자 확인 |
| 배지 시스템 | 배지 페이지 진입 → 획득/미획득 목록 확인 |
| 배지 획득 모달 뒤로가기 | 모달 열림 → Android 뒤로가기 → 모달 닫힘 (앱 종료 아님) |
| 공유 카드 생성 | 기록 상세 → 공유 버튼 → 이미지 생성 → QR/URL 표시 확인 |
| 공유 카드 뒤로가기 | 공유 모달 열림 → Android 뒤로가기 → 모달 닫힘 |
| 이미지 공유 | [이미지 공유] 버튼 → 시스템 공유 시트 표시 확인 |
| 링크 공유 | [링크 공유] 버튼 → 시스템 공유 시트 (텍스트) 확인 |
| 18시 알림 | 설정 → 저녁 6시 알림 ON → 18시 알림 도착 확인 |
| 22시 알림 | 설정 → 저녁 10시 알림 ON → 22시 알림 도착 확인 |
| 알림 권한 요청 | 설정 → 허용하기 버튼 → 시스템 권한 다이얼로그 표시 확인 |
| 폰트 가독성 | OnGel 폰트 + 20px 베이스 정상 렌더링 확인 |
| 다크 모드 | 설정 → 다크 모드 전환 확인 |
| 배지 뒤로가기 버튼 | 배지 페이지 상단 원형 화살표 버튼 → navigate(-1) 확인 |
| 앱 버전 표시 | 설정 → "버전" → 1.8.0 표시 확인 |
| 백업 | 설정 → 내보내기 → JSON 파일 생성 확인 |

---

## 이전 이력 요약

| 날짜 | 버전 | 내용 |
|------|------|------|
| - | v1.6.0 | Android 최초 빌드, 내부 테스트 제출 |
| - | v1.6.1 | 테스트 빌드 versionCode 2 |
| - | v1.7.0 | 배지 축하 메시지 1차 구현 |
| 2026-06-09 | v1.7.1 | AI Serverless Function, 기본 OFF 정책, 프로덕션 권한 승인 |
| 2026-06-30 | v1.8.0 | Capacitor 알림·공유·뒤로가기 UX·OnGel 폰트·공유 카드 개선 |
