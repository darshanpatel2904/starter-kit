import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  @Get('session')
  async getSession(@Session() session: UserSession) {
    return session;
  }

  @Get('me')
  async getMe(@Session() session: UserSession) {
    return session.user;
  }
}