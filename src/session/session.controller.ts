import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { AddPresidentDto } from '../presentation/dto/add-president.dto';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
  @Put('add-president/:id')
  addPresident(@Param('id') id: string, @Body() addPresidentDto: AddPresidentDto) {
    return this.sessionService.addPresident(id, addPresidentDto);
  }


  @Put('remove-president/:id')
  removePresident(@Param('id') id: string) {
    return this.sessionService.removePresident(id);
  }
}
