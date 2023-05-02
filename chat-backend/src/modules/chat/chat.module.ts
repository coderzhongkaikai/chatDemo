import { RoomEntity } from './room.entity';
import { MusicEntity } from './../music/music.entity';
import { MessageEntity } from './message.entity';
import { UserEntity } from './../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WsChatGateway } from './chat.getaway';
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      MessageEntity,
      MusicEntity,
      RoomEntity,
    ]),
  ],
  // controllers属性定义了这个模块中包含的控制器，
  // 这里只有一个ChatControlle
  controllers: [ChatController],
  // providers属性定义了这个模块中包含的服务提供者，
  // 这里包括ChatService和WsChatGateway
  providers: [ChatService, WsChatGateway],
})
export class ChatModule {}
