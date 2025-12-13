package com.backend.backend.city;

import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/city")
@CrossOrigin(origins = "http://localhost:4200") //for development
public class CityController {
    private final CityService cityService;
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/get-list")
    public List<City> getCities() throws SQLException {
        return cityService.getCities();
    }

    @PostMapping("/new")
    public City createCity(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        try {
            return cityService.createNewCity(name);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public City updateCity(@PathVariable String id,  @RequestBody City city) {
        try {
            return cityService.updateCity(Math.toIntExact(city.getId()), city.getName());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCity(@PathVariable String id) {
        try {
            cityService.deleteCity(Integer.parseInt(id));
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
