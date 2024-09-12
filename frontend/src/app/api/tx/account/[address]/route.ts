import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

const getHandler = async (
  req: NextRequest,
  { params }: { params: { address: string } },
) => {
  const { address } = params;

  if (!address) {
    return NextResponse.json({ error: "Wrong args" }, { status: 400 });
  }

  const { data } = await axios.get(`${BACKEND_URL}/tx/address/${address}`);

  return NextResponse.json({ tx: data });
};

export const GET = getHandler;
