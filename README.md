# MERN Calendar App

이 프로젝트는 **MERN 스택 (MongoDB, Express, React, Node.js)** 기반의 개인 캘린더 웹 애플리케이션입니다.  
사용자는 일정을 추가, 수정, 삭제할 수 있으며 JWT 기반 인증 시스템을 포함하고 있습니다.

---
## 프로젝트 구조
```
calendar-app/
├─ nodeJs-calendar/ # 백엔드 (Express + MongoDB)
│ ├─ controllers/ # 요청 로직 처리
│ ├─ models/ # Mongoose 스키마 정의
│ ├─ routes/ # API 라우팅
│ ├─ database/ # MongoDB 연결 설정
│ ├─ middlewares/ # 인증 미들웨어 등
│ ├─ index.js # 서버 진입 파일
│ ├─ package.json
│ └─ .env # 환경 변수 파일 (직접 생성 필요)
│
└─ react-calendar-mern/ # 프론트엔드 (React + Vite)
├─ src/
├─ package.json
└─ ...
```
---

## 환경 변수 설정 (.env)

> 주의: `.env` 파일은 **프로젝트 실행에 필수**이지만, 보안상의 이유로 깃허브에는 업로드하지 않습니다.  
> 직접 `nodeJs-calendar` 폴더 안에 `.env` 파일을 생성하세요.  

아래는 예시입니다.

```env
PORT=4000
DB_CNN=mongodb://localhost:27017/mern_calendar
SECRET_JWT_SEED=your-secret-key
FRONTEND_URL=http://localhost:3000
PUBLIC_APP_ORIGIN=http://localhost:3000

각 항목 설명:
- PORT → 백엔드 서버가 실행될 포트 번호 (기본값: 4000)
- DB_CNN → MongoDB 연결 주소 (로컬 환경에서는 localhost 사용)
- SECRET_JWT_SEED → JWT 토큰 암호화를 위한 비밀 키
- FRONTEND_URL / PUBLIC_APP_ORIGIN → React 프론트엔드가 실행되는 주소
```

---

##실행 방법
1) 백엔드 (Node.js 서버)
cd nodeJs-calendar
npm install
npm run dev

2) 프론트엔드 (React 클라이언트)
cd react-calendar-mern
npm install
npm run dev

이후 브라우저에서 http://localhost:3000 접속하면 캘린더 페이지가 표시됩니다.

사용된 주요 기술:
| 구분 | 기술 |
|------|------|
| Frontend | React, Vite, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Token) |
| Etc | bcryptjs, dotenv, SweetAlert2 |
---
