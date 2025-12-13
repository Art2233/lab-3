package com.backend.backend.station;

import com.backend.backend.entity.EntityOperationsService;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class StationService {
    private final EntityOperationsService entityOperationsService = new EntityOperationsService();

    public List<Station> getStations() throws SQLException {
        return entityOperationsService.getEntities(
                "SELECT * FROM station",
                (rs) -> {
                    Station station = new Station();
                    station.setId(rs.getInt("id"));
                    station.setName(rs.getString("name"));
                    station.setCityId(rs.getInt("city_id"));
                    return station;
                }
        );
    }

    public Station createNewStation(Station station) throws SQLException {
        return entityOperationsService.createNewEntity(
                "INSERT INTO station (city_id, name) VALUES (?, ?) RETURNING id, city_id, name",
                ps -> {
                    ps.setInt(1, station.getCityId());
                    ps.setString(2, station.getName());
                },
                rs -> {
                    Station newStation = new Station();
                    newStation.setId(rs.getInt("id"));
                    newStation.setCityId(rs.getInt("city_id"));
                    newStation.setName(rs.getString("name"));
                    return newStation;
                }
        );
    }

    public void deleteStation(int id) throws SQLException {
        entityOperationsService.deleteEntity(
                "DELETE FROM station WHERE id = ?;",
                (ps) -> {
                    ps.setInt(1, id);
                }
        );

        return;
    }

    public Station updateStation(int id, Station station) throws SQLException {
        return entityOperationsService.updateEntity(
                "UPDATE station SET name = ?, city_id = ? WHERE id = ? RETURNING id, name, city_id;",
                (ps) -> {
                    ps.setString(1, station.getName());
                    ps.setInt(2, station.getCityId());
                    ps.setInt(3, id);
                },
                (rs) -> {
                    Station newStation = new Station();
                    newStation.setId(rs.getInt("id"));
                    newStation.setCityId(rs.getInt("city_id"));
                    newStation.setName(rs.getString("name"));
                    return newStation;
                }
        );
    }
}
