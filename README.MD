## Assignment Point

안녕하세요, 과제 A안과 B안을 같이 작업했습니다.
NestJS로 백엔드를 구축했고
Expo로 프론트엔드를 구축했고, 전체적인 UI는 gluestack ui를 사용하여 작업했습니다. 
백엔드에서는 따로 DB를 연결하지 않고, json 파일을 통해 사용자 데이터를 저장했고, jwt를 통해 인증을 구성했습니다.
gitignore에 env를 포함하지 않는 것은 의도된 것입니다.

### 백엔드 (NestJS)
- DB 대신 `data/points.json`을 저장하여 사용하도록 했습니다.

#### API 명세
- `POST /auth/login`
  - Body: `{ email: string; password: string; }`
  - Response: `{ user: { id, email, name }, accessToken, refreshToken, sessionExpiresAt }`
  - 통과하면 세션 시작 시간을 기록한 뒤 액세스/리프레시 토큰 쌍을 return합니다.
- `POST /auth/refresh`
  - Body: `{ refreshToken: string; }`
  - Response: 로그인과 동일 구조
  - 설명: json의 해시와 비교해서 리프레시 토큰이 맞으면 새 토큰을 재발급하고 세션도 확인합니다.
- `POST /auth/logout`
  - Body: `{ refreshToken: string; }`
  - Response: `{ success: true }`
  - 설명: 통과하면 해시와 세션 시작시간을 비웁니다.
- `POST /api/earn`
  - Header: `Authorization: Bearer <access token>`
  - Body: `{ amount: number; description?: string; }`
  - Response: `{ balance: number }`
  - 설명: 적립합니다.
- `GET /api/balance`
  - Header: `Authorization: Bearer <access token>`
  - Response: `{ balance: number }`
  - 설명: 잔액을 return합니다.
- `GET /api/history`
  - Header: `Authorization: Bearer <access token>`
  - Response: `{ history: Array<{ userId, type: "earn", amount, description, createdAt }> }`
  - 설명: 해당 유저의 내역만 필터링해서 최신순으로 보여줍니다.

### 프론트엔드 (Expo)
- Expo, react query, zustand, axios, Gluestack ui를 사용했습니다.
- 에뮬레이터나 웹에서는 잘 작동했는데 expo go에서는 api 실행이 되지 않아 많이 찾아봤는데 lib/http.ts에서 expo-constants 를 사용해 hostUri를 감지하도록 했습니다. 
- auth 스토어가 토큰 저장/갱신/만료 타이머를 전부 관리해서 앱을 다시 열어도 SecureStore에 남은 리프레시 토큰으로 세션을 복구 합니다
- gluestack ui를 전반적으로 사용했고, 다른 프로젝트에서도 사용성을 높이기 위해 wrapper를 만들어 사용하는걸 선호합니다

### 실행방법

1. 백엔드
   cd backend
   npm i
   npm start
   
   서버 주소: http://localhost:8080

2. 프론트엔드
   cd frontend
   npm i
   npm start   

  localhost:8081로 web 작동 확인,
  a를 눌러 android를 띄우거나 expo go app으로 qr code scan하여 확인

### 테스트 계정
- 이메일: `demo@asd.com`
- 비밀번호: `1234`

