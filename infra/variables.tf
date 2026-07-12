variable "project_id" {
  description = "ID del proyecto de GCP donde se crea la infraestructura"
  type        = string
}

variable "region" {
  description = "Region con capa gratuita para e2-micro (us-central1, us-west1 o us-east1)"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "Zona dentro de la region"
  type        = string
  default     = "us-central1-a"
}

variable "usuario_ssh" {
  description = "Usuario para conectarse por SSH a la VM (tambien lo usa el deploy de GitHub Actions)"
  type        = string
  default     = "deploy"
}

variable "llave_ssh_publica" {
  description = "Contenido de la llave SSH publica (ej. el contenido de ~/.ssh/puerbaria.pub)"
  type        = string
}

variable "imagen_backend" {
  description = "Imagen del backend que la VM descarga en cada deploy"
  type        = string
  default     = "ghcr.io/alonso3107/puerbaria-backend:latest"
}
