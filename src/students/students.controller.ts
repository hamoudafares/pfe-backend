import {Controller, Get, Post, Body, Put, Param, Delete, Patch} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {DeletedStudentsService} from "./deleted-students.service";

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService,
              private readonly deletedStudentsService: DeletedStudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('/deleted')
  findAllDeleted() {
    return this.deletedStudentsService.findAllDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Patch('add-supervisor/:id')
  addSupervisor(@Param('id') id: string, @Body() teacherId: any) {
    return this.studentsService.addSupervisor(id, teacherId);
  }

  @Patch('remove-supervisor/:id')
  removeSupervisor(@Param('id') id: string, @Body() teacherId: any) {
    return this.studentsService.removeSupervisor(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
