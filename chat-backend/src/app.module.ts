import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { MusicModule } from './modules/music/music.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [
    //使用load()方法加载配置文件，并使用‘resolve’方法解析配置文件的路径
    //方便配置文件根据不同环境进行切换。
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    //引入了 @nestjs/typeorm，它是用于在 NestJS 中使用 TypeORM 的官方模块。
    //使用了 forRootAsync() 方法来异步创建 TypeORM 连接，并传递了一个工厂函数和一个依赖项数组。
    //工厂函数接收 ConfigService 实例作为参数，从而可以根据配置文件中的值来配置数据库连接。
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    ChatModule,
    MusicModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
//导出根模块
export class AppModule {}