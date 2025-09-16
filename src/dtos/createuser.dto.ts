import { IsEmail, IsNotEmpty, MinLength, Matches } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Name is required" })
  @Matches(/^[A-Za-z\s]+$/, {
    message: "Name must only contain letters and spaces",
  })
  @MinLength(3, {message:"Name must be more than three characters"})
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  email!: string;

  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}
