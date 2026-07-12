output "ip_publica" {
  description = "IP fija de la VM (usarla como VM_HOST en los secrets de GitHub)"
  value       = google_compute_address.ip_publica.address
}

output "url_api" {
  description = "URL publica de la API con TLS automatico"
  value       = "https://${local.dominio_api}"
}

output "conexion_ssh" {
  description = "Comando para conectarse a la VM"
  value       = "ssh ${var.usuario_ssh}@${google_compute_address.ip_publica.address}"
}
