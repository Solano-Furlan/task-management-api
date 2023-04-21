import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInCredentialsDto } from './dtos/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dtos/sign-up-credentials.dto';
import { AccessToken } from './entities/access-token.entity';

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.authService.signUp(signUpCredentialsDto);
  }

  @Post('/sign-in')
  @HttpCode(200)
  signIn(
    @Body() signInCredentialsDto: SignInCredentialsDto,
  ): Promise<AccessToken> {
    return this.authService.signIn(signInCredentialsDto);
  }
}
