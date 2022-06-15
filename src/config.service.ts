import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
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
            pass: this.getValue('MAIL_PASSWORD'),
            user: this.getValue('MAIL_USERNAME'),
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
}

const configService = new ConfigService(process.env).ensureValues([
    'MAIL_HOST',
    'MAIL_PASSWORD',
    'MAIL_USERNAME',
    'JWT_SECRET',
    'JWT_EXPIRE_IN'
]);

export { configService };
