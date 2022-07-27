import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

import { CreateProductDto, UpdateProductDto, FilterProductDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { ProductsService } from './../services';
import { Public, Roles } from 'src/auth/decorators';
import { RoleEnum } from '../../auth/models';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../common/helpers/multer.config';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @ApiOperation({ summary: 'List of products' })
  @Get()
  getProducts(@Query() params: FilterProductDto) {
    return this.productsService.findAll(params);
  }

  @Public()
  @ApiOperation({ summary: 'Find one product' })
  @Get(':productId')
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findOne(productId);
  }

  @Roles(RoleEnum.MEDIC)
  @ApiOperation({ summary: 'Create product, required admin role' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        stock: { type: 'number' },
        expirationDate: {
          type: 'date',
          default: new Date(),
        },
        pharmacyId: { type: 'number' },
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
    @Req() request: Request,
    @Body() data: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(request['user']);
    return this.productsService.create(data, files);
  }

  // @Roles(RoleEnum.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Update product, required admin role' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true },
        price: { type: 'number', nullable: true },
        stock: { type: 'number', nullable: true },
        expirationDate: { type: 'date', nullable: true },
        pharmacyId: { type: 'number', nullable: true },
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
    @Body() payload: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.productsService.update(id, payload, files);
  }

  // @Roles(RoleEnum.ADMIN)
  @Public()
  @ApiOperation({ summary: 'Delete product, required admin role' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
