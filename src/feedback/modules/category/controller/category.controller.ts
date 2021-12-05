import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { Serialize } from '../../../../interceptors/serialize.interceptor';
import { CategoryDto } from '../dtos/category.dto';

@Controller('categories')
@Serialize(CategoryDto)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get()
  getOneCategory(@Param('id') id: string) {
    return this.categoryService.getOneCategory(id);
  }
}
