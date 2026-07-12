package com.puerbaria.backend.service;

import com.puerbaria.backend.dto.FotoHabitacionDto;
import com.puerbaria.backend.dto.HabitacionRequest;
import com.puerbaria.backend.dto.HabitacionResponse;
import com.puerbaria.backend.exception.RecursoNoEncontradoException;
import com.puerbaria.backend.model.FotoHabitacion;
import com.puerbaria.backend.model.Habitacion;
import com.puerbaria.backend.repository.HabitacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabitacionService {

    private final HabitacionRepository habitacionRepository;

    @Transactional(readOnly = true)
    public List<HabitacionResponse> listar() {
        return habitacionRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapearRespuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public HabitacionResponse obtener(Long id) {
        return mapearRespuesta(buscarHabitacion(id));
    }

    @Transactional
    public HabitacionResponse crear(HabitacionRequest request) {
        if (habitacionRepository.existsByNombreIgnoreCase(request.nombre())) {
            throw new IllegalArgumentException("Ya existe una habitacion con ese nombre");
        }

        Habitacion habitacion = new Habitacion();
        aplicarDatos(habitacion, request);
        return mapearRespuesta(habitacionRepository.save(habitacion));
    }

    @Transactional
    public HabitacionResponse actualizar(Long id, HabitacionRequest request) {
        if (habitacionRepository.existsByNombreIgnoreCaseAndIdNot(request.nombre(), id)) {
            throw new IllegalArgumentException("Ya existe otra habitacion con ese nombre");
        }

        Habitacion habitacion = buscarHabitacion(id);
        aplicarDatos(habitacion, request);
        return mapearRespuesta(habitacionRepository.save(habitacion));
    }

    @Transactional
    public void eliminar(Long id) {
        habitacionRepository.delete(buscarHabitacion(id));
    }

    private Habitacion buscarHabitacion(Long id) {
        return habitacionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Habitacion no encontrada"));
    }

    private void aplicarDatos(Habitacion habitacion, HabitacionRequest request) {
        habitacion.setNombre(request.nombre());
        habitacion.setEsencia(request.esencia());
        habitacion.setDescripcion(request.descripcion());
        habitacion.setPrecio(request.precio());
        habitacion.setTamano(request.tamano());
        habitacion.setCapacidad(request.capacidad());
        habitacion.setCama(request.cama());
        habitacion.setVista(request.vista());
        habitacion.setIdealPara(request.idealPara());

        habitacion.getAmenidades().clear();
        habitacion.getAmenidades().addAll(request.amenidades());
        habitacion.getCondiciones().clear();
        habitacion.getCondiciones().addAll(request.condiciones());
        habitacion.getFotos().clear();
        request.fotos().forEach(foto -> habitacion.getFotos().add(new FotoHabitacion(foto.src(), foto.alt())));
    }

    private HabitacionResponse mapearRespuesta(Habitacion habitacion) {
        return new HabitacionResponse(
                habitacion.getId(),
                habitacion.getNombre(),
                habitacion.getEsencia(),
                habitacion.getDescripcion(),
                habitacion.getPrecio(),
                habitacion.getTamano(),
                habitacion.getCapacidad(),
                habitacion.getCama(),
                habitacion.getVista(),
                habitacion.getIdealPara(),
                List.copyOf(habitacion.getAmenidades()),
                List.copyOf(habitacion.getCondiciones()),
                habitacion.getFotos().stream()
                        .map(foto -> new FotoHabitacionDto(foto.getSrc(), foto.getAlt()))
                        .toList());
    }
}
