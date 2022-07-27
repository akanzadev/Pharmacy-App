import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PharmacyController, ProductsController } from './controllers';
import { ProductsService, PharmacysService } from './services';
import { ImagesModule } from '../images/images.module';

@Module({
  controllers: [ProductsController, PharmacyController],
  exports: [],
  imports: [AuthModule, ImagesModule],
  providers: [ProductsService, PharmacysService],
})
export class ProductsModule {}
