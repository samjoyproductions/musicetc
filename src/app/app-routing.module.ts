import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlbumExchangeComponent } from './album-exchange/album-exchange.component';
import { WeeklyMixComponent } from './weekly-mix/weekly-mix.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'album-exchange',
    component: AlbumExchangeComponent,
  },
  {
    path: 'weekly-mix',
    component: WeeklyMixComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
