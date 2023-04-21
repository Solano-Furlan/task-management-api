import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(70)
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least 1 lower case letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least 1 upper case letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least 1 numeric character',
  })
  @Matches(/(?=.*\W)/, {
    message: 'Password must contain at least 1 special character',
  })
  password: string;
}
