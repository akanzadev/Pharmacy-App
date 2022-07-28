import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pharmacy } from '../../database/entities/products';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../dtos';
import { ImagesService } from '../../images/services/images.service';

@Injectable()
export class PharmacysService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacysRepo: Repository<Pharmacy>,
    private readonly imageService: ImagesService,
  ) {}

  async findAll() {
    const Pharmacys = await this.pharmacysRepo.find();
    if (Pharmacys.length === 0)
      throw new NotFoundException('Pharmacys not found');
    return Pharmacys;
  }

  async findOne(id: number) {
    const Pharmacy = await this.pharmacysRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!Pharmacy) throw new NotFoundException(`Pharmacy #${id} not found`);
    return Pharmacy;
  }

  async create(data: CreatePharmacyDto, files: Array<Express.Multer.File>) {
    if (files.length === 0) throw new BadRequestException('No image uploaded');
    await this.validateNameUnique(data.name);
    const newPharmacy = this.pharmacysRepo.create(data);
    const { secure_url } = await this.imageService.uploadImage(
      data.name,
      files[0],
      'pharmacies',
    );
    newPharmacy.image = secure_url;
    return this.pharmacysRepo.save(newPharmacy);
  }

  async update(
    id: number,
    changes: UpdatePharmacyDto,
    files: Array<Express.Multer.File>,
  ) {
    const pharmacy = await this.validateNotFound(id);
    if (changes.name) await this.validateNameUnique(changes.name);
    if (files.length > 0) {
      const { secure_url } = await this.imageService.updateImage(
        changes.name,
        pharmacy.image,
        files[0],
        'pharmacies',
      );
      this.pharmacysRepo.merge(pharmacy, { ...changes, image: secure_url });
      return this.pharmacysRepo.save(pharmacy);
    }
    this.pharmacysRepo.merge(pharmacy, changes);
    return this.pharmacysRepo.save(pharmacy);
  }

  async remove(id: number) {
    const Pharmacy = await this.validateNotFound(id);
    return this.pharmacysRepo.remove(Pharmacy);
  }

  private async validateNotFound(id: number) {
    const Pharmacy = await this.pharmacysRepo.findOne({
      where: { id },
    });
    if (!Pharmacy) throw new NotFoundException(`Pharmacy #${id} not found`);
    return Pharmacy;
  }

  private async validateNameUnique(name: string) {
    const PharmacyWithName = await this.pharmacysRepo.findOne({
      where: { name },
    });
    if (PharmacyWithName) {
      throw new NotFoundException(`Pharmacy with name ${name} already exists`);
    }
  }
}
