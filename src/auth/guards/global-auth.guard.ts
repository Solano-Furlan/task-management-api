import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

// @Injectable()
// export class GlobalAuthGuardd
//   extends AuthGuard('internal')
//   implements CanActivate
// {
//   constructor(private readonly reflector: Reflector) {
//     super({
//       secretOrKey: process.env.JWT_SECRET,
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     });
//   }

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const isPublic =
//       this.reflector.get(IS_PUBLIC_KEY, context.getHandler()) ||
//       this.reflector.get(IS_PUBLIC_KEY, context.getClass());
//     if (isPublic) {
//       return true;
//     }
//   }
// }

@Injectable()
export class GlobalAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean =
      this.reflector.get(IS_PUBLIC_KEY, context.getHandler()) ||
      this.reflector.get(IS_PUBLIC_KEY, context.getClass());
    if (isPublic) {
      return true;
    }

    const isJwtTokenValid: boolean = (await super.canActivate(
      context,
    )) as boolean;
    return isJwtTokenValid;
  }
}
