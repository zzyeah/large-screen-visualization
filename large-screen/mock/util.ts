import fs from "fs";
import path from "path";

export default {
  getJsonFile: function (filePath: string) {
    const pathStr = path.resolve(__dirname, filePath);
    const json = fs.readFileSync(pathStr, "utf-8");
    // 解析并返回
    return JSON.parse(json);
  },
};
