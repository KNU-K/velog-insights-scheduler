const fs = require("fs");
const { save } = require("../../src/utils/json-processor");

jest.mock("fs");

describe("save function", () => {
    it("should save JSON data to a file", async () => {
        // 모킹된 fs.writeFile 함수 설정
        fs.writeFile.mockImplementation((filename, data, callback) => {
            callback(null); // 테스트용으로 항상 성공하도록 설정
        });

        const testData = {
            name: "John Doe",
            age: 30,
            email: "john.doe@example.com",
            isStudent: false,
            courses: [
                {
                    name: "Mathematics",
                    grade: "A",
                },
                {
                    name: "Science",
                    grade: "B+",
                },
            ],
        };

        // save 함수 호출
        await save(testData);

        const expectedFileName = expect.stringMatching(/^data\/\d{4}-\d{2}-\d{2}\.json$/);
        // 파일 이름이 예상된 형식과 일치하는지 확인
        expect(fs.writeFile).toHaveBeenCalledWith(expectedFileName, expect.any(String), expect.any(Function));
    });
});
