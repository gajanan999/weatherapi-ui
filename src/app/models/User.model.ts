import {Deserializable} from './deserializable.model';
import  { Weather } from './Weather';

export class UserModel implements Deserializable{

    id: number
    username: string
    password: string
    active: boolean
    roles:string
    brithdate:string

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}