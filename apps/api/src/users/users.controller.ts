import {
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiCookieAuth('better-auth.session_token')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get('session')
  @ApiOperation({ summary: 'Get current user session' })
  @ApiResponse({ status: 200, description: 'Active session metadata.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSession(@Session() session: UserSession) {
    return session;
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(@Session() session: UserSession) {
    return session.user;
  }
}