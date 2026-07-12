resource "google_compute_address" "ip_publica" {
  name = "puerbaria-ip"
}

locals {
  # sslip.io resuelve api-34-66-1-2.sslip.io hacia 34.66.1.2 sin configurar DNS
  dominio_api = "api-${replace(google_compute_address.ip_publica.address, ".", "-")}.sslip.io"
}

resource "google_compute_firewall" "web" {
  name    = "puerbaria-permitir-web"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["puerbaria"]
}

resource "google_compute_firewall" "ssh" {
  name    = "puerbaria-permitir-ssh"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["puerbaria"]
}

resource "google_compute_instance" "servidor" {
  name         = "puerbaria-servidor"
  machine_type = "e2-micro"
  zone         = var.zone
  tags         = ["puerbaria"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"

    access_config {
      nat_ip = google_compute_address.ip_publica.address
    }
  }

  metadata = {
    ssh-keys = "${var.usuario_ssh}:${var.llave_ssh_publica}"

    startup-script = templatefile("${path.module}/plantillas/arranque.sh.tftpl", {
      dominio_api    = local.dominio_api
      imagen_backend = var.imagen_backend
      usuario_ssh    = var.usuario_ssh
    })
  }

  # La VM se puede recrear sin perder nada: los datos viven en Supabase
  # y los certificados de Caddy se regeneran solos.
  allow_stopping_for_update = true
}
