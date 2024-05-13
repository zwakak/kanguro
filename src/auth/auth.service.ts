import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user == null) {
      throw new NotFoundException();
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      process.env.BCRYPT_SALT,
    );

    return await this.usersService.createUser(createUserDto);
  }
}
