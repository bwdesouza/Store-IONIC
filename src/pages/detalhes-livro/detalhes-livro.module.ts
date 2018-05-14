import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalhesLivroPage } from './detalhes-livro';

@NgModule({
  declarations: [
    DetalhesLivroPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalhesLivroPage),
  ],
})
export class DetalhesLivroPageModule {}
