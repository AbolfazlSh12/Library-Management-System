export class ResetPasswordDto {
    public readonly email: string;
    public readonly code: number;
    public readonly password: string;
}