import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftSidePanelComponent } from './left-side-panel/left-side-panel.component';
import { RightSidePanelComponent } from './right-side-panel/right-side-panel.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MyHammerConfig } from './gesture-config'; // <-- Import your custom config

@NgModule({
  declarations: [
    RightSidePanelComponent,
    FooterComponent,
    LeftSidePanelComponent
  ],
  imports: [CommonModule, RouterModule, HammerModule],
  exports: [
    RightSidePanelComponent,
    FooterComponent,
    LeftSidePanelComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
})
export class SharedModule { }
