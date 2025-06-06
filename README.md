
### 당신의 수면 패턴을 기록하고 관리하세요

</div>
<br><br>

## 프로젝트 개요

- **목적**: 사용자가 일일 수면 시간, 기분, 만족도 등을 기록하고 추적하여 건강한 수면 습관을 형성하도록 돕습니다.
- **주요 기능**: 수면 기록 추가, 목록 조회, 상세 보기, 수정, 삭제
  <br>

|                       김 별                       |
| :-----------------------------------------------: | ---------------------------------- |
| <img src="[YOUR_PROFILE_IMAGE_URL]" width="150"/> |
|  [@Bell-isHere](https://github.com/Bell-isHere)   | <!-- 사용자 GitHub 링크로 변경 --> |
|      <p align="left">- 프로젝트 구현 및 개발      |

<br>

## 화면 구성

<!-- 애플리케이션의 주요 화면 스크린샷을 넣어주세요. -->
<img src="[YOUR_SCREENSHOT_IMAGE_URL]" width="600"/>

<br>

## 주요 기능

#### 📝 수면 기록 추가

- 날짜, 수면 시간, 기분, 수면 만족도 등을 기록합니다.

#### 📊 수면 기록 목록 조회

- 저장된 수면 기록 목록을 최신순으로 확인합니다.

#### ✏️ 수면 기록 수정

- 이미 저장된 기록의 내용을 수정합니다.

#### 🗑️ 수면 기록 삭제

- 더 이상 필요 없는 기록을 삭제합니다.

<br>


## 서비스 업데이트 내역

### Task 2: 수면 통계 기능 추가

-   **새 기능 추가:**
    *   사용자의 수면 기록을 바탕으로 통계 정보를 제공하는 기능이 추가되었습니다.
    *   최근 수면 점수 변화를 보여주는 그래프 화면이 추가되었습니다.
    *   최근 1개월간의 평균 수면 시간 및 평균 수면 점수를 확인할 수 있습니다.
-   **개선 사항:**
    *   테스트 및 개발을 돕기 위한 더미 수면 기록 생성 스크립트(`server/scripts/generateDummyData.ts`)가 추가되었습니다.
-   **버그 수정:**
    *   수면 기록 조회, 추가, 수정 기능 사용 중 발생했던 데이터베이스 스키마 불일치, 쿼리 매개변수 바인딩 오류, 클라이언트 모듈 임포트 오류 등이 수정되어 전반적인 안정성이 개선되었습니다.


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

## API 엔드포인트

서버는 `/api` 프리픽스로 다음 API 엔드포인트를 제공합니다:

- `GET /api/sleep-records?userId={userId}`: 수면 기록 목록 조회
- `GET /api/sleep-records/:id`: 특정 수면 기록 조회
- `POST /api/sleep-records`: 새 수면 기록 추가
- `PUT /api/sleep-records/:id`: 수면 기록 수정
- `DELETE /api/sleep-records/:id`: 수면 기록 삭제

<br>
