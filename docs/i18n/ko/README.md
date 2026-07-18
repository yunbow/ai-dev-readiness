# AI 주도 개발 도입 진단(AI-Driven Development Readiness)

[![Lint & Link Check](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml/badge.svg)](https://github.com/yunbow/ai-dev-readiness/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../../LICENSE)

**데모:** https://yunbow.github.io/ai-dev-readiness/

개발 조직·프로젝트 담당자가 간단한 설문에 답하는 것만으로 AI 주도 개발에 대한 준비 상태를 시각화하는 정적 웹 애플리케이션입니다.

- **AI 주도 개발 점수**(100점 만점・5개 축)
- **AI 도입 레벨**(Level 1〜5)
- **AI 활용을 통한 예상 개발 공수 절감률**(범위 표시・상한 45%)
- 공정별 AI 적합도 / 강점 / 우선 개선 과제 / 도입 로드맵
- 점수 이미지를 첨부한 SNS 공유

응답 내용과 진단 결과는 브라우저 내(LocalStorage / IndexedDB)에서만 처리되며, **외부로 전송되지 않습니다**. 로그인 불필요・무료입니다.

## 기술 스택

TypeScript / React 19 / Vite 8 / Tailwind CSS 4 / shadcn/ui / React Router(HashRouter)/ idb / html-to-image / Vitest

## 개발

```bash
cd app            # app 디렉터리로 이동
npm ci            # 의존성 설치
npm run dev       # 개발 서버 실행
npm run test      # 진단 로직 단위 테스트(Vitest)
npm run build     # 타입 체크 + 프로덕션 빌드(dist/)
npm run preview   # 빌드 결과 미리보기
```

### E2E 스모크 테스트

```bash
cd app
npx playwright install chromium   # 최초 1회만
npm run build && npm run preview  # 다른 터미널에서 실행(포트 4173)
node tests/e2e-smoke.mjs
```

## 배포(GitHub Pages)

`main` 브랜치로 push하면 `.github/workflows/deploy.yml`이 테스트→빌드→GitHub Pages 배포 순으로 실행됩니다.
저장소의 **Settings → Pages → Build and deployment → Source를 "GitHub Actions"**로 설정해 주세요.
HashRouter와 상대 경로 `base: "./"`를 사용하므로 저장소 이름에 관계없이 동작합니다.

## 디렉터리 구조

```text
app/src/
├─ app/             라우팅・공통 레이아웃
├─ pages/           6개 화면(홈/진단 선택/응답/결과/히스토리/About)
├─ components/      assessment / result / share / charts / ui(shadcn)
├─ domain/
│  ├─ assessment/   진단 엔진(질문・채점・절감률・공정 적합도・개선 제안) ※React 비의존・단위 테스트 대상
│  └─ history/      히스토리 레코드 타입
├─ infrastructure/  localStorage / IndexedDB / PNG 이미지 생성
├─ hooks/ lib/ constants/
docs/design/        구현 사양서(채점 사양・UI 사양・개선 제안 카탈로그)
```

## 진단 로직

- 평가 축: 문서·형식지화 25점 / 개발 프로세스 25점 / 품질 보증 20점 / AI 이용 체계 15점 / 프로젝트 적합성 15점
- 결정론적 규칙 기반 채점(동일한 응답에는 동일한 결과)
- Git 미사용 등 중대한 결여 항목에는 종합 점수 상한 제어 있음
- 자세한 내용은 `docs/design/01-scoring-spec.md` 참조

## 유의 사항

진단 결과는 설문 응답에 기반한 추정치입니다. 실제 절감 효과는 시스템 규모, 기술 부채, 구성원의 역량, AI 도구, 보안 요구사항, 도입 범위 등에 따라 달라집니다.

---

Languages: [English](../../../README.md) | [日本語](../ja/README.md) | [简体中文](../zh-CN/README.md) | 한국어 | [Español](../es/README.md)
