import { UserRegisterDTO } from './dtos/user-register.dto';
import { User } from './entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  //이메일로 회원가입
  async createUser(userRegisterDto: UserRegisterDTO): Promise<void> {
    const { email } = userRegisterDto;

    const temp = await this.findOne({ email });
    if (temp) throw new UnauthorizedException('이미 존재하는 이메일입니다.');

    const user = await this.create(userRegisterDto);

    try {
      await this.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.findOne({ email });
      if (!user) throw new Error('처리되지 않은 오류 : findUserByEmail');
      return user;
    } catch (error) {
      throw new BadRequestException('사용자를 찾지 못했습니다.');
    }
  }

  //개발용 모든 유저 목록
  async list(): Promise<User[]> {
    return await this.find();
  }
}
