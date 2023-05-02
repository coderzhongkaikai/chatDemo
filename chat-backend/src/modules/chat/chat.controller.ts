import { Controller, Post, Body, Get, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
/*
  主要负责处理来自前端页面的 HTTP 请求，并将这些请求转发给相应的后端服务
*/


//为控制器添加 API 文档标签(便于在swagger中管理)
@ApiTags('Chat')
//将此类标记为Nestjs控制器，并设置路由前缀为'chat'
@Controller('chat')
export class ChatController {

  // 通过依赖注入，将 ChatService 作为控制器的一个属性
  constructor(private readonly ChatService: ChatService) {}

  // 用于获取聊天历史记录的 POST 端点
  @Post('/history')
  history(@Body() params) {
    return this.ChatService.history(params);
  }

  // 用于获取表情列表的 GET 端点
  @Get('/emoticon')
  emoticon(@Query() params) {
    return this.ChatService.emoticon(params);
  }

  // 用于创建新的聊天室的 POST 端点
  @Post('/createRoom')
  createRoom(@Body() params, @Request() req) {
    return this.ChatService.createRoom(params, req);
  }

  // 用于获取聊天室信息的 GET 端点
  @Get('/roomInfo')
  roomInfo(@Query() params) {
    return this.ChatService.roomInfo(params);
  }

  //用于更新聊天室信息的 POST 端点
  @Post('/updateRoomInfo')
  updateRoomInfo(@Body() params, @Request() req) {
    return this.ChatService.updateRoomInfo(params, req.payload);
  }
}
