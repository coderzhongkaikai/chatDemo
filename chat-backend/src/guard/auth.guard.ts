import {
  CanActivate,      //路由守卫
  ExecutionContext, //获取请求的上下文
  HttpException,    //抛出HTTP异常
  Injectable,       //注入依赖
  HttpStatus,       //导入常量，用于HTTP状态码
} from '@nestjs/common';

//导入jsonwebtoken库，用于验证和解码JWT
import * as jwt from 'jsonwebtoken';

// 导入JWT密钥和白名单
import { secret, whiteList } from 'src/config/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //获取HTTP请求对象
    const request = context.switchToHttp().getRequest();
    
    // 获取请求头和请求路径
    const { headers, path, route } = context.switchToRpc().getData();

    // 如果请求路径在白名单中，直接放行
    if (whiteList.includes(path)) {
      return true;
    }

    // 判断请求方法是否为GET请求
    const isGet = route.methods.get;

    // 获取请求头中的Authorization字段
    const token = headers.authorization || request.headers.authorization;

    //如果存在token，则验证token
    if (token) {
      const payload = await this.verifyToken(token, secret);
      //将token中携带的信息保存在请求对象中
      request.payload = payload;
      return true;
    } else {
      if (isGet) return true;//如果是GET请求，放行
      throw new HttpException('你还没登录,请先登录', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * @desc 全局校验token
   * @param token 需要校验的token
   * @param secret JWT密钥
   * @returns     解码后的payload
   */
  private verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve) => {
      jwt.verify(token, secret, (error, payload) => {
        //验证token
        if (error) {
          // 验证失败，抛出未授权的HTTP异常
          throw new HttpException('身份验证失败', HttpStatus.UNAUTHORIZED);
        } else {
          //验证成功，返回解码后的payload
          resolve(payload);
        }
      });
    });
  }
}
