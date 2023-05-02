import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

//定义统一响应格式的接口
interface Response<T> {
  data: T;
}

//将TransformInterceptor标记为可注入的依赖
@Injectable()
export class TransformInterceptor<T>
  
  implements NestInterceptor<T, Response<T>>
{
  //实现NestInterceptor 接口的 intercept方法
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    //处理数据流，将原始数据包装为统一的响应格式
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          success: true,
          message: '请求成功',
        };
      }),
    );
  }
}
