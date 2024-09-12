import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

const getHandler = async (req: NextRequest) => {
  const { data } = await axios.get(`${BACKEND_URL}/tx/`);
  return NextResponse.json({ tx: data });
};

export const GET = getHandler;
