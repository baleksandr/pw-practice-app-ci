import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NgxEchartsModule.forRoot({ echarts }),
    DashboardModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
