package com.backend.backend.city;

import com.backend.backend.connection.DBConnection;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
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

    //Without SQL Injection
    @PostMapping("/noninjection")
    public String noninjection(@RequestBody String sql) {
        Connection conn = null;
        Statement stmt = null;
        String result = "";

        try {
            conn = DBConnection.getConnection();

            if (conn == null) {
                throw new IllegalStateException("НЕ підлючено до БД");
            }

            stmt = conn.createStatement();

            boolean hasResultSet = stmt.execute(sql);

            result = "Query executed successfully";

        } catch (SQLException e) {

            return "SQL Error: " + e.getMessage();
        } finally {

            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) { }
        }

        return result;
    }


    //SQL Injection
    @GetMapping("/get-list")
    public List<City> getCities() {
        return cityService.getAll();
    }

    @PostMapping("/new")
    public City createCity(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (null == name || name.isEmpty()) {
            throw new IllegalArgumentException("name is required");
        }
        try {
            return cityService.createNewCity(name);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{id}")
    public City updateCity(@PathVariable String id,  @RequestBody City city) {
        if (null == city.getName() || city.getName().isEmpty()) {
            throw new IllegalArgumentException("name is required");
        }

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
