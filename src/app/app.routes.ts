import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Solicitudes } from './pages/solicitudes/solicitudes';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Login' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home, title: 'Inicio' },
      { path: 'solicitudes', component: Solicitudes, title: 'Solicitudes' },
    ]
  }
];
