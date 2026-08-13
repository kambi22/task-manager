import axios from "axios";
import ApiError from "../utils/ApiError";

export interface ExternalUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  companyName: string;
}

export class ExternalService {
  /**
   * Fetches public user data from JSONPlaceholder API.
   * Demonstrates external API integration, timeout configuration, and error handling.
   */
  async getExternalUsers(): Promise<ExternalUser[]> {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users", {
        timeout: 5000, // 5 second timeout limit
        headers: {
          Accept: "application/json",
          "User-Agent": "TaskManagerApp/1.0",
        },
      });

      if (!Array.isArray(response.data)) {
        throw ApiError.internal("Unexpected response structure from external API");
      }

      // Process and normalize API response
      return response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone || "N/A",
        website: user.website || "N/A",
        companyName: user.company?.name || "Independent",
      }));
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        throw new ApiError(504, "External API request timed out (5s limit exceeded)");
      }
      if (error.response) {
        throw new ApiError(
          error.response.status,
          `External API failed with status ${error.response.status}: ${error.response.statusText}`
        );
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal(`Failed to reach external API: ${error.message || "Unknown error"}`);
    }
  }
}

export const externalService = new ExternalService();
