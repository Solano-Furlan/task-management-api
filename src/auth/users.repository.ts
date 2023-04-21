import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.enitity';
import * as bcrypt from 'bcrypt';
import { SignUpCredentialsDto } from './dtos/sign-up-credentials.dto';

enum UsersErrorsCode {
  DuplicatedUser = '23505',
}

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { email, password }: SignUpCredentialsDto = signUpCredentialsDto;

    const salt: string = await bcrypt.genSalt();
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const user: User = this.create({
      email: email,
      password: hashedPassword,
    });
    try {
      await this.save(user);
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
    return this.findOneBy({ email: email });
  }

  async signIn(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
