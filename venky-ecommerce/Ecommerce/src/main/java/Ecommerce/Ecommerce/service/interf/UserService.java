package Ecommerce.Ecommerce.service.interf;


import Ecommerce.Ecommerce.dto.LoginRequest;
import Ecommerce.Ecommerce.dto.Response;
import Ecommerce.Ecommerce.dto.UserDto;
import Ecommerce.Ecommerce.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getLoginUser();
    Response getUserInfoAndOrderHistory();
}