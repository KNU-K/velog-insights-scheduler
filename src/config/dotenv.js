//require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "dev"}` });
require("dotenv").config({ path: `.env.${process.env.NODE_ENV || "local"}` });

module.exports = {
    GITHUB: {
        ID: process.env.GITHUB_ID,
        PASSWORD: process.env.GITHUB_PASSWORD,
    },
    VELOG: {
        NICKNAME: process.env.VELOG_NICKNAME,
    },
};
