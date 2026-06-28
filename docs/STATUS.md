# STATUS.md — 프로젝트 현재 상태

> 가장 최근 상태를 기록합니다. 변경 발생 시 즉시 갱신.  
> 상세 이력: `docs/CHANGELOG.md` | 출시 절차: `docs/RELEASE_CHECKLIST.md`

---

## 현재 상태 (2026-06-28 기준)

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
| **Local Notifications** | @capacitor/local-notifications@8.2.0 도입 완료 |
| **AdMob** | @capacitor-community/admob@8.0.0 도입, 테스트 배너 구조 완료 |

---

## Play Store 상태

| 항목 | 상태 |
|------|------|
| **프로덕션 액세스 권한** | ✅ 승인 완료 |
| **비공개 테스트** | 종료 (마지막 버전: v1.6.0, versionCode 2) |
| **현재 단계** | v1.8.0 Signed AAB 빌드 → 프로덕션 업로드 대기 |
| **다음 액션** | Android Studio에서 Signed AAB(versionCode 4) 생성 → Play Console 업로드 |

---

## AAB 빌드 전 준비 완료 항목

- [x] `android/app/build.gradle` — versionCode 4, versionName 1.8.0
- [x] `src/pages/SettingsPage.tsx` — APP_VERSION = '1.8.0'
- [x] `src/utils/backup.ts` — BACKUP_VERSION = '1.8.0'
- [x] `src/utils/notification.ts` — Capacitor LocalNotifications 분기 구현
- [x] `src/components/ad/AdBanner.tsx` — Capacitor AdMob 배너 구현
- [x] `android/app/src/main/AndroidManifest.xml` — 권한 및 AdMob meta-data
- [x] `capacitor.config.ts` — LocalNotifications 설정
- [x] `npm run build` — 통과 (TS 오류 없음)
- [x] `npx cap sync android` — 통과 (2개 플러그인 등록 확인)
- [ ] Android Studio — Signed AAB 생성 (사장 직접 수행)
- [ ] Play Console — 프로덕션 트랙 업로드
- [ ] 휴대폰 최종 테스트

---

## 휴대폰 최종 테스트 필요 항목

| 항목 | 확인 방법 |
|------|-----------|
| 감사 기록 작성 | 오늘 날짜로 3가지 입력 → 저장 확인 |
| 새벽 4시 날짜 전환 | 설정 화면 "하루 기준" 표시 확인 |
| 연속 기록(streak) | 홈 화면 streak 숫자 확인 |
| 배지 시스템 | 배지 페이지 진입 → 획득/미획득 목록 확인 |
| 배지 획득 모달 | 7일 달성 시 모달 표시 + 메시지 확인 |
| 공유 카드 | 기록 상세 → 공유 버튼 → 이미지 생성 확인 |
| 알림 설정 | 설정 → 알림 ON/OFF 토글 확인 |
| 앱 버전 표시 | 설정 → "버전" → 1.8.0 표시 확인 |
| 캘린더 날짜 선택 | 캘린더 탭 → 날짜 탭 → 해당일 기록 조회 확인 |
| 다크 모드 | 설정 → 다크 모드 전환 확인 |
| 백업 | 설정 → 내보내기 → JSON 파일 생성 확인 |

---

## 이전 이력 요약

| 날짜 | 내용 |
|------|------|
| v1.6.0 | Android 최초 빌드, 내부 테스트 제출 |
| v1.6.1 | 테스트 빌드 versionCode 2 |
| v1.7.0 | 배지 축하 메시지 1차 구현 |
| v1.7.1 | AI Serverless Function, 기본 OFF 정책, 프로덕션 권한 승인 |
| v1.8.0 | Local Notifications(Capacitor), AdMob 테스트 배너 도입 |
