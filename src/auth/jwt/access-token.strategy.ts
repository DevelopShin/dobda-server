import { UsersRepository } from '../../users/users.repository';
import { JwtPayload } from './types/jwt.payload';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { jwtExtractorFromCookies } from './jwtExtractorFromCookies';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

// guard -> strategy -> validate
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      //jwtExtractorFromCookies 라는 함수에서 Cookie의 존재 여부 확인.
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    try {
      const user = await this.usersRepository.findUserByEmail(payload.email);
      if (user) {
        return user;
      } else {
        throw new Error('해당하는 유저는 없습니다.');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
