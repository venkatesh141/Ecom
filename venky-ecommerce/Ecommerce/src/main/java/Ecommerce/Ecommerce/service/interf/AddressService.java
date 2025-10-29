package Ecommerce.Ecommerce.service.interf;

import Ecommerce.Ecommerce.dto.AddressDto;
import Ecommerce.Ecommerce.dto.Response;

public interface AddressService {
    Response saveAndUpdateAddress(AddressDto addressDto);
}
