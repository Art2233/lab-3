package com.backend.backend.utils;

import com.backend.backend.city.City;
import com.backend.backend.connection.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EntityOperationsService {
    public <T extends Entity> List<T> getEntities(
        String sqlMethod,
        BuildClassAfterReqInterface<T> buildClass
    ) {
        List<T> entitiesList = new ArrayList<>();

        Statement stmt = null;
        try  {
            Connection conn = DBConnection.getConnection();

            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            stmt = conn.createStatement();
            boolean hasResultSet = stmt.execute(sqlMethod);

            if (hasResultSet) {
                ResultSet rs = stmt.getResultSet();
                while (rs.next()) {
                    entitiesList.add(buildClass.build(rs));
                }
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        entitiesList.sort((a, b) -> Math.toIntExact(a.getId() - b.getId()));

        return entitiesList;
    }

    public <T extends Entity> T createNewEntity(
            String sqlMethod,
            EntityOperationsInterface operations,
            BuildClassAfterReqInterface<T> buildClass
    ) {
        PreparedStatement pstmt = null;
        try  {
            Connection conn = DBConnection.getConnection();

            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            pstmt = conn.prepareStatement(sqlMethod, Statement.RETURN_GENERATED_KEYS);
            operations.applyActions(pstmt);
            pstmt.executeUpdate();

            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                return buildClass.build(rs);
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public <T extends Entity> T updateEntity(
            String sqlMethod,
            EntityOperationsInterface operations,
            BuildClassAfterReqInterface<T> buildClass
    ) {
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            Connection conn = DBConnection.getConnection();

            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            pstmt = conn.prepareStatement(sqlMethod);
            operations.applyActions(pstmt);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                return buildClass.build(rs);
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public void deleteEntity(
            String sqlMethod,
            EntityOperationsInterface operations
    ) {
        PreparedStatement pstmt = null;
        try {
            Connection conn = DBConnection.getConnection();
            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            pstmt = conn.prepareStatement(sqlMethod);
            operations.applyActions(pstmt);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
