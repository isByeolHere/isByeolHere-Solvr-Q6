### 당신의 수면 패턴을 기록하고 관리하세요

<img width="885" alt="스크린샷 2025-06-06 오후 3 32 23" src="https://github.com/user-attachments/assets/463ece21-1e19-4970-b7a5-051d3898de92" />


## 프로젝트 개요

- **목적**: 사용자가 일일 수면 시간, 기분, 만족도 등을 기록하고 추적하여 건강한 수면 습관을 형성하도록 돕습니다.
- **주요 기능**: 수면 기록 추가, 목록 조회, 상세 보기, 수정, 삭제, 통계, AI조언


## 화면 구성

<!-- 애플리케이션의 주요 화면 스크린샷을 넣어주세요. -->
<img width="600" alt="스크린샷 2025-06-06 오후 3 15 26" src="https://github.com/user-attachments/assets/db3fc2c5-310e-4c89-81ea-2f8e5c28e184" />
<img width="600" alt="스크린샷 2025-06-06 오후 3 32 33" src="https://github.com/user-attachments/assets/6ea33038-3662-416b-96a8-de67a993a12b" />

<br>

## 주요 기능

#### 📝 수면 기록 추가

- 날짜, 수면 시간, 기분, 수면 만족도 등을 기록합니다.

#### ✏️🗑️ 수면 기록 수정/삭제

- 이미 저장된 기록의 내용을 수정/삭제합니다.

#### 📊 통계

- 수면 기록을 바탕으로 통계를 제공합니다.
  
#### 🎤 AI 조언 

- 수면 기록을 바탕으로 수면 조언을 제공합니다.

<br>

## 서비스 업데이트 내역

### Task 3: AI 수면 조언 기능 추가

- Gemini API를 활용한 AI 수면 조언 기능 구현

### Task 2: 수면 기록 통계 기능 추가

- 수면 기록 통계 페이지 추가
  - 최근 7일간의 수면 점수 그래프
  - 월별 평균 수면 시간 및 만족도 차트
- 더미 데이터 생성 스크립트 추가

### Task 1: 수면 기록 CRUD 기능 구현

- 수면 기록 생성, 조회, 수정, 삭제 기능 구현
- SQLite 데이터베이스 연동
- 수면 기록 목록 페이지 구현
- 수면 기록 추가/수정 폼 구현

## 🛠 Stacks

#### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CC0000?style=for-the-badge&logo=react-router&logoColor=white)

#### Backend

![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

#### Database

<!-- SQLite 또는 다른 DB로 변경될 예정 -->

![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

#### Common

![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

#### Environment

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

<br>

## 설치 및 실행

### 초기 설치

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm install
```

### 환경 변수 설정

서버 디렉토리 (`server/`)에 `.env` 파일을 생성하고 다음 내용을 추가합니다.

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
# 데이터베이스 URL (SQLite 사용 시)
# DATABASE_URL=./data/sleep.db
# 필요에 따라 CORS ORIGIN 설정
# CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

클라이언트 디렉토리 (`client/`)에도 필요한 경우 `.env` 파일을 설정할 수 있습니다 (예시는 `client/.env.example` 참조).

### 개발 서버 실행

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm dev

# 클라이언트만 실행
pnpm dev --filter client

# 서버만 실행
pnpm dev --filter server
```

### 테스트 실행

```bash
# 모든 테스트 실행
pnpm test

# 클라이언트 테스트
pnpm test --filter client

# 서버 테스트
pnpm test --filter server
```

### 빌드

```bash
# 프로젝트 루트 디렉토리에서 실행
pnpm build
```

<br>
