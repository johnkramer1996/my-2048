import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameModule } from './modules/game/game.module';
import { GameComponent } from './modules/game/components/game/game.component';

@NgModule({
  declarations: [AppComponent, GameComponent],
  imports: [BrowserModule, GameModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
