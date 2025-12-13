package com.backend.backend.entity;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public interface EntityOperationsInterface {
    void applyActions(PreparedStatement ps) throws SQLException;
}