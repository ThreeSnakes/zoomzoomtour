## Description

줌줌투어 과제 repository

## Installation

```bash
$ npm install
```

## Running the app

- 기본적으로 해당 서버는 `docker-compose`로 실행하는 것을 추천드립니다.
  - `docker-compose`로 실행하는 경우 테스트용 데이터가 삽입됩니다. 만약 `appserver`만 실행 시키는 경우 `./volume/init.sql`을 확인하시면 테스트용 데이터 삽입 쿼리를 확인할 수 있습니다.
  - `docker-compose`로 실행하지 않는 경우 `.env` 파일에서 접속 정보를 변경 부탁드립니다.

```bash
## 실행 Docker 이용 // appServer, redis, mysql 동시에 실행됨.
docker-compose up --force-recreate

## server 단독 실행
## .env 에서 Redis, Mysql 접속 정보를 수정한뒤 실행해야 합니다.
npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Doc

- 서버 실행 후 다음으로 접속하시면 Swagger Page를 보실 수 있습니다.
- [apidoc link](http://localhost:3001/apidoc)