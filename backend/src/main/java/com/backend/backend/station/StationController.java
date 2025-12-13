package com.backend.backend.station;

import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("api/station")
@CrossOrigin(origins = "http://localhost:4200") //for development
public class StationController {
    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @GetMapping("/get-list")
    public List<Station> getStation() throws Exception {
        return stationService.getStations();
    }

    @PostMapping("/new")
    public Station createStation(@RequestBody Station station) throws Exception {
        try {
            return stationService.createNewStation(station);
        } catch (Exception e) {
            throw e;
        }
    }

    @PutMapping("/update/{id}")
    public Station updateStation(@PathVariable String id,  @RequestBody Station station) throws Exception {
        try {
            return stationService.updateStation(Integer.parseInt(id), station);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteStation(@PathVariable Integer id) throws Exception {
        try {
            stationService.deleteStation(id);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
