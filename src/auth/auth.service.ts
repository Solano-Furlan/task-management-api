import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInCredentialsDto } from './dtos/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dtos/sign-up-credentials.dto';
import { AccessToken } from './entities/access-token.entity';
import { JwtPayload } from './entities/jwt-payload.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(signUpCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<AccessToken> {
    const { email, password }: SignInCredentialsDto = signInCredentialsDto;

    const user = await this.usersRepository.getUserByEmail(email);

    if (user && (await this.usersRepository.signIn(user, password))) {
      const jwtPayload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(jwtPayload);
      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }
}
