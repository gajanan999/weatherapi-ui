import {Deserializable} from './deserializable.model';
import  {Weather} from './Weather';

export class SearchResponse implements Deserializable{

    searchId: number
    cityName: string
    currentTemperature: number
    minTemperature: number
    maxTemperature: number
    sunrise: number
    sunset: number
    weather : Weather[]
    dt: number
    selected:boolean

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}