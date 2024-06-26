# Switter project (twitter clone)
![11](https://github.com/99yang/switter/assets/86218573/e424b7b8-c82f-42dd-ab6f-c0426a736c7e)

### 완 (로그인, 회원가입(이메일, 깃허브연동), 로그아웃)
### 미완 (게시판, 글 게시/읽기/업데이트/삭제, 댓글기능)
## Skills
### React + TypeScript + Firebase

## Settings

```
npm install
```
```
npm i react-router-dom@6.14.2
```
```
npm i styled-reset
```
```
npm i styled-components@6.0.7
```
```
npm i @types/styled-components -D
```
```
npm install firebase@10.1.0
```

## Git

git push 중 '[rejected] main -> main (fetch first) error: failed to push some refs to' 에러
원인: 깃의 원격저장소와 현재 로컬저장소가 동기화되어 있지 않기때문에 나타나는 문제이다.
해결: 원격저장소와 로컬저장소를 아래 코드로 동기화 시켜주면 된다.

```
git pull --rebase origin main
```

그런데, git clone도 원격 저장소의 프로젝트 내용을 가져오는 명령어인데 git pull과 무슨 차이가 있는 것일까?

git clone은 처음프로젝트에 투입될 때 사용돼야 한다. 로컬저장소의 내용이 원격 저장소의 내용과 일치해지기 때문이다.
git pull은 기존에 작업했던 내용은 유지하면서 최신 코드로 업데이트 할 수 있다. 단, 원격 저장소의 내용을 가져와서 현재 브랜치와 병합(merge)해주기 때문에 commit을 미리 하지 않으면 덮어쓰기 에러가 발생할 수 있다.
예를 들어, 원격 저장소의 메인브랜치에 작업내용 'a, b, c, d'가 있고 로컬저장소의 현재 작업브랜치엔 'c, e'를 작업해두었다면, git pull명령어를 사용했을때 메인브랜치에서 'a, b, c, d'을 가져왔음에도 c는 변경내용에 포함되지 않는다.
만약 c 내용이 메인브랜치와 작업브랜치에서 각각 다르다면 충돌이 발생한다. 이 때는 직접 충돌 처리를 해주어야 한다.



