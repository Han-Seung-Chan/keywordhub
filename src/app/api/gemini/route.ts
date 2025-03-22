// src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API 키가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    // 모델명을 gemini-pro에서 gemini-2.0-flash로 변경
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API 오류 응답:", errorBody);

      return NextResponse.json(
        { error: `Gemini API 오류: ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API 처리 중 오류:", error);
    return NextResponse.json(
      { error: "Gemini API 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
