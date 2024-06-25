const puppeteer = require("puppeteer");
const jsonProcessor = require("../utils/json-processor");

async function authenticateOauth(page, provider, velog_nickname, github) {
    try {
        console.log(github, velog_nickname);
        await page.goto(`https://velog.io/@${velog_nickname}/posts`, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(
            "body > div > div.BasicLayout_block__6bmSl > div.responsive_mainResponsive___uG64 > main > div > section > div.VelogPosts_block__nfCQF > div.FlatPostCardList_block__VoFQe "
        );

        await page.click("body > div > div.BasicLayout_block__6bmSl > div.responsive_mainResponsive___uG64 > header > div > div.Header_right__IaiY4 > button");
        const result = await page.$(
            "body > div > div.Modal_backdrop__JxQ1v.keyframes_fadeIn__9Emp7 > div > div.AuthModal_white-block__SuoSm > div.AuthModal_block-content__3Dk7K > div > div.AuthForm_upper-warepper__r7h_t > section:nth-child(3) > div > a"
        );
        const href = await page.evaluate((el) => el.href, result); // 페이지에서 첫 번째 단락의 텍스트를 가져오기 위해 XPath를 사용합니다.
        await page.goto(href, { waitUntil: "domcontentloaded" });

        // 로그인 폼 채우기
        await page.type("#login_field", github.ID);
        await page.type("#password", github.PASSWORD);
        await page.click("#login > div.auth-form-body.mt-3 > form > div > input.btn.btn-primary.btn-block.js-sign-in-button");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    } catch (err) {
        throw err;
    }
}
async function scrollPageToBottom(page) {
    let lastHeight = await page.evaluate("document.body.scrollHeight");

    await new Promise((resolve) => setTimeout(resolve, 3000));
    while (true) {
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let newHeight = await page.evaluate("document.body.scrollHeight");
        if (newHeight === lastHeight) {
            break;
        }
        lastHeight = newHeight;
    }
}
async function run(velog_nickname, github) {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    try {
        await authenticateOauth(page, "github", velog_nickname, github);
        await scrollPageToBottom(page);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await page.waitForSelector(
            "body > div > div.BasicLayout_block__6bmSl > div.responsive_mainResponsive___uG64 > main > div > section > div.VelogPosts_block__nfCQF > div.FlatPostCardList_block__VoFQe "
        );

        const detailOfBoardList = await page.evaluate(() => {
            const boards = document.querySelector(
                "body > div > div.BasicLayout_block__6bmSl > div.responsive_mainResponsive___uG64 > main > div > section > div.VelogPosts_block__nfCQF > div.FlatPostCardList_block__VoFQe"
            );
            const boardList = boards.childNodes;
            const detailOfBoardList = [];
            for (let board of boardList) {
                const title = board.childNodes[0].textContent ? board.childNodes[0].textContent : board.childNodes[1].textContent;
                detailOfBoardList.push({ detailOfBoard: board.childNodes[0].href, title: title });
            }
            return detailOfBoardList;
        });
        const velogInfoBySelf = new Array();
        for (const { detailOfBoard, title } of detailOfBoardList) {
            console.log(title);
            console.log("start");
            await page.goto(detailOfBoard, { waitUntil: "domcontentloaded" });

            await new Promise((resolve) => setTimeout(resolve, 1000)); // 페이지가 완전히 로드될 때까지 대기

            await page.click("#root > div.sc-dPiLbb.sc-bBHHxi.kTIDXm > div.sc-TBWPX.dXONqK.sc-jQrDum.fiOuRZ > div > div.sc-GEbAx.eRBiqJ > button:nth-child(1)");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 클릭 후 대기
            const point = await page.evaluate(() => {
                const pointTag = document.querySelector("#root > div.sc-dPiLbb.jGEmDy.sc-dSfdvi.jyyAFg > main > div > div.sc-jKTccl.dfeAWs");

                const pointList = pointTag.childNodes;
                const savePoint = {
                    hit: { 전체: pointList[0].childNodes[1].textContent, 오늘: pointList[1].childNodes[1].textContent, 어제: pointList[2].childNodes[1].textContent },
                };

                return savePoint;
            });
            point.href = detailOfBoard;
            point.title = title;
            velogInfoBySelf.push(point);
        }
        await jsonProcessor.save(velogInfoBySelf);
        return velogInfoBySelf;
    } catch (error) {
        console.error("크롤링 중 오류 발생:", error);
    } finally {
        await browser.close();
    }
}
module.exports = { getVelogHitLog: run };
