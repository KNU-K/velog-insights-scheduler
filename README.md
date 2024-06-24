# velog insights scheduler

tistory나 다른 블로그는 조회수나 좋아요 등에 따른 통계 대시보드가 존재하지만, velog는 그런 부분이 존재하지않는다. 현재 velog의 `robots.txt` 확인 결과 crawling이 허용이 되어있어서 `puppeteer` 와 `node-schedule` 을 활용하여 블로그 작성자에게 다양한 insight를 제공하는 것을 목적으로 하고 있다.

#

-   node

    -   scheduler
        -   velog 조회수 통계
        -   좋아요
        -   댓글 수집

-   next.js
    -   dashboard
        -   INSIGHTS를 보고 현재 블로그의 상태에 대한 점검이 가능 하도록함.
