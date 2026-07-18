import prisma from "@/lib/client";
import { upsertUserSchema } from "@/zod/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const createUserValidationResponse = upsertUserSchema.safeParse(body);
        if(!createUserValidationResponse.success){
            return NextResponse.json({error: createUserValidationResponse.error.issues[0]?.message ?? "Invalid input"}, {status: 400})
        }
        const {email, username, password} = createUserValidationResponse.data;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail
            },
            select: {
                email: true
            }
        });
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const normalizedUsername = username.trim().toLowerCase();
        const dbUserName = normalizedUsername.charAt(0).toUpperCase() + normalizedUsername.slice(1);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: dbUserName
            }
        });
        return NextResponse.json({message: "User created successfully"}, {status: 200})
    } catch (error) {
        console.error("[signup] error:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }

}