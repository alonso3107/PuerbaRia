package com.puerbaria.backend.service;

import com.puerbaria.backend.dto.VoucherAdminResponse;
import com.puerbaria.backend.dto.VoucherRequest;
import com.puerbaria.backend.exception.AlmacenamientoException;
import com.puerbaria.backend.exception.RecursoNoEncontradoException;
import com.puerbaria.backend.model.EstadoVoucher;
import com.puerbaria.backend.model.Voucher;
import com.puerbaria.backend.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

@Service
@RequiredArgsConstructor
public class VoucherService {

    private static final long TAMANO_MAXIMO_ARCHIVO = 10 * 1024 * 1024;
    private static final List<String> EXTENSIONES_PERMITIDAS = List.of(".jpg", ".jpeg", ".png", ".webp", ".pdf");
    private static final List<String> TIPOS_MIME_PERMITIDOS = List.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf");

    private final VoucherRepository voucherRepository;

    @Value("${voucher.upload-dir:uploads/vouchers}")
    private String uploadDir;

    public Voucher guardarVoucher(VoucherRequest request, MultipartFile archivo) {
        String nombreOriginal = validarArchivo(archivo);
        Path rutaArchivo = guardarArchivo(archivo, nombreOriginal);

        Voucher voucher = Voucher.builder()
                .nombre(request.getNombre())
                .habitacion(request.getHabitacion())
                .email(obtenerEmailAutenticado())
                .tipoComprobante(request.getTipoComprobante())
                .monto(request.getMonto())
                .codigoOperacion(request.getCodigoOperacion())
                .fechaPago(request.getFechaPago())
                .celular(request.getCelular())
                .archivoRuta(rutaArchivo.toString())
                .archivoNombre(nombreOriginal)
                .archivoTipo(archivo.getContentType())
                .build();

        return voucherRepository.save(voucher);
    }

    public List<VoucherAdminResponse> obtenerVouchersPorEmail(String email) {
        return voucherRepository.findByEmailOrderByFechaSubidaDesc(email)
                .stream()
                .map(this::mapearVoucherAdmin)
                .toList();
    }

    public List<VoucherAdminResponse> listarVouchersAdmin() {
        return voucherRepository.findAllByOrderByFechaSubidaDesc()
                .stream()
                .map(this::mapearVoucherAdmin)
                .toList();
    }

    public VoucherAdminResponse actualizarEstadoVoucher(Long id, EstadoVoucher estado) {
        Voucher voucher = obtenerVoucher(id);
        voucher.setEstado(estado);
        return mapearVoucherAdmin(voucherRepository.save(voucher));
    }

    public Voucher obtenerVoucher(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Voucher no encontrado"));
    }

    public Resource cargarArchivoVoucher(Long id) {
        Voucher voucher = obtenerVoucher(id);
        Path rutaArchivo = Paths.get(voucher.getArchivoRuta()).normalize();

        Resource recurso;
        try {
            recurso = new UrlResource(rutaArchivo.toUri());
        } catch (MalformedURLException e) {
            throw new AlmacenamientoException("No se pudo acceder al archivo del voucher", e);
        }

        if (!recurso.exists() || !recurso.isReadable()) {
            throw new RecursoNoEncontradoException("Archivo de voucher no disponible");
        }

        return recurso;
    }

    public String detectarTipoArchivo(Voucher voucher) {
        try {
            String tipoDetectado = Files.probeContentType(Paths.get(voucher.getArchivoRuta()).normalize());
            if (tipoDetectado != null) {
                return tipoDetectado;
            }
        } catch (IOException e) {
            // se usa el tipo registrado al subir el archivo
        }

        if (voucher.getArchivoTipo() != null && !voucher.getArchivoTipo().isBlank()) {
            return voucher.getArchivoTipo();
        }

        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }

    private String validarArchivo(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo de comprobante es obligatorio");
        }

        if (archivo.getSize() > TAMANO_MAXIMO_ARCHIVO) {
            throw new IllegalArgumentException("El archivo excede el tamano maximo de 10MB");
        }

        String nombreOriginal = archivo.getOriginalFilename();
        if (nombreOriginal == null || nombreOriginal.isBlank()) {
            throw new IllegalArgumentException("El archivo debe tener un nombre valido");
        }
        nombreOriginal = Paths.get(nombreOriginal).getFileName().toString();

        if (!esArchivoPermitido(nombreOriginal, archivo.getContentType())) {
            throw new IllegalArgumentException("Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.");
        }

        return nombreOriginal;
    }

    private Path guardarArchivo(MultipartFile archivo, String nombreOriginal) {
        try {
            Path directorioUpload = Paths.get(uploadDir);
            Files.createDirectories(directorioUpload);

            Path rutaArchivo = directorioUpload.resolve(UUID.randomUUID() + "_" + nombreOriginal);
            Files.copy(archivo.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
            return rutaArchivo;
        } catch (IOException e) {
            throw new AlmacenamientoException("Error al guardar el archivo. Intente nuevamente.", e);
        }
    }

    private String obtenerEmailAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean autenticado = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);

        return autenticado ? authentication.getName() : null;
    }

    private boolean esArchivoPermitido(String nombreArchivo, String tipoMime) {
        String tipoNormalizado = tipoMime == null ? "" : tipoMime.toLowerCase(Locale.ROOT);
        String nombreNormalizado = nombreArchivo.toLowerCase(Locale.ROOT);

        return TIPOS_MIME_PERMITIDOS.contains(tipoNormalizado)
                || EXTENSIONES_PERMITIDAS.stream().anyMatch(nombreNormalizado::endsWith);
    }

    private VoucherAdminResponse mapearVoucherAdmin(Voucher voucher) {
        return new VoucherAdminResponse(
                voucher.getId(),
                voucher.getNombre(),
                voucher.getHabitacion(),
                voucher.getTipoComprobante(),
                voucher.getMonto(),
                voucher.getCodigoOperacion(),
                voucher.getFechaPago(),
                voucher.getCelular(),
                voucher.getArchivoNombre(),
                voucher.getArchivoTipo(),
                voucher.getEstado().name(),
                voucher.getFechaSubida(),
                "/api/v1/admin/vouchers/" + voucher.getId() + "/archivo");
    }
}
