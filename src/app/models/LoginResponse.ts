import {Deserializable} from './deserializable.model';

export class LoginResponse implements Deserializable{

    jwt:string;
    id: number;
    username: string;
    roles: [];

    deserialize(input: any): this {
        return Object.assign(this, input);
      }
}