import { UserEntity } from './user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';
import { randomAvatar } from './../../constant/avatar';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
const {kmeans} = require('ml-kmeans');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserModle: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * @desc 账号注册
   * @param params
   * @returns
   */
  async register(params) {
    const { user_name, user_password, user_email, user_avatar,user_tags } = params;
    console.log('register  user_tags',user_tags)
    params.user_password = hashSync(user_password);
    if (!user_avatar) {
      params.user_avatar = randomAvatar();
    }
    const u: any = await this.UserModle.findOne({
      where: [{ user_name }, { user_email }],
    });
    if (u) {
      const tips = user_name == u.user_name ? '用户名' : '邮箱';
      throw new HttpException(`该${tips}已经存在了！`, HttpStatus.BAD_REQUEST);
    }
    params.user_tags=user_tags
    await this.UserModle.save(params);
    return true;
  }

  /**
   * @desc 账号登录
   * @param params
   * @returns
   */
  async login(params): Promise<any> {
    const { user_name, user_password } = params;
    const u: any = await this.UserModle.findOne({
      where: [{ user_name }, { user_email: user_name }],
    });
    if (!u) {
      throw new HttpException('该用户不存在！', HttpStatus.BAD_REQUEST);
    }
    const bool = compareSync(user_password, u.user_password);
    if (bool) {
      const { user_name, user_email, id: user_id, user_role, user_nick } = u;
      return {
        token: this.jwtService.sign({
          user_name,
          user_nick,
          user_email,
          user_id,
          user_role,
        }),
      };
    } else {
      throw new HttpException(
        { message: '账号或者密码错误！', error: 'please try again later.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getInfo(payload) {
    const { user_id: id, exp: failure_time } = payload;
    const u = await this.UserModle.findOne({
      where: { id },
      select: [
        'id',
        'user_sex',
        'user_name',
        'user_nick',
        'user_email',
        'user_avatar',
        'user_role',
        'user_sign',
        'user_room_bg',
        'user_room_id',
        'user_tags'
      ],
    });
    console.log({ user_info: Object.assign(u, { user_id: id }), failure_time })
    return { user_info: Object.assign(u, { user_id: id }), failure_time };
  }

  async query(params) {
    return params;
  }

  /* 修改用户资料 */
  async update(payload, params) {
    const { user_id } = payload;
    /* 只能修改这些项 */
    const whiteListKeys = [
      'user_name',
      'user_nick',
      'user_sex',
      'user_sign',
      'user_avatar',
      'user_room_bg',
    ];
    const upateInfoData: any = {};
    whiteListKeys.forEach(
      (key) =>
        Object.keys(params).includes(key) && (upateInfoData[key] = params[key]),
    );
    await this.UserModle.update({ id: user_id }, upateInfoData);
    return true;
  }
  async relation(payload, params) {
    console.log('relation')
    console.log(payload)
    console.log(params)

    const { user_id } = params;
    // const u = await this.UserModle.findOne({
    //   where: { id },
    //   select: [
    //     'user_tags'
    //   ],
    // });

    const all_u  =await this.UserModle.find();
    console.log(all_u) 
    const index = all_u.findIndex(item => item.id === user_id);
    console.log(index);
  // 假设有一个用户数组，其中每个用户都有音乐标签数据
  // const users = [
  //   {
  //     musicTags: {
  //       '周杰伦': 30,
  //       '流行': 24,
  //       'R&B': 21
  //     }
  //   },
  //   {
  //     musicTags: {
  //       '孙燕姿': 40,
  //       '经典': 20,
  //       '流行': 30
  //     }
  //   },
  //   {
  //     musicTags: {
  //       '林俊杰': 35,
  //       '民谣': 25,
  //       '流行': 30
  //     }
  //   }
  // ];
  const users=all_u

  // 创建一个音乐标签字典
  const musicTagDictionary = {};

  // 为每个用户的音乐标签分配一个特定的索引
  users.forEach(user => {
    const musicTags = user.user_tags;
    Object.keys(musicTags).forEach(tag => {
      if (!musicTagDictionary.hasOwnProperty(tag)) {
        musicTagDictionary[tag] = Object.keys(musicTagDictionary).length;
      }
    });
  });

  console.log(musicTagDictionary);
  
  function convertTagsToVector(tags, dictionary) {
    // 创建一个零向量，长度为字典中的标签数量
    const vector = new Array(Object.keys(dictionary).length).fill(0);

    // 遍历用户的音乐标签
    Object.keys(tags).forEach(tag => {
      // 如果标签在字典中，则将其数值添加到对应的向量位置
      if (dictionary.hasOwnProperty(tag)) {
        const index = dictionary[tag];
        vector[index] = tags[tag];
      }
    });

    return vector;
  }

  // 将每个用户的音乐标签数据转换为数值向量
  const userVectors = users.map(user => {
    return convertTagsToVector(user.user_tags, musicTagDictionary);
  });

  console.log(userVectors);
 
 

  // 假设您有15个用户的数值向量
  // const data = [
  //   // ...用户1到用户15的数值向量
  // ];
  const data=userVectors

  // 设定聚类数量为5（您可以根据实际情况调整）
  const K = 3;

  // 进行K-means聚类
  const result = kmeans(data, K);

  // 假设目标用户的索引是0（即用户1）
  const targetUserIndex = index;

  // 找到与目标用户在同一簇中的所有其他用户
  const targetUserCluster = result.clusters[targetUserIndex];
  const similarUsers = result.clusters.reduce((acc, cluster, index) => {
    if (cluster === targetUserCluster && index !== targetUserIndex) {
      acc.push(index);
    }
    return acc;
  }, []);

  // 输出与目标用户相似的用户索引
  console.log(similarUsers);
  //选择前5个最相似
  const showRelationUsers=similarUsers.slice(0,5)
  const resultData=[]
  for(let i=0;i<showRelationUsers.length;i++){
    resultData.push(all_u[showRelationUsers[i]])
  }
 console.log(resultData)
    // console.log({ user_info: Object.assign(u, { user_id: id }), failure_time })
    return { data:resultData};
  }
}
