import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from '@app/contracts/types/catalog.types';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data: CreateProductDto): Promise<ProductResponse> {
    const product = this.productRepository.create({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
    });

    return this.productRepository.save(product);
  }

  findAll(): Promise<ProductResponse[]> {
    return this.productRepository.find({
      where: {
        isActive: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<ProductResponse> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }
}
