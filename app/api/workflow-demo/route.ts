import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Simulated workflow execution started successfully.",
      executionId: "exec_placeholder_id",
      receivedData: body
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }
}
