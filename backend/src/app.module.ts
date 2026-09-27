import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerationModule } from './generation/generation.module';
import { ScriptModule } from './script/script.module';
import { StoryboardModule } from './storyboard/storyboard.module';
import { AudioModule } from './audio/audio.module';
import { RenderingModule } from './rendering/rendering.module';

@Module({
  imports: [GenerationModule, ScriptModule, StoryboardModule, AudioModule, RenderingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
