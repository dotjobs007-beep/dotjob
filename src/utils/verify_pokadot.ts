import axios from "axios";
import AppError from "./appError";
import { IdentityInfo } from "../interface/user.interface";

const SUBSCAN_API = "https://polkadot.api.subscan.io/api/v2/scan/search";
const API_KEY = process.env.SUBSCAN_API_KEY as string; // 👈 Put your key in .env

export async function checkIdentitySubscan(address: string) {
  const response = await axios.post(
    SUBSCAN_API,
    { key:address },
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
    }
  );

  const data = await response.data;
  if (!data) throw new AppError("oops! something went wrong, please try again", 500)
    const identity: IdentityInfo = data?.data.account.account_display.people
    return identity
}
