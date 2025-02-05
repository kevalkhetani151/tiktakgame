import * as crypto from 'crypto';

class Encryptncryptpassword{
   static encrypt(password:string){
        const Salt =  crypto.randomBytes(16).toString('hex'); 
        const hashedPassword =  crypto.pbkdf2Sync(password, Salt, 1000, 64, 'sha512').toString('hex');
        return {
            data:{
                password:hashedPassword,
                salt:Salt

            }
        }
    }
    static dycrypt(newpassword:string,oldpassword:String,oldSalt:string){
        const hashedPassword = crypto.pbkdf2Sync(newpassword, oldSalt, 1000, 64, 'sha512').toString('hex');
        if (hashedPassword === oldpassword) {
            return true;
        } else {
            return false;
        }

    }
}

export default Encryptncryptpassword