package com.puerbaria.backend.service;

import com.puerbaria.backend.dto.PaqueteSpaRequest;
import com.puerbaria.backend.dto.PaqueteSpaResponse;
import com.puerbaria.backend.dto.TratamientoSpaRequest;
import com.puerbaria.backend.dto.TratamientoSpaResponse;
import com.puerbaria.backend.exception.RecursoNoEncontradoException;
import com.puerbaria.backend.model.PaqueteSpa;
import com.puerbaria.backend.model.TratamientoSpa;
import com.puerbaria.backend.repository.PaqueteSpaRepository;
import com.puerbaria.backend.repository.TratamientoSpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpaService {

    private final TratamientoSpaRepository tratamientoSpaRepository;
    private final PaqueteSpaRepository paqueteSpaRepository;

    @Transactional(readOnly = true)
    public List<TratamientoSpaResponse> listarTratamientos() {
        return tratamientoSpaRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapearTratamiento)
                .toList();
    }

    @Transactional
    public TratamientoSpaResponse crearTratamiento(TratamientoSpaRequest request) {
        if (tratamientoSpaRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new IllegalArgumentException("Ya existe un tratamiento con ese nombre");
        }

        TratamientoSpa tratamiento = new TratamientoSpa();
        aplicarDatos(tratamiento, request);
        return mapearTratamiento(tratamientoSpaRepository.save(tratamiento));
    }

    @Transactional
    public TratamientoSpaResponse actualizarTratamiento(Long id, TratamientoSpaRequest request) {
        if (tratamientoSpaRepository.existsByNombreIgnoreCaseAndIdNot(request.nombre(), id)) {
            throw new IllegalArgumentException("Ya existe otro tratamiento con ese nombre");
        }

        TratamientoSpa tratamiento = buscarTratamiento(id);
        aplicarDatos(tratamiento, request);
        return mapearTratamiento(tratamientoSpaRepository.save(tratamiento));
    }

    @Transactional
    public void eliminarTratamiento(Long id) {
        tratamientoSpaRepository.delete(buscarTratamiento(id));
    }

    @Transactional(readOnly = true)
    public List<PaqueteSpaResponse> listarPaquetes() {
        return paqueteSpaRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapearPaquete)
                .toList();
    }

    @Transactional
    public PaqueteSpaResponse crearPaquete(PaqueteSpaRequest request) {
        if (paqueteSpaRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new IllegalArgumentException("Ya existe un paquete con ese nombre");
        }

        PaqueteSpa paquete = new PaqueteSpa();
        aplicarDatos(paquete, request);
        return mapearPaquete(paqueteSpaRepository.save(paquete));
    }

    @Transactional
    public PaqueteSpaResponse actualizarPaquete(Long id, PaqueteSpaRequest request) {
        if (paqueteSpaRepository.existsByNombreIgnoreCaseAndIdNot(request.nombre(), id)) {
            throw new IllegalArgumentException("Ya existe otro paquete con ese nombre");
        }

        PaqueteSpa paquete = buscarPaquete(id);
        aplicarDatos(paquete, request);
        return mapearPaquete(paqueteSpaRepository.save(paquete));
    }

    @Transactional
    public void eliminarPaquete(Long id) {
        paqueteSpaRepository.delete(buscarPaquete(id));
    }

    private TratamientoSpa buscarTratamiento(Long id) {
        return tratamientoSpaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Tratamiento no encontrado"));
    }

    private PaqueteSpa buscarPaquete(Long id) {
        return paqueteSpaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Paquete no encontrado"));
    }

    private void aplicarDatos(TratamientoSpa tratamiento, TratamientoSpaRequest request) {
        tratamiento.setIcono(request.icono());
        tratamiento.setNombre(request.nombre());
        tratamiento.setDescripcion(request.descripcion());
        tratamiento.setDuracion(request.duracion());
        tratamiento.setPrecio(request.precio());
    }

    private void aplicarDatos(PaqueteSpa paquete, PaqueteSpaRequest request) {
        paquete.setEtiqueta(request.etiqueta());
        paquete.setNombre(request.nombre());
        paquete.setDescripcion(request.descripcion());
        paquete.setImagen(request.imagen());
        paquete.setDuracion(request.duracion());
        paquete.setPrecio(request.precio());

        paquete.getIncluye().clear();
        paquete.getIncluye().addAll(request.incluye());
    }

    private TratamientoSpaResponse mapearTratamiento(TratamientoSpa tratamiento) {
        return new TratamientoSpaResponse(
                tratamiento.getId(),
                tratamiento.getIcono(),
                tratamiento.getNombre(),
                tratamiento.getDescripcion(),
                tratamiento.getDuracion(),
                tratamiento.getPrecio());
    }

    private PaqueteSpaResponse mapearPaquete(PaqueteSpa paquete) {
        return new PaqueteSpaResponse(
                paquete.getId(),
                paquete.getEtiqueta(),
                paquete.getNombre(),
                paquete.getDescripcion(),
                paquete.getImagen(),
                paquete.getDuracion(),
                paquete.getPrecio(),
                List.copyOf(paquete.getIncluye()));
    }
}
