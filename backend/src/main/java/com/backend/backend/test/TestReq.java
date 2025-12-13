package com.backend.backend.test;

import com.backend.backend.connection.DBConnection;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

@RestController
@RequestMapping("api/test")
@CrossOrigin(origins = "http://localhost:4200") //for development
public class TestReq {
    @PostMapping("/unsafe")
    public String unsafe(@RequestBody Map<String, String> body) {
        Connection conn = null;
        Statement stmt = null;
        String result = "";
        String name = body.get("name");

        try {
            conn = DBConnection.getConnection();

            if (conn == null) {
                throw new IllegalStateException("НЕ підлючено до БД");
            }

            stmt = conn.createStatement();

            stmt.execute("INSERT INTO city (name) VALUES ('" + name + "')");

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

    @PostMapping("/safe")
    public String safe(@RequestBody Map<String, String> body) {
        Connection conn = null;
        PreparedStatement ps = null;
        String result = "";
        String name = body.get("name");

        try {
            conn = DBConnection.getConnection();

            if (conn == null) {
                throw new IllegalStateException("НЕ підлючено до БД");
            }

            ps = conn.prepareStatement("INSERT INTO city (name) VALUES (?);");
            ps.setString(1, name);
            ps.executeUpdate();

            result = "Query executed successfully";
        } catch (SQLException e) {
            return "SQL Error: " + e.getMessage();
        } finally {

            try {
                if (ps != null) ps.close();
                if (conn != null) conn.close();
            } catch (SQLException e) { }
        }

        return result;
    }
}
