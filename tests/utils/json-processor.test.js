const fs = require("fs");
const { save } = require("../../src/utils/json-processor");
jest.mock("fs");

describe("save function", () => {
    beforeEach(() => {
        fs.writeFile.mockClear();
    });

    it("should save data to a JSON file", async () => {
        const mockData = { foo: "bar" };

        fs.writeFile.mockImplementation((fileName, data, callback) => {
            expect(fileName).toMatch(/^data\/\d{4}-\d{2}-\d{2}\.json$/);

            const parsedData = JSON.parse(data);
            expect(parsedData).toEqual(mockData);

            callback(null);
        });

        await save(mockData);
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
    });

    it("should handle error when saving file", async () => {
        const mockData = { foo: "bar" };

        fs.writeFile.mockImplementation((fileName, data, callback) => {
            callback(new Error("Mock writeFile error"));
        });
        jest.spyOn(console, "error").mockImplementation(() => {});

        await save(mockData);
        expect(console.error).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        console.error.mockRestore();
    });
});
