import axiosClient from "./axiosClient";

export interface ExternalUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  companyName: string;
}

export async function getExternalUsers(): Promise<ExternalUser[]> {
  const response = await axiosClient.get("/external/users");
  return response.data.data;
}
