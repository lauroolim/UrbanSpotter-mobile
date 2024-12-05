import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, NavController, ToastController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Report } from './report.model';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-reports',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonicModule],
  providers: [HttpClient, Storage]
})
export class ReportPage implements OnInit {
  public lista_reports: Report[] = [];

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private toastController: ToastController,
    private navController: NavController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    const usuario = await this.storage.get('usuario');

    if (usuario && usuario.token) {
      this.consultarReports(usuario.token);
    } else {
      this.navController.navigateRoot('/home');
    }
  }

  async consultarReports(token: string) {
    const loading = await this.loadingController.create({
      message: 'Carregando reports...',
      duration: 60000
    });
    await loading.present();

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    this.http.get<any>('http://127.0.0.1:8000/reports/api/', { headers: httpHeaders })
      .subscribe({
        next: async (resposta) => {
          const features = resposta.features;

          this.lista_reports = features.map((feature: any) => {
            const properties = feature.properties;
            return {
              id: properties.id,
              title: properties.title,
              description: properties.description,
              location: feature.geometry,
              created_at: properties.created_at,
              foto: properties.foto,
              user: properties.user
            };
          });

          await loading.dismiss();
        },
        error: async (erro) => {
          await loading.dismiss();
          const toast = await this.toastController.create({
            message: `Falha ao carregar reports: ${erro.message}`,
            duration: 2000,
            cssClass: 'ion-text-center'
          });
          await toast.present();
        }
      });
  }
}
