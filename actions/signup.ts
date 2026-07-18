import { api } from "@/lib/api";
import { SignupResponse } from "@/interfaces/auth";

export async function signup(username: string, email: string, password: string): Promise<SignupResponse>{
    const response = await api.post<SignupResponse>("/auth/signup", {
        username,
        email,
        password
    });
    return response.data
}