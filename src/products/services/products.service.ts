import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, FindConditions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  CreateProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './../dtos';
import { Product, Pharmacy } from '../../database/entities/products';
import { ImagesService } from '../../images/services/images.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Pharmacy)
    private readonly PharmacyRepo: Repository<Pharmacy>,
    private readonly imageService: ImagesService,
  ) {}

  async findAll(params?: FilterProductDto) {
    if (!params) {
      const products = await this.productRepo.find({
        relations: ['pharmacy'],
      });
      if (products.length === 0) {
        throw new NotFoundException('Products not found');
      }
      return products;
    }
    const where: FindConditions<Product> = {};
    const { limit, offset, maxPrice, minPrice } = params;
    if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);
    const products = await this.productRepo.find({
      relations: ['pharmacy'],
      take: limit,
      skip: offset,
      where,
    });
    if (products.length === 0) {
      throw new NotFoundException('Products not found');
    }
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne(id, {
      relations: ['pharmacy'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(data: CreateProductDto, files: Array<Express.Multer.File>) {
    if (files.length === 0) throw new BadRequestException('No image uploaded');
    await this.validateNameUnique(data.name);
    const newProduct = this.productRepo.create(data);
    if (data.pharmacyId)
      newProduct.pharmacy = await this.validatePharmacy(data.pharmacyId);
    const { secure_url } = await this.imageService.uploadImage(
      data.name,
      files[0],
      'products',
    );
    newProduct.image = secure_url;
    return this.productRepo.save(newProduct);
  }

  async update(
    id: number,
    changes: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const product = await this.validateNotFound(id);
    if (changes.name) await this.validateNameUnique(changes.name);
    if (files.length > 0) {
      const { secure_url } = await this.imageService.updateImage(
        changes.name,
        product.image,
        files[0],
        'products',
      );
      this.productRepo.merge(product, { ...changes, image: secure_url });
      return this.productRepo.save(product);
    }
    if (changes.pharmacyId) {
      product.pharmacy = await this.validatePharmacy(changes.pharmacyId);
    }
    this.productRepo.merge(product, changes);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.validateNotFound(id);
    return this.productRepo.remove(product);
  }

  private async validateNotFound(id: number) {
    const product = await this.productRepo.findOne(id, {
      relations: ['pharmacy'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  private async validateNameUnique(name: string) {
    const product = await this.productRepo.findOne({ where: { name } });
    if (product) throw new BadRequestException('Product already exists');
  }

  private async validatePharmacy(PharmacyId: number) {
    const Pharmacy = await this.PharmacyRepo.findOne(PharmacyId);
    if (!Pharmacy) throw new NotFoundException('Pharmacy not found');
    return Pharmacy;
  }
}
