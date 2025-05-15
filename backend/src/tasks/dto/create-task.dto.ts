import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    dueTime: Date

    @IsNotEmpty()
    @IsOptional()
    priority: string

}
