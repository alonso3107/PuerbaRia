import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BarraProgresoScrollComponent } from '@shared/components/barra-progreso-scroll/barra-progreso-scroll.component';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface PlatoMenu {
  nombre: string;
  subtitulo: string;
  descripcion: string;
  maridaje?: string;
}

interface Vino {
  nombre: string;
  tipo: string;
  bodega: string;
  region: string;
  notaCata: string;
  precio: number;
}

interface FotoGaleria {
  src: string;
  alt: string;
  titulo: string;
}

interface Horario {
  servicio: string;
  horas: string;
}

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [DecimalPipe, RouterLink, ScrollAnimateDirective, BarraProgresoScrollComponent],
  templateUrl: './restaurante.component.html',
  styleUrl: './restaurante.component.scss',
})
export class RestauranteComponent {
  readonly precioMenu = 320;
  readonly precioMaridaje = 150;

  readonly menuDegustacion: PlatoMenu[] = [
    {
      nombre: 'Bienvenida del Chef',
      subtitulo: 'Amuse-bouche',
      descripcion: 'Crocante de maíz chulpe con emulsión de palta, huevas de trucha andina y aceite de cilantro.',
      maridaje: 'Espumante Brut — Intipalka, Ica',
    },
    {
      nombre: 'Tiradito de Lenguado',
      subtitulo: 'Entrante frío',
      descripcion: 'Lenguado de anzuelo en leche de tigre de ají amarillo, choclo tostado y aceite de albahaca.',
      maridaje: 'Sauvignon Blanc — Tacama, Ica',
    },
    {
      nombre: 'Pulpo a la Brasa',
      subtitulo: 'Mar y fuego',
      descripcion: 'Pulpo marcado al carbón sobre cremoso de pallares, chimichurri de aceitunas de Yauca.',
      maridaje: 'Chardonnay — Intipalka, Ica',
    },
    {
      nombre: 'Ravioli de Camarones',
      subtitulo: 'Pasta artesanal',
      descripcion: 'Pasta fresca al azafrán rellena de camarón de río, bisque de sus corales con un toque de rocoto.',
      maridaje: 'Viognier — Santiago Queirolo, Ica',
    },
    {
      nombre: 'Corvina Salvaje',
      subtitulo: 'Pescado principal',
      descripcion: 'Lomo de corvina a baja temperatura sobre puerros confitados y salsa verde de huacatay.',
      maridaje: 'Albariño — Pazo de Señorans, Rías Baixas',
    },
    {
      nombre: 'Asado de Tira 12 Horas',
      subtitulo: 'Carne principal',
      descripcion: 'Cocción lenta con jugo de sus huesos tostados, puré de zapallo loche y espinacas salteadas.',
      maridaje: 'Malbec — Catena Zapata, Mendoza',
    },
    {
      nombre: 'Quesos del Valle',
      subtitulo: 'Preludio dulce',
      descripcion: 'Selección de quesos andinos y mediterráneos con membrillo casero, nueces y pan de higo.',
      maridaje: 'Amontillado — Lustau, Jerez',
    },
    {
      nombre: 'Chocolate de Piura',
      subtitulo: 'Postre',
      descripcion: 'Esfera de chocolate 70 % con corazón líquido de maracuyá, tierra de aceituna y helado de yogur.',
      maridaje: 'Moscatel de cosecha tardía',
    },
  ];

  readonly cartaVinos: Vino[] = [
    {
      nombre: 'Intipalka N°1',
      tipo: 'Tinto',
      bodega: 'Viñas Queirolo',
      region: 'Valle de Ica',
      notaCata: 'Ensamblaje insignia del valle: fruta negra madura, especias dulces y taninos pulidos. Un tinto peruano de guarda.',
      precio: 190,
    },
    {
      nombre: 'As Sortes',
      tipo: 'Blanco',
      bodega: 'Rafael Palacios',
      region: 'Valdeorras',
      notaCata: 'Godello de viñas viejas con mineralidad atlántica, fruta blanca y un paso untuoso de gran persistencia.',
      precio: 390,
    },
    {
      nombre: 'Catena Zapata Malbec',
      tipo: 'Tinto',
      bodega: 'Catena Zapata',
      region: 'Mendoza',
      notaCata: 'Violetas, ciruela y cacao sobre una estructura elegante. El clásico argentino en su mejor expresión.',
      precio: 480,
    },
    {
      nombre: 'Recaredo Brut Nature',
      tipo: 'Espumoso',
      bodega: 'Recaredo',
      region: 'Penedés',
      notaCata: 'Cava de larga crianza, burbuja fina y cremosa. Notas de fruta blanca, brioche y almendra tostada.',
      precio: 280,
    },
  ];

  readonly galeriaPlatos: FotoGaleria[] = [
    {
      src: 'assets/restaurante/plato-fine-dining.jpg',
      alt: 'Curado de trucha con brotes frescos servido en la mesa del chef',
      titulo: 'Curado de trucha, brotes y demi-glace',
    },
    {
      src: 'assets/restaurante-plato.jpg',
      alt: 'Plato de autor del menú degustación de Mare Nostrum',
      titulo: 'Del menú degustación',
    },
    {
      src: 'assets/restaurante/plato-marino.jpg',
      alt: 'Corvina sobre espinacas con salsa de reducción',
      titulo: 'Corvina, espinacas y su reducción',
    },
    {
      src: 'assets/restaurante-terraza.jpg',
      alt: 'Terraza del restaurante al atardecer',
      titulo: 'La terraza al atardecer',
    },
    {
      src: 'assets/restaurante/mesa-elegante.jpg',
      alt: 'Salón principal de Mare Nostrum con los cerros de la costa al fondo',
      titulo: 'El salón principal al mediodía',
    },
  ];

  readonly horarios: Horario[] = [
    { servicio: 'Desayuno', horas: '07:00 — 11:00' },
    { servicio: 'Almuerzo', horas: '13:00 — 15:30' },
    { servicio: 'Cena', horas: '19:30 — 23:00' },
    { servicio: 'Bar & Lounge', horas: '17:00 — 01:00' },
  ];

  desplazarA(id: string): void {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
