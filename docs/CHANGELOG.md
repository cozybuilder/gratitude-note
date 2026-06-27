# CHANGELOG

모든 주요 변경사항을 버전 기준으로 기록합니다.  
형식: [Semantic Versioning](https://semver.org/) | 날짜: YYYY-MM-DD 기준

---

## [1.7.1] — AI API 인프라 완성 + 기본 OFF 정책 + Android 정식 릴리즈 준비

### Android Release (v1.7.1)
- `android/app/build.gradle` — versionCode 2 → 3, versionName 1.6.1 → 1.7.1
- `src/pages/SettingsPage.tsx` — APP_VERSION '1.6.0' → '1.7.1' (앱 설정 화면 버전 표시)
- `src/utils/backup.ts` — BACKUP_VERSION '1.6.0' → '1.7.1' (JSON 백업 파일 버전 태그)
- Google Play 프로덕션 액세스 권한 승인 완료
- 비공개 테스트(v1.6.0) 종료 → 정식 출시 대기 상태

---

## [1.7.1] (웹/기능) — AI API 인프라 완성 + 기본 OFF 정책

### Added
- `api/badge-celebration.ts` — Vercel Serverless Function (Node.js Runtime)
  - OpenAI gpt-4o-mini 연동, max_tokens 200, temperature 0.8
  - CORS 헤더 설정, POST 전용, 5초 timeout fallback
- `vercel.json` — SPA 라우팅 + API 라우팅 분리
  ```json
  { "src": "/api/(.*)", "dest": "/api/$1" },
  { "src": "/(.*)",     "dest": "/index.html" }
  ```
- `src/env.d.ts` — `VITE_BADGE_AI_ENDPOINT` 환경변수 타입 추가
- `Achievement.source?: 'ai' | 'local'` — 메시지 출처 필드 추가
- `AchievementExtras.source` — extras 타입에 source 필드 추가
- `BADGE_CELEBRATION_POOL` — 배지별 로컬 응원 메시지 5개로 확장 (6배지 × 5 = 30개)

### Changed
- `ENABLE_BADGE_AI_API = false` — AI API 기본 비활성화 정책 적용
- `generateBadgeCelebrationMessageWithApi()` — `BadgeCelebrationResult` 반환 (`message` + `source`)
- `useAchievements.ts` — async 패턴 적용, `cancelled` 플래그로 안전한 언마운트 처리

### Fixed
- Edge Runtime `process` 타입 오류 → Node.js Runtime으로 전환 (`export const config` 제거)
- `vercel.json` rewrites가 `/api/` 경로까지 catch하던 문제 → `routes`로 변경

### Commits
- `feat: add AI badge celebration serverless integration` — Serverless Function + vercel.json
- `fix: use node runtime for badge celebration API` — Edge Runtime → Node.js Runtime
- `fix: use routes for spa and api routing in vercel` — rewrites → routes
- `feat: track AI and fallback message sources` — source 필드 추가
- `chore: disable badge AI API by default and expand local messages` — 기본 OFF + 로컬 템플릿 확장

---

## [1.7.0] — 배지 AI 축하 메시지 (1차)

### Added
- 배지 획득 시 1회 로컬 템플릿 회고 메시지 생성
- `BadgeCelebrationModal` — "AI 회고 메시지" 섹션 추가
- `celebrationMessage`, `analyzedNoteCount`, `previousBadgeEarnedAt` 필드를 `Achievement`에 추가
- 복수 배지 동시 달성 시 각각 메시지 생성, 최고 배지 모달에 표시
- `generateBadgeCelebrationMessage()` — 배지 유형별 로컬 템플릿 랜덤 선택

### Commits
- `feat: add badge celebration message generation` (a338699)

---

## [1.6.1] — Play Store 테스트 빌드

### Changed
- Android `versionCode`: 1 → 2
- Android `versionName`: 1.6.0 → 1.6.1

### Commits
- `chore(android): bump version to 2 / 1.6.1` (194e016)

---

## [1.6.0] — Android Play Store 출시 준비

### Added
- Capacitor 8.4.0 플랫폼 추가
- `capacitor.config.ts` — `appId: com.cozybuilder.gratitudediary`
- Android 앱 아이콘, 스플래시 스크린 브랜딩
- `versionCode: 1`, `versionName: 1.6.0`
- 개인정보처리방침 페이지 (`PrivacyPage`)
- Google Play 정책 대응 콘텐츠

### Commits
- `feat(android): add capacitor android platform` (a486ddc)

---

## [1.5.2] — 알림(리마인더) 시스템

### Added
- 시간대별 리마인더 ON/OFF 설정
- `notification.ts` 유틸리티
- 알림 설정 UI (SettingsPage)

### Commits
- `feat: add notification reminder system` (24aff83)

---

## [1.0.0] — MVP 완성

### Added
- 감사 기록 작성 — 매일 3가지 감사 + 기분 선택 (5단계)
- 감사 기록 수정 — 당일 기록 수정 가능
- AI 응원 메시지 — 저장 시 로컬 템플릿 기반 메시지
- 연속 기록(streak) 계산 — 새벽 4시 기준 `gratitudeDate`
- PWA 지원 — 홈 화면 추가, Service Worker, 오프라인 캐싱
- 다크 모드 — 라이트/다크 토글, `theme_mode` 저장
- 온보딩 화면 — 앱 최초 실행 안내
- 배지 시스템 — 7·30·60·90·180·365일 영구 배지 (6종)
- 배지 페이지 — 획득/미획득 배지 목록
- 시즌별 Hero 배너 — 계절 이미지 자동 전환
- 공유 카드 — 감사 기록 SNS 공유 이미지 생성
- 데이터 백업/복원 — JSON 파일 내보내기/가져오기
- 집계 페이지 — 감사 통계 시각화
- 캘린더 뷰 — 날짜별 기록 확인
- 기록 목록 — 전체 기록 리스트

### Architecture Decisions
- localStorage 전용 저장소 — 서버 DB 없음
- `STORAGE_KEY = 'gratitude_notes'` 고정
- `ACHIEVEMENT_KEY = 'gratitude_achievements'` 고정
- `gratitudeDate` 필드 — 새벽 4시 기준 날짜 경계

---

## 버전 명명 규칙

```
vMAJOR.MINOR.PATCH

MAJOR: 아키텍처 변경, 데이터 구조 변경 (사용자 영향 대규모)
MINOR: 새 기능 추가
PATCH: 버그 수정, 정책 변경, 설정 조정
```

## 향후 예정

- `[1.8.0]` — 기능 미정 (사용자 피드백 반영 후 결정)
- `[2.0.0]` — iOS 출시 시 (Capacitor iOS 플랫폼 추가)
