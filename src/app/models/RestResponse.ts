import {Deserializable} from './deserializable.model';

export class RestResponse implements Deserializable{

    code:string;
    message: string;
    data: [];

    deserialize(input: any): this {
        return Object.assign(this, input);
      }
}