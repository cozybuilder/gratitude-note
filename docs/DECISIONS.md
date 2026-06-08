# DECISIONS.md — 주요 의사결정 기록

> 프로젝트에서 내려진 설계·정책·기술 결정을 기록합니다.  
> "왜 이렇게 했는가"를 추적하여 미래의 재검토 시 맥락을 제공합니다.  
> 형식: [날짜] 결정 제목 / 상태 (확정 | 보류 | 폐기)

---

## [v1.0] 모든 사용자 데이터를 localStorage에만 저장한다

**상태**: 확정 (불변)

**결정 내용**: 서버 DB, 클라우드 동기화 없이 기기 localStorage만 사용.

**이유**:
- 감사 기록은 개인의 내밀한 데이터. 서버 전송 자체를 차단함으로써 개인정보 보호.
- 서버 운영 비용 제로.
- 오프라인에서도 앱이 완전히 동작.
- 인증·동기화·충돌 해결 등 복잡성 제거 → 빠른 MVP 완성.

**트레이드오프**:
- 기기 분실/교체 시 데이터 복구 불편 → JSON 백업/복원으로 완화.
- 멀티 디바이스 동기화 불가 → MVP에서 불필요로 판단.

**재검토 조건**: 멀티 디바이스 동기화 요구가 핵심 이탈 원인으로 확인될 때.

---

## [v1.0] STORAGE_KEY, ACHIEVEMENT_KEY를 불변으로 선언한다

**상태**: 확정 (절대 불변)

**결정 내용**:
- `STORAGE_KEY = 'gratitude_notes'`
- `ACHIEVEMENT_KEY = 'gratitude_achievements'`

**이유**: 앱이 배포된 이후 이 키를 변경하면 기존 사용자의 모든 데이터가 유실됨. 마이그레이션 코드를 작성해도 엣지 케이스 위험 존재. 최초 결정이 영구 적용.

**재검토 조건**: 없음. 이 키는 영원히 변경 불가.

---

## [v1.0] 새벽 4시(4AM)를 날짜 경계로 사용한다

**상태**: 확정 (불변)

**결정 내용**: `gratitudeDate` 필드 및 streak 계산 시 자정 대신 새벽 4시를 날짜 경계로 사용.

**이유**: 밤 11시, 자정 직후에 감사 기록을 작성하는 사용자가 "오늘의 기록"으로 인식함. 자정 기준 시 연속 기록이 의도치 않게 끊길 수 있음.

**재검토 조건**: 사용자 피드백으로 다른 시간대 요구가 확인될 때.

---

## [v1.0] generateAiMessage()는 수정하지 않는다

**상태**: 확정 (불변)

**결정 내용**: `src/utils/ai.ts`의 `generateAiMessage(g1, g2, g3, mood)` 함수는 어떤 이유로도 수정하지 않음.

**이유**: 이미 저장된 감사 기록의 `aiMessage` 필드 생성 로직과 연관. 변경 시 표시되는 메시지가 달라지거나 저장 데이터와 불일치 발생 가능성.

**재검토 조건**: 없음.

---

## [v1.0] Android 앱 ID를 com.cozybuilder.gratitudediary로 확정한다

**상태**: 확정 (절대 불변)

**결정 내용**: `appId: com.cozybuilder.gratitudediary`

**이유**: Play Store 등록 후 앱 ID 변경 = 새 앱으로 재등록 필요. 기존 사용자 연속성 파괴.

**재검토 조건**: 없음. Play Store 등록 후 변경 불가.

---

## [v1.6.0] Capacitor를 Android 빌드 도구로 선택한다

**상태**: 확정

**결정 내용**: React Native, Flutter 대신 Capacitor 8.4.0 사용.

**이유**:
- 이미 완성된 React 웹 앱을 코드 변경 없이 Android로 패키징.
- 웹·PWA·Android를 단일 코드베이스로 유지.
- 별도 모바일 프레임워크 학습 비용 없음.

**트레이드오프**: 네이티브 성능보다 낮은 WebView 기반 성능. 현재 앱의 성격(텍스트 입력 중심)에서는 무관.

---

## [v1.7.0] 배지는 한 번 획득하면 streak이 낮아져도 유지한다

**상태**: 확정

**결정 내용**: 배지는 영구 달성 기록. 연속 기록이 끊겨도 이미 획득한 배지는 삭제되지 않음.

**이유**: 사용자가 힘들게 달성한 기록에 대한 존중. 배지 삭제는 부정적 경험. 습관 재형성에도 과거 달성 이력이 동기 부여로 작용.

---

## [v1.7.0] 복수 배지 동시 달성 시 모달은 최고 배지만 표시한다

**상태**: 확정

**결정 내용**: `willGain` 배열의 모든 배지에 메시지를 생성·저장하되, 모달 UI는 `willGain[willGain.length - 1]`(최고 배지) 1개만 표시.

**이유**: 복수 모달 연속 표시는 UX 혼란. 최고 달성의 임팩트를 극대화.

---

## [v1.7.1] OpenAI API 키는 Vercel Serverless Function을 통해서만 사용한다

**상태**: 확정 (보안 원칙)

**결정 내용**: `VITE_OPENAI_API_KEY` 방식(프론트엔드 번들에 키 포함) 영구 폐기. Vercel Serverless Function이 키를 보관하고 중계.

**이유**:
- Vite 빌드 결과물은 브라우저에서 JS 소스를 직접 열람 가능 → API 키 노출.
- `VITE_` prefix 환경변수는 전부 번들에 포함됨.
- Serverless Function의 `process.env`는 서버 환경에서만 접근 가능.

**구현**:
- 프론트엔드: `VITE_BADGE_AI_ENDPOINT` (Function URL만, 키 없음)
- 서버: Vercel 대시보드 `OPENAI_API_KEY` 환경변수

---

## [v1.7.1] AI API는 기본 OFF로 운영한다

**상태**: 확정 (현재 정책)

**결정 내용**: `ENABLE_BADGE_AI_API = false`가 기본값. PM이 명시적으로 결정할 때만 `true`로 변경.

**이유**:
- 배지별 5개 로컬 메시지로 충분한 사용자 경험 제공 가능.
- AI API 비용을 사용자 규모 파악 전에 무제한 허용하면 예산 통제 불가.
- 인프라(Function, 환경변수, fallback 로직)는 이미 완성. 플래그 하나로 즉시 활성화 가능.

**활성화 조건**: PM이 DAU 기반 월간 예상 비용을 계산하고 승인한 이후.

**재검토 시점**: Play Store 정식 출시 후 1~2개월, 실사용자 데이터 확보 후.

---

## [v1.7.1] Vercel Serverless Function은 Node.js Runtime을 사용한다

**상태**: 확정

**결정 내용**: `api/badge-celebration.ts`에 `export const config = { runtime: 'edge' }` 미사용. 기본 Node.js Runtime 적용.

**이유**:
- Vercel Edge Runtime TypeScript 환경에서 `process` 타입이 지원되지 않아 `TS2591` 오류 발생.
- Node.js Runtime은 `process.env` 접근이 정상 동작.
- 배지 메시지 생성은 실시간 응답 속도보다 안정성이 중요. Edge의 낮은 레이턴시가 불필요.

---

## [v1.7.1] vercel.json은 rewrites 대신 routes를 사용한다

**상태**: 확정

**결정 내용**: SPA fallback과 API 라우팅을 `rewrites`가 아닌 `routes`로 분리.

**이유**:
- `rewrites`의 부정형 lookahead (`/((?!api/).*)`)가 Vercel의 path-to-regexp에서 신뢰할 수 없는 동작을 보임.
- `routes`는 위에서 아래로 순서대로 매칭 → `/api/(.*)`를 먼저 처리 후 나머지를 `index.html`로.

---

## 보류 중인 결정

### [보류] 감사 기록 검색 기능 추가 여부
- 검토 중. 기록이 많아지면 필요성 증가.
- 구현 방향: 클라이언트 사이드 전문 검색 (Fuse.js 등).

### [보류] AI 배지 메시지 활성화 시점
- 조건: 정식 출시 후 DAU × 평균 배지 획득 빈도 × OpenAI 단가 시뮬레이션 완료.

### [보류] iOS 앱 출시
- Capacitor iOS 플랫폼 추가로 기술적 장벽은 낮음.
- Apple Developer Program($99/년) 비용 및 심사 정책 검토 후 결정.

### [보류] 클라우드 백업 연동 (iCloud / Google Drive)
- 사용자 데이터 보호 원칙과 충돌 없음 (사용자 자신의 클라우드에 저장).
- 구현 복잡도 높음. 현재 JSON 파일 방식으로 충분.

---

## 폐기된 결정

### [폐기] VITE_OPENAI_API_KEY 방식
- **제안**: Vite 환경변수로 OpenAI API 키를 직접 주입.
- **폐기 사유**: 프론트엔드 번들 노출로 보안 위험. PM 명시적 금지.
- **대체**: Vercel Serverless Function 방식 (v1.7.1 확정).

### [폐기] Edge Runtime 사용
- **제안**: Vercel Edge Runtime으로 낮은 응답 레이턴시 확보.
- **폐기 사유**: `process` 타입 미지원으로 TypeScript 빌드 오류.
- **대체**: Node.js Runtime.
