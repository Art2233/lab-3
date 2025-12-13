package com.backend.backend.table;

import com.backend.backend.connection.DBConnection;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.sql.*;

@Component
public class InitTable implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!isTablesCreated()) {
            createTable();
            setData();
        }
    }

    private boolean isTablesCreated() throws SQLException {
        Connection conn = null;
        ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            if (conn == null) {
                throw new IllegalStateException("Connection is null");
            }

            DatabaseMetaData databaseMetaData = conn.getMetaData();
            rs = databaseMetaData.getTables(null, null, "city", null);
            return rs.next();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (rs != null) {
                rs.close();
            }

            if (conn != null) {
                conn.close();
            }
        }
    }

    private void createTable() throws SQLException {
        Statement stmt = null;
        Connection conn = null;

        String sqlCityTable = "CREATE TABLE IF NOT EXISTS city  ("
                + "id INTEGER generated always as identity,"
                + "name VARCHAR(100), "
                + "PRIMARY KEY (id))";

        String sqlStationTable = "CREATE TABLE IF NOT EXISTS station ("
                + "id INTEGER GENERATED ALWAYS AS IDENTITY, "
                + "city_id INT NOT NULL, "
                + "name VARCHAR(100) NOT NULL, "
                + "PRIMARY KEY (id), "
                + "CONSTRAINT fk_station_city "
                + "FOREIGN KEY (city_id) REFERENCES city(id) ON DELETE CASCADE)";

        String sqlTripTable = "CREATE TABLE IF NOT EXISTS trip ("
                + "id INTEGER GENERATED ALWAYS AS IDENTITY, "
                + "departure_station_id INT NOT NULL, "
                + "arrival_station_id INT NOT NULL, "
                + "train_number VARCHAR(20) NOT NULL, "
                + "departure_time VARCHAR(30) NOT NULL, "
                + "arrival_time   VARCHAR(30) NOT NULL, "
                + "PRIMARY KEY (id), "
                + "CONSTRAINT fk_trip_departure_station "
                + "FOREIGN KEY (departure_station_id) REFERENCES station(id) ON DELETE CASCADE, "
                + "CONSTRAINT fk_trip_arrival_station "
                + "FOREIGN KEY (arrival_station_id) REFERENCES station(id) ON DELETE CASCADE, "
                + "CONSTRAINT chk_trip_time CHECK (arrival_time > departure_time))";

        try {
            conn = DBConnection.getConnection();
            if (conn == null) {
                throw new IllegalStateException("Connection is null");
            }

            stmt = conn.createStatement();

            stmt.execute(sqlCityTable);
            stmt.execute(sqlStationTable);
            stmt.execute(sqlTripTable);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (stmt != null) {
                stmt.close();
            }

            if (conn != null) {
                conn.close();
            }
        }
    }

    public void setData() {
        Connection conn = null;
        Statement checkStmt = null;
        PreparedStatement psCity = null;
        PreparedStatement psStation = null;
        PreparedStatement psTrip = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            if (conn == null) {
                throw new IllegalStateException("Connection is null");
            }

            checkStmt = conn.createStatement();
            rs = checkStmt.executeQuery("SELECT COUNT(*) FROM city");
            rs.next();

            if (rs.getInt(1) > 0) {
                return;
            }

            rs.close();
            checkStmt.close();

            psCity = conn.prepareStatement(
                "INSERT INTO city (name) VALUES (?) RETURNING id"
            );

            int[] cityIds = new int[3];
            String[] cities = {"Kyiv", "Lviv", "Odesa"};

            for (int i = 0; i < cities.length; i++) {
                psCity.setString(1, cities[i]);
                rs = psCity.executeQuery();
                rs.next();
                cityIds[i] = rs.getInt("id");
                rs.close();
            }

            psStation = conn.prepareStatement(
                "INSERT INTO station (city_id, name) VALUES (?, ?) RETURNING id"
            );

            int[] stationIds = new int[3];
            String[] stations = {
                    "Central Station",
                    "West Station",
                    "South Station"
            };

            for (int i = 0; i < stations.length; i++) {
                psStation.setInt(1, cityIds[i]);
                psStation.setString(2, stations[i]);
                rs = psStation.executeQuery();
                rs.next();
                stationIds[i] = rs.getInt("id");
                rs.close();
            }

            psTrip = conn.prepareStatement(
                "INSERT INTO trip (" +
                        "departure_station_id, arrival_station_id, train_number, departure_time, arrival_time" +
                        ") VALUES (?, ?, ?, now(), now() + interval '2 hours')"
            );

            psTrip.setInt(1, stationIds[0]);
            psTrip.setInt(2, stationIds[1]);
            psTrip.setString(3, "IC-101");
            psTrip.executeUpdate();

            psTrip.setInt(1, stationIds[1]);
            psTrip.setInt(2, stationIds[2]);
            psTrip.setString(3, "IC-202");
            psTrip.executeUpdate();

            psTrip.setInt(1, stationIds[2]);
            psTrip.setInt(2, stationIds[0]);
            psTrip.setString(3, "IC-303");
            psTrip.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (rs != null) rs.close();
                if (psTrip != null) psTrip.close();
                if (psStation != null) psStation.close();
                if (psCity != null) psCity.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
