package com.backend.backend.entity;

import com.backend.backend.connection.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EntityOperationsService {
    public <T extends Entity> List<T> getEntities(
        String sqlMethod,
        BuildClassAfterReqInterface<T> buildClass
    ) throws SQLException {
        List<T> entitiesList = new ArrayList<>();

        Statement stmt = null;
        Connection conn = null;
        ResultSet rs = null;
        try  {
            conn = DBConnection.getConnection();

            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            stmt = conn.createStatement();
            boolean hasResultSet = stmt.execute(sqlMethod);

            if (hasResultSet) {
                rs = stmt.getResultSet();
                while (rs.next()) {
                    entitiesList.add(buildClass.build(rs));
                }
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (stmt != null) {
                stmt.close();
            }

            if (stmt != null) {
                stmt.close();
            }

            if (conn != null) {
                conn.close();
            }
        }

        entitiesList.sort((a, b) -> Math.toIntExact(a.getId() - b.getId()));

        return entitiesList;
    }

    public <T extends Entity> T createNewEntity(
            String sqlMethod,
            EntityOperationsInterface operations,
            BuildClassAfterReqInterface<T> buildClass
    ) throws SQLException {
        PreparedStatement pstmt = null;
        Connection conn = null;
        ResultSet rs = null;
        try  {
            conn = DBConnection.getConnection();

            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            pstmt = conn.prepareStatement(sqlMethod, Statement.RETURN_GENERATED_KEYS);
            operations.applyActions(pstmt);
            pstmt.executeUpdate();

            rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                return buildClass.build(rs);
            }
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
        return null;
    }

    public <T extends Entity> T updateEntity(
            String sqlMethod,
            EntityOperationsInterface operations,
            BuildClassAfterReqInterface<T> buildClass
    ) throws SQLException {
        Connection conn =  null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();

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
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
            if (conn != null) {
                conn.close();
            }
        }
        return null;
    }

    public void deleteEntity(
            String sqlMethod,
            EntityOperationsInterface operations
    ) throws SQLException {
        PreparedStatement pstmt = null;
        Connection conn =  null;
        try {
            conn = DBConnection.getConnection();
            if (conn == null) throw new IllegalStateException("НЕ підключено до БД");

            pstmt = conn.prepareStatement(sqlMethod);
            operations.applyActions(pstmt);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            throw new IllegalStateException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }  finally {
            if (pstmt != null) {
                pstmt.close();
            }

            if (conn != null) {
                conn.close();
            }
        }
    }
}
