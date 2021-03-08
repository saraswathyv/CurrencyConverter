import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AboutModule } from './about/about.module';
import { converterModule } from './convert/converter.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AboutModule,
    converterModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    AboutModule,
    converterModule
  ],
  providers: []
})
export class ComponentsModule {}