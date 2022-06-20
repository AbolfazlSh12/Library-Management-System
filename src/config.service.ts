import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue = (key: string, throwOnMissing = true): string => {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }
        return value;
    };

    public ensureValues = (keys: string[]) => {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    };

    private getMailHost = (): string => {
        return this.getValue('MAIL_HOST');
    };

    public getMailAuth = (): { user: string; pass: string } => {
        return {
            user: this.getValue('MAIL_USERNAME'),
            pass: this.getValue('MAIL_PASSWORD'),
        };
    };

    public getMailConfig = () => {
        return {
            host: this.getMailHost(),
            secureConnection: true,
            port: 465,
            auth: this.getMailAuth(),
        };
    };

    public getJwtConfig = (): JwtModuleOptions => {
        return {
            secret: this.getValue('JWT_SECRET', true),
            signOptions: {
                expiresIn: this.getValue('JWT_EXPIRE_IN', false) || '60m',
            },
        };
    };

    public getOwnerAuth = (): { username: string; password: string } => {
        return {
            username: this.getValue('OWNER_USERNAME'),
            password: this.getValue('OWNER_PASSWORD'),
        };
    };
}

const configService = new ConfigService(process.env).ensureValues([
    'MAIL_HOST',
    'MAIL_USERNAME',
    'MAIL_PASSWORD',
    'OWNER_USERNAME',
    'OWNER_PASSWORD',
    'JWT_SECRET',
    'JWT_EXPIRE_IN'
]);

export { configService };
