import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/ispublic.decorator';

/**
 * Jwt Authorization Guard : checks if a user is authenticated or not blocking access to routes
 * needing Authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Injection of NestJs Core's Reflector : To get Classes Metadata
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Uses Reflector to get Class Metadata and looks for the IS_PUBLIC_KEY key;
    // If Found, the value associated will be set to true; check decorator: Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // User is not retrieved from JWT Token yet

    // If Public no need for Authentication
    if (isPublic) {
      return true;
    }
    // The canActivate Method of AuthGuard will, after injected with a PassportStrategy,
    // use that strategy to verify the user and add it to the request
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
