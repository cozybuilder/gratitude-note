# RELEASE_CHECKLIST.md — 출시 체크리스트

> Android Play Store 신규 출시 및 업데이트 배포 시 사용합니다.  
> 체크리스트를 순서대로 진행하고, 각 항목 완료 시 `[x]`로 표시하세요.

---

## Play Store 현재 상태

| 항목 | 상태 |
|------|------|
| **앱 이름** | 감사일기 |
| **패키지 ID** | com.cozybuilder.gratitudediary |
| **최신 배포 versionCode** | 3 |
| **최신 배포 versionName** | 1.7.1 |
| **Play Store 트랙** | 프로덕션 액세스 승인 완료 — 정식 출시 대기 중 |

---

## A. 신규 버전 빌드 체크리스트

### A-1. 버전 번호 확인 및 업데이트

```
android/app/build.gradle
  versionCode  ← 이전보다 반드시 1 이상 증가
  versionName  ← 사용자에게 표시되는 버전 (예: 1.7.0)
```

- [ ] `versionCode` 증가 확인 (현재: 3 → 다음: 4 이상)
- [ ] `versionName` 업데이트 확인

### A-2. 빌드 환경 준비

- [ ] `.env.local` 환경변수 확인
  ```bash
  VITE_ADMOB_APP_ID=        # (있는 경우)
  VITE_ADMOB_BANNER_ID=     # (있는 경우)
  VITE_BADGE_AI_ENDPOINT=   # Serverless Function URL
  ```
- [ ] `npm run build` 성공 확인 (TypeScript 오류 없음)
- [ ] `npx cap sync android` 실행

### A-3. 보안 사전 확인

- [ ] `git status`에서 아래 파일이 스테이징되지 않았는지 확인
  - `.env.local`
  - `*.keystore`, `*.jks`
  - `keystore.properties`
  - `key.properties`
  - 비밀번호가 포함된 파일 일체
- [ ] `src/utils/ai.ts`의 `ENABLE_BADGE_AI_API` 상태 확인
  - 현재 정책: `false` (기본 OFF 유지)
  - 변경 시 PM 승인 필수

### A-4. 코드 품질 확인

- [ ] 불필요한 `console.log` 없는지 확인
- [ ] 테스트용 임시 파일 없는지 확인 (`.claude/launch.json` 등)
- [ ] `localStorage.clear()` 등 테스트 코드 제거 확인

---

## B. Android APK / AAB 빌드

### B-1. Android Studio 빌드

1. Android Studio에서 프로젝트 열기: `android/` 폴더
2. `Build > Generate Signed Bundle / APK` 선택
3. **Android App Bundle (AAB)** 선택 (Play Store 권장)
4. 키스토어 정보 입력
   > ⚠️ 키스토어 파일과 비밀번호는 로컬에만 보관. 절대 Git에 커밋하지 않음.
5. `release` 빌드 선택
6. 빌드 완료 → `android/app/release/app-release.aab` 생성 확인

### B-2. 빌드 결과 확인

- [ ] AAB 파일 생성 확인
- [ ] 파일 크기 이상 없음 확인 (비정상적으로 크거나 작은 경우 재빌드)
- [ ] versionCode, versionName이 기대값인지 확인
  ```bash
  # aapt2 또는 bundletool로 확인 가능
  ```

---

## C. Play Store 내부 테스트 / 심사 제출

### C-1. Play Console 업로드

- [ ] Google Play Console 접속 (https://play.google.com/console)
- [ ] 앱 선택: 감사일기 (`com.cozybuilder.gratitudediary`)
- [ ] **프로덕션 트랙** 또는 **내부 테스트 트랙** 선택
- [ ] AAB 파일 업로드
- [ ] 출시 노트(릴리즈 노트) 작성 — 한국어 필수

### C-2. 출시 노트 예시

```
[v1.7.1] 배지 축하 메시지 기능 개선
- 배지 획득 시 더 다양한 응원 메시지를 제공합니다
- 앱 안정성 개선
```

### C-3. 심사 대기

- [ ] 정책 위반 사항 없는지 최종 확인
  - 개인정보처리방침 URL 유효 확인
  - 앱 설명과 실제 기능 일치 확인
  - 불필요한 권한 요청 없는지 확인
- [ ] 심사 통과 후 프로덕션 출시

---

## D. Vercel 배포 체크리스트

웹 앱 / Serverless Function은 `git push origin master` 시 자동 배포됩니다.

### D-1. 배포 확인

- [ ] Vercel 대시보드에서 빌드 성공 확인
- [ ] https://gratitude-note-theta.vercel.app 접속하여 앱 정상 동작 확인
- [ ] `/api/badge-celebration`에 POST 요청 정상 응답 확인
  ```bash
  curl -X POST https://gratitude-note-theta.vercel.app/api/badge-celebration \
    -H "Content-Type: application/json" \
    -d '{"badgeId":"sprout","streak":7,"noteCount":7}'
  # 기대 응답: { "message": "...", "source": "ai" } HTTP 200
  ```

### D-2. Vercel 환경변수 확인

- [ ] `OPENAI_API_KEY` — Vercel 대시보드에 설정 여부
- [ ] Function 로그에서 오류 없는지 확인

---

## E. 핫픽스 / 긴급 패치 절차

1. `master` 브랜치에서 수정
2. `npm run build` 확인
3. commit → `git push origin master`
4. Vercel 자동 배포 완료 확인
5. Android 수정 필요 시 → B ~ C 절차 반복 (versionCode 반드시 증가)

---

## F. 배포 이력

| versionCode | versionName | 날짜 | 트랙 | 주요 변경 |
|-------------|-------------|------|------|-----------|
| 1 | 1.6.0 | - | 내부 테스트 | Capacitor Android 초기 빌드 |
| 2 | 1.6.1 | - | 내부 테스트 | 테스트 빌드 버전 번호 업데이트 |
| 3 | 1.7.1 | 2026-06-09 | 프로덕션 대기 | 배지 시스템·AI 인프라·설정 버전 반영, 프로덕션 권한 승인 |

---

## G. 체크리스트 사용 가이드

- **정식 출시** (신규 기능 포함): A → B → C → D 전체
- **긴급 패치** (버그 수정만): A-3 → A-4 → D (Vercel만 배포 시 A-1 생략 가능)
- **Android 전용 업데이트**: A-1 → A-2 → A-3 → A-4 → B → C
- **Vercel 전용 업데이트**: A-3 → A-4 → D
