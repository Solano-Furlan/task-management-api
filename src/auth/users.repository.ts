import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.enitity';
import * as bcrypt from 'bcrypt';
import { SignUpCredentialsDto } from './dtos/sign-up-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';

enum UsersErrorsCode {
  DuplicatedUser = '23505',
}

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {}
  async createUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { email, password }: SignUpCredentialsDto = signUpCredentialsDto;

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user: User = this.userEntityRepository.create({
      email: email,
      password: hashedPassword,
    });
    try {
      await this.userEntityRepository.save(user);
    } catch (error) {
      if (error.code === UsersErrorsCode.DuplicatedUser) {
        throw new ConflictException(
          'There is already an account with this email',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  getUserByEmail(email: string): Promise<User> {
    return this.userEntityRepository.findOneBy({ email: email });
  }

  async signIn(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
