import { NextResponse } from "next/server";
export async function POST(req: Request) {
    return NextResponse.json({ message: "Hello, Test Connection works successfully!" },{status: 200});
}







