package Ecommerce.Ecommerce.service.interf;

import Ecommerce.Ecommerce.dto.CategoryDto;
import Ecommerce.Ecommerce.dto.Response;

public interface CategoryService {

    Response createCategory(CategoryDto categoryRequest);
    Response updateCategory(Long categoryId, CategoryDto categoryRequest);
    Response getAllCategories();
    Response getCategoryById(Long categoryId);
    Response deleteCategory(Long categoryId);
}
