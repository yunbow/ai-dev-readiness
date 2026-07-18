# AI-Driven Development Readiness에 기여하기

관심을 가져 주셔서 감사합니다. 이 프로젝트에 대한 기여를 환영합니다.

## 기여 방법

### 버그 리포트 및 기능 요청

- [GitHub Issues](https://github.com/yunbow/ai-dev-readiness/issues)를 이용해 주세요
- 가능한 범위에서 재현 절차, 기대하는 동작, 실제 동작을 기재해 주세요

### Pull Request

1. 저장소를 Fork
2. 작업용 브랜치 생성
3. 변경 사항 반영
4. 변경 내용을 알 수 있는 커밋 메시지로 커밋
5. Pull Request 생성

### 개발 환경 설정

```bash
cd app
npm ci
npm run dev
```

### 제출 전 확인

Pull Request를 보내기 전에 다음이 모두 통과하는지 확인해 주세요.

```bash
cd app           # app 디렉터리로 이동
npm run build   # 타입 체크 + 빌드
npm run test    # 단위 테스트(Vitest)
```

진단 로직(`app/src/domain/assessment/`)을 변경하는 경우, `docs/design/01-scoring-spec.md`의 사양과의 정합성을 확인하고 필요에 따라 단위 테스트를 추가해 주세요.

### 다국어 지원(i18n)

UI 텍스트는 `app/src/i18n/locales/{ja,en,zh-CN,ko,es}.json`에서 관리합니다. 문구를 추가・변경할 경우 5개 언어 파일을 모두 동시에 업데이트해 주세요. 일본어(`ja.json`)가 번역의 기준입니다.

## 행동 강령

서로를 존중하며 건설적으로, 그리고 누구나 참여하기 쉬운 태도로 협력해 주세요.

---

Languages: [English](../../../CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | [简体中文](../zh-CN/CONTRIBUTING.md) | 한국어 | [Español](../es/CONTRIBUTING.md)
