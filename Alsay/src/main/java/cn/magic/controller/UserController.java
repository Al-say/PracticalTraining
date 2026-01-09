package cn.magic.controller;

import cn.magic.dto.UserDTO;
import cn.magic.entity.User;
import cn.magic.service.UserService;
import cn.magic.utils.ResultVo;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//用户控制层
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;  //注入业务对象
    //查询系统用户-分页
    @GetMapping("/findUserPage")
    public ResultVo<Page<User>> findUserPage(UserDTO userDTO) throws Exception {
        //创建分页对象
        Page<User> page = new Page<>(userDTO.getCurPage(),userDTO.getPageSize());
        //查询条件构造对象
        QueryWrapper<User> qw = new QueryWrapper<>();
        //判断条件
        if (userDTO.getNickname()!= null && userDTO.getNickname() != "") {
            //模糊查询
            qw.like("nickname", userDTO.getNickname());
        }

        qw.eq("role_id", userDTO.getRoleId());
        qw.eq("is_deleted", 0); // 显示
        userService.page(page, qw); //分页查询
        return ResultVo.ok(page);
    }
    //查询全部用户-分页
    @GetMapping("/findAllUserPage")
    public ResultVo<Page<User>> findAllUserPage(UserDTO userDTO) throws Exception {
        Page<User> page = new Page<>(userDTO.getCurPage(),userDTO.getPageSize());
        QueryWrapper<User> qw = new QueryWrapper<>();
        //判断条件
        if (userDTO.getNickname()!= null && userDTO.getNickname() != "") {
            //模糊查询
            qw.like("nickname", userDTO.getNickname());
        }
        qw.eq("is_deleted", 0); // 显示
        userService.page(page, qw);
        return ResultVo.ok(page);
    }
    //添加用户
    @PostMapping("/addUser")
    public ResultVo addUser(@RequestBody User user) throws Exception {
        user.setIsDeleted(0);
        userService.save(user);
        return ResultVo.ok("添加成功");
    }
    //修改用户
    @PostMapping("/updateUser")
    public ResultVo updateUser(@RequestBody User user) throws Exception {
        UpdateWrapper<User> updateWrapper = new UpdateWrapper<User>();
        updateWrapper.eq("id", user.getId());
        userService.update(user, updateWrapper);
        return ResultVo.ok("修改成功");
    }
    //删除用户
    @DeleteMapping("/delUser/{id}")
    public ResultVo deleteUser(@PathVariable("id") Integer id) throws Exception{
        userService.removeById(id);
        return ResultVo.ok("删除成功");
    }
}
