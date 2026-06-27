# CLAUDE.md — 감사노트 프로젝트 클로 운영 규칙

> 이 파일은 클로(Claude)가 새 세션에서 자동으로 읽는 프로젝트 설정 파일입니다.  
> 모든 규칙은 채팅방이 바뀌어도 유지됩니다.

---

## 1. 프로젝트 기본 정보

```
앱 이름:    감사일기
패키지 ID:  com.cozybuilder.gratitudediary
GitHub:     https://github.com/cozybuilder/gratitude-note.git
Vercel:     https://gratitude-note-theta.vercel.app
로컬 경로:  C:\projects\gratitude-note
```

---

## 2. 새 세션 시작 시 필수 확인 순서

작업 시작 전 반드시 아래 순서로 문서를 확인합니다.

1. `docs/PROJECT_OVERVIEW.md` — 현재 상태 파악
2. `docs/감사노트 프로젝트 운영체계.md` — 핵심 원칙·제약사항
3. `docs/DECISIONS.md` — 기존 의사결정 맥락
4. `docs/CHANGELOG.md` — 최신 버전 이력

확인 전에는 코드 수정을 시작하지 않습니다.

---

## 3. 완료 보고 형식 규칙

모든 완료 보고는 **하나의 코드블록** 안에 아래 형식으로 작성합니다.  
상세 규칙: `docs/REPORTING_RULES.md`

````text
━━━━━━━━━━━━━━━━━━
클로 → 코비 완료 보고
작업명: [작업명]
━━━━━━━━━━━━━━━━━━

① 수정 파일

② 추가 파일

③ 삭제 파일

④ 변경 이유

⑤ 검증 결과

⑥ 커밋 해시

⑦ push 성공 여부

⑧ 다음 작업 필요 여부
━━━━━━━━━━━━━━━━━━
````

---

## 4. 절대 변경 금지 항목

```
localStorage 키: gratitude_notes, gratitude_achievements, theme_mode, onboarding_done
Android appId:   com.cozybuilder.gratitudediary
함수:            generateAiMessage() 수정 금지
환경변수:        VITE_OPENAI_API_KEY 사용 금지 (프론트엔드 번들에 API 키 포함 금지)
보안:            키스토어 파일 / 비밀번호 Git 커밋 금지
파일:            api/badge-celebration.ts, vercel.json 삭제 금지
```

---

## 5. 기능 완료 후 문서 반영 검토

완료 보고 코드블록 아래에 반드시 아래 항목을 추가합니다.

```
### 문서 반영 여부
- CHANGELOG.md: Yes / No (사유: )
- DECISIONS.md: Yes / No (사유: )
- PROJECT_OVERVIEW.md: Yes / No (사유: )
- RELEASE_CHECKLIST.md: Yes / No (사유: )
- MEMORY.md: Yes / No (사유: )
```

문서 반영 검토가 끝나지 않으면 작업 완료로 간주하지 않습니다.

---

## 6. 전체 운영 규칙 참조

- 운영 규칙 전문: `docs/OPERATION_RULES.md`
- 보고 형식 상세: `docs/REPORTING_RULES.md`
- 출시 체크리스트: `docs/RELEASE_CHECKLIST.md`
- 현재 상태: `docs/STATUS.md`
