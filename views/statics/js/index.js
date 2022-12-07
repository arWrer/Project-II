// // import Dashboard from "./views/Dashboard.js";
// // import Post from "./views/Post.js";
// // import Settings from "./views/Settings.js";
// import {Routes} from "./views/routes.js";

// console.log(Routes);



// const navigateTo = (url) => {
//     history.pushState(null, null, url) //history.pushState 이게 뭔지 찾아보기
//     router();
// }

// const router = async () => {
//     //각 경로와 콘솔 출력 내용을 객체의 배열의 형태로 저장
//     // const routes = [
//     //     { path: "/", view: Dashboard},
//     //     { path: "/posts", view: Post},
//     //     { path: "/settings", view: Settings}
//     // ]

//     //map: 배열 각각의 값에 대해 주어진 동작 수행한 후 결과물을 새로운 배열로 저장
//     //
//     const potentialMatches = Routes.map(route => {
//         return {
//             route: route,
//             isMatch: location.pathname === route.path //route의 주소값과 현재 접속한 값이 동일한지 확인
//         }
//     })

//     //routes에 있는 값과 주소창의 값이 동일한 값을 찾아 match 변수에 대입
//     let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

//     //만약 일치하는 주소가 아닐 경우 동작하는 함수 -> 강제로 메인 페이지로 보내버림
//     if(!match) {
//         match = {
//             route: Routes[0],
//             isMatch: true
//         }
//     }

//     // const view = new match.route.view();

//     // document.querySelector("#app").innerHTML = await view.getHtml();
//     document.querySelector("#app").innerHTML = "<%- include ('" + match.route.name + "') %>";

//     // match.route.view()
// }

// //popstate 현재 창이 바뀔 때
// //router 함수 실행
// //브라우저에서 뒤로가기, 앞으로가기 기능 사용할 때 router 함수가 자동적으로 실행가능하게 하는 기능
// window.addEventListener("popstate", router);

// document.addEventListener("DOMContentLoaded", () => {
//     document.addEventListener("click", e => {
//         if(e.target.matches("[data-link]")) {//matches 함수 - CSS 속성이 일치하는 지 선택자 삽입하여 비교, data-link 속성 찾기
//             e.preventDefault();
//             navigateTo(e.target.href)
//         }
//     });
// });

// //potentialMatches 배열
// //ㄴisMatch
// //ㄴroute
// //  ㄴpath
// //  ㄴview