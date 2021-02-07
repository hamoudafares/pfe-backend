import { Controller, Get, Post, Body, Put, Param, Delete, Patch, Query } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { AddPresidentDto } from './dto/add-president.dto';
import { SetSessionDto } from './dto/set-session.dto';
import { SetStudentDto } from './dto/set-student.dto';
import { SetJuryDto } from './dto/set-jury.dto';
import { RemoveJuryMemberDto } from './dto/remove-juryMember.dto';
import { Public } from '../authorization/decorators/ispublic.decorator';
import { FindPresentationPerTeacherPerYearDto } from './dto/findPresentationPerTeacherPerYear.dto';

@Controller('presentation')
export class PresentationController {
  constructor(private readonly presentationService: PresentationService) {
  }

  @Post()
  create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationService.create(createPresentationDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.presentationService.findAll();
  }


  @Public()
  @Get('/date')
  findByDate(@Query() query) {
    return this.presentationService.findByDate(query['date_from'], query['date_to']);
  }

  @Get('findPresentationsPerTeacherPerYear/:teacherID/:anneeUniversitaire')
  findPresentationsPerTeacherPerYear(
    @Param('teacherID') teacherID: string,
    @Param('anneeUniversitaire') anneeUniversitaire: string) {
    const findPresentationPerTeacherPerYearDto = new FindPresentationPerTeacherPerYearDto();
    findPresentationPerTeacherPerYearDto.teacherID = teacherID;
    findPresentationPerTeacherPerYearDto.anneeUniversitaire = anneeUniversitaire;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presentationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePresentationDto: UpdatePresentationDto) {
    return this.presentationService.update(id, updatePresentationDto);
  }

  @Put('set-president/:id')
  addPresident(@Param('id') id: string, @Body() addPresidentDto: AddPresidentDto) {
    return this.presentationService.addPresident(id, addPresidentDto);
  }

  @Put('remove-president/:id')
  removePresident(@Param('id') id: string) {
    return this.presentationService.removePresident(id);
  }

  @Put('set-session/:id')
  setSession(@Param('id') id: string, @Body() setSessionDto: SetSessionDto) {
    return this.presentationService.setSession(id, setSessionDto);
  }

  @Put('remove-session/:id')
  removeSession(@Param('id') id: string) {
    return this.presentationService.removeSession(id);
  }

  @Put('set-student/:id')
  setStudent(@Param('id') id: string, @Body() setStudentDto: SetStudentDto) {
    return this.presentationService.setStudent(id, setStudentDto);
  }

  @Put('remove-student/:id')
  removeStudent(@Param('id') id: string) {
    return this.presentationService.removeStudent(id);
  }

  @Put('set-jury/:id')
  setJury(@Param('id') id: string, @Body() setJuryDto: SetJuryDto) {
    return this.presentationService.setJury(id, setJuryDto);
  }

  @Put('remove-juryMember/:id')
  removeJuryMember(@Param('id') id: string, @Body() removeJuryMemberDto: RemoveJuryMemberDto) {
    return this.presentationService.removeJuryMember(id, removeJuryMemberDto.juryMemberID);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentationService.remove(id);
  }
}
