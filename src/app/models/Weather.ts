import {Deserializable} from './deserializable.model';

export class Weather implements Deserializable{


    weatherId:number
    main:string
    description:string
    deserialize(input: any): this {
        return Object.assign(this, input);
      }
}