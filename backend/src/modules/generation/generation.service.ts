import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerationService {
  
  generate (data){
    return {
      prompt: data.prompt,
      duration: data.duration ?? 90
    }
  }
}
