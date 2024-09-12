import { AxiosError } from "axios";

export function getErrorMessage(error: any) {
  let errorMessage = "Internal server error";
  if (error instanceof AxiosError) {
    errorMessage = `${error.response?.status} - ${error.response?.data.error}`;
  }
  return errorMessage;
}
