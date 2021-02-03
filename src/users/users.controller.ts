import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../authorization/decorators/roles.decorator';
import { Role } from '../authorization/role.enum';
import { LoginUserDto } from './dto/login-user.dto';

import { Public } from '../authorization/decorators/ispublic.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('multiple')
  @Roles(Role.Admin)
  public async createMultipleUsers(@Body() createUsersDto: [CreateUserDto]) {
    return this.usersService.createMultipleUsers(createUsersDto);
  }

  @Get()
  @Roles(Role.Admin)
  public async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('/singleproperty/:id')
  @Roles(Role.Admin)
  public async putUserById(@Param('id') id: string, @Query() query) {
    return this.usersService.putUserById(id, query);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
  @Put('change-password/:id')
  @Roles(Role.Admin)
  public async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changepassword(id, changePasswordDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('login')
  @Public()
  login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.usersService.login(loginUserDto);
  }
}
