package com.backend.backend.trip;

import com.backend.backend.entity.EntityOperationsService;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class TripService {
    private final EntityOperationsService entityOperationsService = new EntityOperationsService();

    public List<Trip> getTrips() throws SQLException {
        return entityOperationsService.getEntities(
                "SELECT * FROM trip",
                (rs) -> {
                    Trip t = new Trip();
                    t.setId(rs.getInt("id"));
                    t.setDepartureStationId(rs.getInt("departure_station_id"));
                    t.setArrivalStationId(rs.getInt("arrival_station_id"));
                    t.setTrainNumber(rs.getString("train_number"));
                    t.setDepartureTime(rs.getString("departure_time"));
                    t.setArrivalTime(rs.getString("arrival_time"));
                    return t;
                }
        );
    }

    public Trip createNewTrip(Trip trip) throws SQLException {
        return  entityOperationsService.createNewEntity(
                "INSERT INTO trip (departure_station_id, arrival_station_id, train_number, departure_time, arrival_time) "
                    + "VALUES (?, ?, ?, ?, ?) "
                    + "RETURNING id, departure_station_id, arrival_station_id, train_number, departure_time, arrival_time",
                (ps) -> {
                    ps.setInt(1, trip.getDepartureStationId());
                    ps.setInt(2, trip.getArrivalStationId());
                    ps.setString(3, trip.getTrainNumber());
                    ps.setString(4, trip.getDepartureTime());
                    ps.setString(5, trip.getArrivalTime());
                },
                (rs) -> {
                    Trip t = new Trip();
                    t.setId(rs.getInt("id"));
                    t.setDepartureStationId(rs.getInt("departure_station_id"));
                    t.setArrivalStationId(rs.getInt("arrival_station_id"));
                    t.setTrainNumber(rs.getString("train_number"));
                    t.setDepartureTime(rs.getString("departure_time"));
                    t.setArrivalTime(rs.getString("arrival_time"));
                    return t;
                }
        );
    }

    public Trip updateTrip(int id, Trip trip) throws SQLException {
        return  entityOperationsService.updateEntity(
                "UPDATE trip SET "
                + "departure_station_id = ?, arrival_station_id = ?, train_number = ?, departure_time = ?, arrival_time = ? "
                + "WHERE id = ? "
                + "RETURNING id, departure_station_id, arrival_station_id, train_number, departure_time, arrival_time",
                (ps) -> {
                    ps.setInt(1, trip.getDepartureStationId());
                    ps.setInt(2, trip.getArrivalStationId());
                    ps.setString(3, trip.getTrainNumber());
                    ps.setString(4, trip.getDepartureTime());
                    ps.setString(5, trip.getArrivalTime());
                    ps.setInt(6, id);
                },
                (rs) -> {
                    Trip t = new Trip();
                    t.setId(rs.getInt("id"));
                    t.setDepartureStationId(rs.getInt("departure_station_id"));
                    t.setArrivalStationId(rs.getInt("arrival_station_id"));
                    t.setTrainNumber(rs.getString("train_number"));
                    t.setDepartureTime(rs.getString("departure_time"));
                    t.setArrivalTime(rs.getString("arrival_time"));
                    return t;
                }
        );
    }

    public void deleteTrip(int id) throws SQLException {
        entityOperationsService.deleteEntity(
                "DELETE FROM trip WHERE id = ?;",
                (ps) -> {
                    ps.setInt(1, id);
                }
        );
        return;
    }
}

