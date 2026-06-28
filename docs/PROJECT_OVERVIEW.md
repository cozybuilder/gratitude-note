# PROJECT_OVERVIEW.md

> 새 세션 시작 시 가장 먼저 읽는 문서.  
> 프로젝트 현재 상태를 5분 안에 파악할 수 있습니다.

---

## 1. 현재 상태 스냅샷

| 항목 | 상태 |
|------|------|
| **최신 버전** | v1.8.0 (Android Release 준비 완료) |
| **GitHub** | https://github.com/cozybuilder/gratitude-note (`master`) |
| **Vercel** | https://gratitude-note-theta.vercel.app (배포 완료) |
| **Android versionCode** | 4 |
| **Android versionName** | 1.8.0 |
| **Play Store 상태** | v1.7.1 프로덕션 출시 완료 → v1.8.0 Signed AAB 빌드 후 업로드 예정 |
| **AI 기능** | 구현 완료, 기본 OFF (`ENABLE_BADGE_AI_API = false`) |
| **Local Notifications** | @capacitor/local-notifications@8.2.0 도입, Android 앱 알림 정상화 |
| **AdMob** | @capacitor-community/admob@8.0.0 도입, 테스트 배너 구조 완료 |
| **빌드 상태** | `npm run build` 통과 ✅ / `npx cap sync android` 통과 ✅ |

---

## 2. 프로젝트 기본 정보

```
앱 이름:       감사일기
패키지 ID:     com.cozybuilder.gratitudediary
GitHub:        https://github.com/cozybuilder/gratitude-note.git
Vercel:        https://gratitude-note-theta.vercel.app
로컬 경로:     C:\projects\gratitude-note
```

---

## 3. 로컬 개발 환경

### 즉시 실행 가능한 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 빌드 결과 preview
npx vite preview --port 5180

# Android 동기화
npx cap sync android
```

### 환경변수 (.env.local — Git 미포함)

```bash
VITE_BADGE_AI_ENDPOINT=https://gratitude-note-theta.vercel.app/api/badge-celebration
VITE_ADMOB_APP_ID=           # (필요 시 설정)
VITE_ADMOB_BANNER_ID=        # (필요 시 설정)
```

---

## 4. 데이터 저장 구조

**모든 사용자 데이터는 기기 localStorage에만 저장됩니다. 서버 DB 없음.**

| localStorage 키 | 타입 | 설명 |
|-----------------|------|------|
| `gratitude_notes` | `Note[]` | 감사 기록 배열 |
| `gratitude_achievements` | `Achievement[]` | 배지 업적 배열 |
| `theme_mode` | `'light' \| 'dark'` | 테마 설정 |
| `onboarding_done` | `'true'` | 온보딩 완료 여부 |

> ⚠️ 이 키들은 절대 변경하면 안 됩니다.

---

## 5. 핵심 파일 맵

```
src/
├── types/note.ts              — Note, Mood 타입 정의
├── utils/
│   ├── storage.ts             — localStorage CRUD (STORAGE_KEY 고정)
│   ├── achievement.ts         — 배지 저장/조회 (ACHIEVEMENT_KEY 고정)
│   ├── ai.ts                  — 메시지 생성 (ENABLE_BADGE_AI_API 플래그)
│   ├── streak.ts              — 연속 기록 계산 (4AM 날짜 경계)
│   ├── date.ts                — getGratitudeDate(), 4AM 기준 날짜
│   ├── backup.ts              — JSON 백업/복원
│   ├── shareCard.ts           — 공유 카드 이미지 생성
│   └── notification.ts        — 알림 설정
├── hooks/
│   ├── useNotes.ts            — 감사 기록 CRUD 훅
│   ├── useStreak.ts           — streak 계산 훅
│   ├── useAchievements.ts     — 배지 획득 감지 + 비동기 메시지 생성
│   └── useTheme.ts            — 다크/라이트 모드
└── pages/                     — 각 화면 컴포넌트

api/
└── badge-celebration.ts       — Vercel Serverless Function (Node.js Runtime)

vercel.json                    — SPA + API 라우팅
capacitor.config.ts            — Android 설정
```

---

## 6. 현재 활성 제약사항

```
ENABLE_BADGE_AI_API = false   → AI API 호출 비활성화 (기본값, 유지)
VITE_OPENAI_API_KEY 사용 금지  → 프론트엔드 번들에 API 키 포함 금지
generateAiMessage() 수정 금지  → 기존 저장 데이터와 연관된 함수
키스토어 파일 커밋 금지
```

---

## 7. 배포 파이프라인

```
git push origin master
       ↓
Vercel 자동 감지
       ↓
npm run build (Vercel 실행)
       ↓
dist/ 정적 호스팅 + api/ Serverless Function 배포
       ↓
https://gratitude-note-theta.vercel.app 반영
```

Android 배포는 별도 수동 빌드 → Play Store 업로드 (→ `docs/RELEASE_CHECKLIST.md` 참조)

---

## 8. 다음 작업 후보

- [ ] Play Store 정식 출시 승인 진행
- [ ] AI 배지 메시지 활성화 시점 결정 (DAU 기반 비용 시뮬레이션 후)
- [ ] v1.8 기능 기획 (→ `docs/DECISIONS.md` 참조)
