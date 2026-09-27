import { Module } from '@nestjs/common';
import { GenerationModule } from './modules/generation/generation.module';
import { ScriptModule } from './modules/script/script.module';
import { StoryboardModule } from './modules/storyboard/storyboard.module';
import { AudioModule } from './modules/audio/audio.module';
import { RenderingModule } from './modules/rendering/rendering.module';

@Module({
  imports: [GenerationModule, ScriptModule, StoryboardModule, AudioModule, RenderingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
