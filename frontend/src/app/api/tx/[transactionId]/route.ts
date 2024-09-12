import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

const getHandler = async (
  req: NextRequest,
  { params }: { params: { transactionId: string } },
) => {
  const { transactionId } = params;
  const { data } = await axios.get(`${BACKEND_URL}/tx/${transactionId}`);
  return NextResponse.json({ tx: data });
};

export const GET = getHandler;
