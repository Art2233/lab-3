package com.backend.backend.utils;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public interface EntityOperationsInterface {
    void applyActions(PreparedStatement ps) throws SQLException;
}