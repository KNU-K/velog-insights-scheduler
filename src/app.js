// index.js

const schedule = require("node-schedule");
const velogCrawler = require("./jobs/velog-crawler");
const { GITHUB } = require("./config/dotenv");

// 주기적인 스케줄링 설정
const rule = new schedule.RecurrenceRule();
rule.hour = 12;
rule.minute = 0;

// 스케줄링 설정
const job = schedule.scheduleJob(rule, async function () {
    try {
        console.log("Starting Velog crawling job...");
        const velogData = await velogCrawler.getVelogHitLog(GITHUB.ID, GITHUB.PASSWORD);
        console.log("Velog crawling job completed successfully.");
        console.log("Velog data:", velogData);
        // 크롤링 데이터를 여기에서 처리하거나 저장할 수 있습니다.
    } catch (error) {
        console.error("Error during Velog crawling job:", error);
    }
});

console.log("Scheduled Velog crawling job to run daily at 3:04 AM.");
