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
import { Roles } from '../authorization/decorators/roles.decorator';
import { Role } from '../authorization/role.enum';
import { Public } from '../authorization/decorators/ispublic.decorator';


@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService,
              private readonly deletedStudentsService: DeletedStudentsService) {}

  @Post()
  //@Roles(Role.Admin)
  @Public()
  @UseInterceptors(FileInterceptor('image',
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
  create(@Body() createStudentDto: CreateStudentDto,@UploadedFile() image, @Req() req: Request) {
    return this.studentsService.create(createStudentDto, image, req);
  }

  @Get()
  @Public()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('/deleted')
  findAllDeleted() {
    return this.deletedStudentsService.findAllDeleted();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Student)
  @UseInterceptors(FileInterceptor('image',
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
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @UploadedFile() image, @Req() req: Request) {
    return this.studentsService.update(id, updateStudentDto, image, req);
  }

  @Patch('add-supervisor/:id')
  @Roles(Role.Student)
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
  @Roles(Role.Student)
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
  @Roles(Role.Student)
  updatePfe(@UploadedFile() file, @Param('id') id: string, @Body() pfe: Body, @Req() req: Request) {
    return this.studentsService.updatePfe(id, file, pfe, req);
  }

  @Patch('/delete-pfe/:id')
  @Roles(Role.Student)
  removePfe(@Param('id') id: string) {
    return this.studentsService.deletePfe(id);
  }

  @Patch('/validate-pfe/:id')
  @Roles(Role.Admin)
  validatePfe(@Param('id') id: string) {
    return this.studentsService.validatePfe(id);
  }

  @Get('get-rapport/:imagename')
  getRapport(@Param('imagename') image, @Res() res) {
    return this.studentsService.getRapport(image, res);
  }

  @Patch('remove-supervisor/:id')
  @Roles(Role.Student)
  removeSupervisor(@Param('id') id: string) {
    return this.studentsService.removeSupervisor(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
