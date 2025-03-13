import { NgModule } from "@angular/core";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";

@NgModule({
  declarations: [],
  imports: [FooterComponent,HeaderComponent],
  exports: [FooterComponent,HeaderComponent],
})
export class SharedModule { }
