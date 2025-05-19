import { IsEmail, IsNotEmpty } from "class-validator";

export class ResetPassDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    OTP: string;

    @IsNotEmpty()
    newPassword: string;
}