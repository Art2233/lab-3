package com.backend.backend.city;

import com.backend.backend.connection.DBConnection;
import com.backend.backend.utils.EntityOperationsService;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CityService {
    private final EntityOperationsService entityOperationsService = new EntityOperationsService();

    public List<City> getAll() {
        return entityOperationsService.getEntities(
            "SELECT * FROM city",
            (rs) -> {
                City c = new City();
                c.setId(rs.getLong(1));
                c.setName(rs.getString(2));
                return c;
            }
        );
    }

    public City createNewCity(String cityName) throws SQLException {
        return  entityOperationsService.createNewEntity(
            "INSERT INTO city (name) VALUES (?)",
            (ps) -> {
                ps.setString(1, cityName);
            },
            (rs) -> {
                City c = new City();
                c.setId(rs.getLong(1));
                c.setName(cityName);
                return c;
            }
        );
    }

    public City updateCity(int id, String name) throws SQLException {
        return entityOperationsService.updateEntity(
                "UPDATE city SET name = ? WHERE id = ? RETURNING id, name",
                ps -> {
                    ps.setString(1, name);
                    ps.setInt(2, id);
                },
                rs -> {
                    City c = new City();
                    c.setId(rs.getLong("id"));
                    c.setName(rs.getString("name"));
                    return c;
                }
        );
    }

    public void deleteCity(int id) throws SQLException {
        entityOperationsService.deleteEntity(
                "DELETE FROM city WHERE id = ?;",
                (ps) -> {
                    ps.setLong(1, id);
                }
        );

        return;
    }
}
