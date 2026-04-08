import fs from "fs";
import type { NextRequest } from "next/server";
import path from "path";

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const id = params.get("id");

  const filePath = path.join(`src/resources/swagger-ui/${id}/swagger.yaml`);
  console.log("yaml file path: ", filePath);
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch (e) {
    console.error("Got error on endpoint", e);
    return new Response(`Not Found`, {
      status: 404,
    });
  }

  // ファイルの内容を読み込む
  try {
    const file = fs.readFileSync(filePath, "utf8");

    return new Response(file, {
      status: 200,
    });
  } catch (e) {
    console.error("Got error on endpoint", e);
    return new Response(`Got unexpected error`, {
      status: 500,
    });
  }
}
