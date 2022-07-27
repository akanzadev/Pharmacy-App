import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiHeader,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PharmacysService } from '../services';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { Public, Roles } from '../../auth/decorators';
import { RoleEnum } from '../../auth/models';
import { multerOptions } from '../../common/helpers/multer.config';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmacyController {
  constructor(private pharmaciesService: PharmacysService) {}

  @Public()
  @ApiOperation({ summary: 'Find all pharmacies' })
  @Get()
  findAll() {
    return this.pharmaciesService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Find a pharmacy by id and show related products' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.pharmaciesService.findOne(id);
  }

  @Roles(RoleEnum.MEDIC)
  @ApiOperation({ summary: 'Create a pharmacy, required medic role' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('')
  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  create(
    @Body() payload: CreatePharmacyDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.pharmaciesService.create(payload, files);
  }

  // @Roles(RoleEnum.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Update a pharmacy, required admin role' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put(':id')
  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePharmacyDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.pharmaciesService.update(id, payload, files);
  }

  // @Roles(RoleEnum.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Delete a pharmacy, required admin role' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pharmaciesService.remove(id);
  }
}
