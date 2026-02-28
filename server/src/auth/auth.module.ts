import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import googleConfig from './config/google.config';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'default_secret',
      signOptions: { expiresIn: '10m' },
    }),
    ConfigModule.forFeature(googleConfig),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule { }
