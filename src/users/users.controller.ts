import {Controller, Get, Post, Body, Put, Param, Delete, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  public async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put('/singleproperty/:id')
  public async putUserById(@Param('id') id: string, @Query() query) {

    return this.usersService.putUserById(id, query);
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

   @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
