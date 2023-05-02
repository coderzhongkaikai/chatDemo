import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';//
import { Logger, ValidationPipe } from '@nestjs/common';
import { createSwagger } from './swagger/index';//
import { IoAdapter } from '@nestjs/platform-socket.io';
//
import { HttpExceptionFilter } from './filters/http-exception.filter';
//
import { TransformInterceptor } from './interceptor/transform.interceptor';
//
import { AuthGuard } from './guard/auth.guard';
import { CustomIoAdapter } from './adapters/custom-io-adapter';
import { config } from './config';

async function bootstrap() {
  //创建一个Nest应用程序实例
  const app = await NestFactory.create(AppModule);
  //将WebSocket适配器连接到应用程序上
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.useWebSocketAdapter(new CustomIoAdapter(app));
  //全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  //全局守卫
  app.useGlobalGuards(new AuthGuard());
  //全局管道
  app.useGlobalPipes(new ValidationPipe());
  //全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  //全局前缀
  app.setGlobalPrefix('/api');
  //添加Swagger文档生成器，利用Swagger UI调试API。
  createSwagger(app);
  //启动跨域资源共享
  app.enableCors();

  await app.listen(3000, '0.0.0.0',() => {
    Logger.log(`API服务已经启动,服务请访问:http://localhost:3000`);
    Logger.log(`WebSocket服务已经启动,服务请访问:ws://localhost:${config.websocketPort}`);
    Logger.log(`swagger已经启动,服务请访问:http://localhost:3000/docs`);
  });

}
bootstrap();
