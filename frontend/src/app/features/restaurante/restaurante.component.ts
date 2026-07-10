import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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

/**
 * COMPONENTE RESTAURANTE — Mare Nostrum
 * Página editorial del restaurante gourmet del hotel.
 */
@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [ScrollAnimateDirective, RouterLink],
  templateUrl: './restaurante.component.html',
  styleUrl: './restaurante.component.scss',
})
export class RestauranteComponent {
  /** Menú degustación de ocho tiempos */
  readonly menuDegustacion: PlatoMenu[] = [
    {
      nombre: 'Amuse-Bouche',
      subtitulo: 'Bienvenida del Chef',
      descripcion: 'Crujiente de alga nori con crema de aguacate y lima, coronado con huevas de trucha y un toque de aceite de cilantro.',
      maridaje: 'Cava Brut Nature — Recaredo',
    },
    {
      nombre: 'Tartar de Atún Rojo',
      subtitulo: 'Entrante Frío',
      descripcion: 'Atún rojo del Estrecho con emulsión de wasabi fresco, gelatina de soja yodada y crujiente de arroz inflado.',
      maridaje: 'Albariño — Pazo de Señorans',
    },
    {
      nombre: 'Vieira a la Brasa',
      subtitulo: 'Mar y Tierra',
      descripcion: 'Vieira gallega marcada a la brasa sobre cremoso de coliflor ahumada, panceta ibérica crujiente y aire de manzana verde.',
      maridaje: 'Godello — Rafael Palacios',
    },
    {
      nombre: 'Ravioli de Bogavante',
      subtitulo: 'Pasta Artesanal',
      descripcion: 'Pasta fresca al azafrán rellena de bogavante azul, en caldo corto de sus cabezas con hierba limón y jengibre.',
      maridaje: 'Chardonnay — Enate',
    },
    {
      nombre: 'Lubina Salvaje',
      subtitulo: 'Pescado Principal',
      descripcion: 'Lomo de lubina de estero cocinado a baja temperatura sobre fondo de puerros confitados y salsa verde de perejil y alcaparras.',
      maridaje: 'Verdejo — José Pariente',
    },
    {
      nombre: 'Pichón de Bresse',
      subtitulo: 'Carne Principal',
      descripcion: 'Pechuga de pichón asada al momento con jugo de sus huesos tostados, puré de chirivía trufada y espinacas salteadas.',
      maridaje: 'Ribera del Duero — Vega Sicilia Valbuena',
    },
    {
      nombre: 'Selección de Quesos',
      subtitulo: 'Preludio Dulce',
      descripcion: 'Cuatro quesos artesanos españoles con membrillo casero, nueces caramelizadas y pan de higo.',
      maridaje: 'Jerez Amontillado — Lustau',
    },
    {
      nombre: 'Cítricos del Mediterráneo',
      subtitulo: 'Postre',
      descripcion: 'Esfera de chocolate blanco con corazón líquido de limón y maracuyá, tierra de aceituna negra y helado de yogur de cabra.',
      maridaje: 'Moscatel — Jorge Ordóñez',
    },
  ];

  /** Carta de vinos selección */
  readonly cartaVinos: Vino[] = [
    {
      nombre: 'Valbuena 5',
      tipo: 'Tinto',
      bodega: 'Vega Sicilia',
      region: 'Ribera del Duero',
      notaCata: 'Elegante y complejo, con notas a fruta negra madura, cacao y cedro. Taninos sedosos y final largo.',
      precio: 185,
    },
    {
      nombre: 'As Sortes',
      tipo: 'Blanco',
      bodega: 'Rafael Palacios',
      region: 'Valdeorras',
      notaCata: 'Godello de viñas viejas con mineralidad atlántica, fruta blanca y un paso untuoso de gran persistencia.',
      precio: 95,
    },
    {
      nombre: 'Clos Mogador',
      tipo: 'Tinto',
      bodega: 'Clos Mogador',
      region: 'Priorat',
      notaCata: 'Potente y mineral, con aromas de pizarra, fruta negra confitada y hierbas mediterráneas. Profundo.',
      precio: 160,
    },
    {
      nombre: 'Recaredo Brut Nature',
      tipo: 'Espumoso',
      bodega: 'Recaredo',
      region: 'Penedés',
      notaCata: 'Cava de larga crianza, burbuja fina y cremosa. Notas de fruta blanca, brioche y almendra tostada.',
      precio: 68,
    },
  ];

  /** Imágenes de la galería */
  readonly galeriaPlatos: string[] = [
    'assets/hotel-dining.jpg',
    'assets/restaurante-terraza.jpg',
    'assets/restaurante-interior.jpg',
    'assets/restaurante-plato.jpg',
    'assets/home-experiencia-spa.jpg',
  ];

  /** Desplazamiento suave a una sección por ID */
  desplazarA(id: string): void {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
