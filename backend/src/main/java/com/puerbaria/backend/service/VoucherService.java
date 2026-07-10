package com.puerbaria.backend.service;

import com.puerbaria.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.dto.VoucherRequest;
import com.puerbaria.backend.model.Voucher;
import com.puerbaria.backend.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Servicio para gestionar la subida y almacenamiento de vouchers.
 * Guarda el archivo en disco y los metadatos en base de datos.
 */
@Service
@RequiredArgsConstructor
public class VoucherService {

    private static final long TAMANO_MAXIMO_ARCHIVO = 10 * 1024 * 1024;
    private static final List<String> EXTENSIONES_PERMITIDAS = List.of(".jpg", ".jpeg", ".png", ".webp", ".pdf");
    private static final List<String> TIPOS_MIME_PERMITIDOS = List.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
    );

    private final VoucherRepository voucherRepository;

    /** Directorio donde se guardan los archivos de voucher */
    @Value("${voucher.upload-dir:uploads/vouchers}")
    private String uploadDir;

    /**
     * Procesa y guarda un voucher completo: archivo + metadatos.
     *
     * @param request Datos del formulario validados
     * @param archivo Archivo de comprobante (imagen o PDF)
     * @return Voucher guardado con ID asignado
     * @throws IOException si falla la escritura del archivo
     */
    public Voucher guardarVoucher(VoucherRequest request, MultipartFile archivo) throws IOException {
        // 1. Validar que el archivo no este vacio
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo de comprobante es obligatorio");
        }

        String nombreOriginal = obtenerNombreArchivoSeguro(archivo);
        String tipo = archivo.getContentType();

        // 2. Validar tamano (max 10MB)
        if (archivo.getSize() > TAMANO_MAXIMO_ARCHIVO) {
            throw new IllegalArgumentException("El archivo excede el tamano maximo de 10MB");
        }

        // 3. Validar formato. Algunos navegadores reportan PDF/imagenes como application/octet-stream.
        if (!esArchivoPermitido(nombreOriginal, tipo)) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.");
        }

        // 4. Crear directorio si no existe
        Path directorioUpload = Paths.get(uploadDir);
        if (!Files.exists(directorioUpload)) {
            Files.createDirectories(directorioUpload);
        }

        // 5. Generar nombre unico para el archivo
        String nombreUnico = UUID.randomUUID() + "_" + nombreOriginal;
        Path rutaArchivo = directorioUpload.resolve(nombreUnico);

        // 6. Guardar archivo en disco
        Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

        // Extract email from SecurityContext if available
        String email = null;
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof org.springframework.security.authentication.AnonymousAuthenticationToken)) {
            email = authentication.getName();
        }

        // 7. Construir y guardar la entidad
        Voucher voucher = Voucher.builder()
                .nombre(request.getNombre())
                .habitacion(request.getHabitacion())
                .email(email)
                .tipoComprobante(request.getTipoComprobante())
                .monto(request.getMonto())
                .codigoOperacion(request.getCodigoOperacion())
                .fechaPago(request.getFechaPago())
                .celular(request.getCelular())
                .archivoRuta(rutaArchivo.toString())
                .archivoNombre(nombreOriginal)
                .archivoTipo(tipo)
                .build();

        return voucherRepository.save(voucher);
    }

    /**
     * Lista los vouchers de un cliente en especifico por su email.
     */
    public List<VoucherAdminResponse> obtenerVouchersPorEmail(String email) {
        return voucherRepository.findByEmailOrderByFechaSubidaDesc(email)
                .stream()
                .map(this::mapearVoucherAdmin)
                .toList();
    }

    /**
     * Lista los vouchers del mas reciente al mas antiguo para el dashboard.
     */
    public List<VoucherAdminResponse> listarVouchersAdmin() {
        return voucherRepository.findAllByOrderByFechaSubidaDesc()
                .stream()
                .map(this::mapearVoucherAdmin)
                .toList();
    }

    /**
     * Actualiza el estado de revision de un voucher.
     */
    public VoucherAdminResponse actualizarEstadoVoucher(Long id, String estado) {
        Voucher voucher = obtenerVoucher(id);

        if (!estado.equals("VALIDADO") && !estado.equals("RECHAZADO")) {
            throw new IllegalArgumentException("Estado de voucher no permitido");
        }

        voucher.setEstado(estado);
        return mapearVoucherAdmin(voucherRepository.save(voucher));
    }

    /**
     * Carga el archivo asociado a un voucher para visualizarlo en el navegador.
     */
    public Resource cargarArchivoVoucher(Long id) throws MalformedURLException {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voucher no encontrado"));

        Path rutaArchivo = Paths.get(voucher.getArchivoRuta()).normalize();
        Resource recurso = new UrlResource(rutaArchivo.toUri());

        if (!recurso.exists() || !recurso.isReadable()) {
            throw new IllegalArgumentException("Archivo de voucher no disponible");
        }

        return recurso;
    }

    public Voucher obtenerVoucher(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Voucher no encontrado"));
    }

    public String detectarTipoArchivo(Voucher voucher) throws IOException {
        Path rutaArchivo = Paths.get(voucher.getArchivoRuta()).normalize();
        String tipoDetectado = Files.probeContentType(rutaArchivo);

        if (tipoDetectado != null) {
            return tipoDetectado;
        }

        if (voucher.getArchivoTipo() != null && !voucher.getArchivoTipo().isBlank()) {
            return voucher.getArchivoTipo();
        }

        return "application/octet-stream";
    }

    private VoucherAdminResponse mapearVoucherAdmin(Voucher voucher) {
        return VoucherAdminResponse.builder()
                .id(voucher.getId())
                .nombre(voucher.getNombre())
                .habitacion(voucher.getHabitacion())
                .tipoComprobante(voucher.getTipoComprobante())
                .monto(voucher.getMonto())
                .codigoOperacion(voucher.getCodigoOperacion())
                .fechaPago(voucher.getFechaPago())
                .celular(voucher.getCelular())
                .archivoNombre(voucher.getArchivoNombre())
                .archivoTipo(voucher.getArchivoTipo())
                .estado(voucher.getEstado())
                .fechaSubida(voucher.getFechaSubida())
                .archivoUrl("/api/v1/admin/vouchers/" + voucher.getId() + "/archivo")
                .build();
    }

    private String obtenerNombreArchivoSeguro(MultipartFile archivo) {
        String nombreOriginal = archivo.getOriginalFilename();

        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            throw new IllegalArgumentException("El archivo debe tener un nombre valido");
        }

        return Paths.get(nombreOriginal).getFileName().toString();
    }

    private boolean esArchivoPermitido(String nombreArchivo, String tipoMime) {
        String tipoNormalizado = tipoMime == null ? "" : tipoMime.toLowerCase(Locale.ROOT);
        String nombreNormalizado = nombreArchivo.toLowerCase(Locale.ROOT);

        boolean mimePermitido = TIPOS_MIME_PERMITIDOS.contains(tipoNormalizado);
        boolean extensionPermitida = EXTENSIONES_PERMITIDAS.stream().anyMatch(nombreNormalizado::endsWith);

        return mimePermitido || extensionPermitida;
    }
}
