import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  Req, HttpStatus, Res,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {DeletedStudentsService} from "./deleted-students.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';


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
  addSupervisor(@Param('id') id: string, @Body() teacherCredentials: any) {
    return this.studentsService.addSupervisor(id, teacherCredentials);
  }

  @Patch('add-pfe/:id')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
          },
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        }
      })
    })
  )
  addPfe(@UploadedFile() file, @Param('id') id: string, @Body() pfe: Body, @Req() req: Request) {
    return this.studentsService.addPfe(id, file, pfe, req);
  }

  @Patch('update-pfe/:id')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        }
      })
    })
  )
  updatePfe(@UploadedFile() file, @Param('id') id: string, @Body() pfe: Body, @Req() req: Request) {
    return this.studentsService.updatePfe(id, file, pfe, req);
  }

  @Get('get-image/:imagename')
  getRapport(@Param('imagename') image, @Res() res) {
    return this.studentsService.getRapport(image, res);
  }

  @Patch('remove-supervisor/:id')
  removeSupervisor(@Param('id') id: string) {
    return this.studentsService.removeSupervisor(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
