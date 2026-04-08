import fs from "fs";
import type { NextRequest } from "next/server";
import path from "path";

const apiHost = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const templatePath = path.join("src/resources/swagger-ui/index.html");

export function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const id = params.get("id") || "";

  const filePath = path.join(process.cwd(), templatePath);
  // ファイルの内容を読み込む
  try {
    const template = fs.readFileSync(filePath, "utf8");
    const body = template.replace("{{host}}", apiHost).replace("{{id}}", id);

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (e) {
    console.error("Got error on endpoint", e);
    return new Response(`Not Found`, {
      status: 404,
    });
  }
}
