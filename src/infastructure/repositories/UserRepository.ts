import prisma from "../../config/db.config";
import User from "../../domain/entity/User";
import * as crypto from 'crypto';
import Encryptncryptpassword from "../../helper/encryptpassword";




export class InMemoryUserRepository{
  private users: User[] = [];


async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

async create(userinfo: User): Promise<User> {  
 const encyptPass = Encryptncryptpassword.encrypt(userinfo.password)
 
  const userData = await prisma.user.create({
      data: {
        ...userinfo,
        password:encyptPass.data.password,
        salt:encyptPass.data.salt
      }
    });
    return userData;
  }
}