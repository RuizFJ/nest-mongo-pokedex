import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axiosInstance: AxiosInstance = axios;

  async executeSEED(){
    const {data} = await this.axiosInstance.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5')
    data.results.forEach(({name, url}) => { //desestructuramos el objeto por name y url
      // cortamos la url por el caracter /
      const segments = url.split('/');
      // obtenemos el penultimo segmento que es el numero del pokemon
      const no = +segments[segments.length - 2];
      console.log(`No: ${no}, Name: ${name}`);

    });
    return data.results;
  }
}
