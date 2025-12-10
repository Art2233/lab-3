package com.backend.backend.utils;

import java.sql.ResultSet;
import java.sql.SQLException;

public interface BuildClassAfterReqInterface<T>{
    T build(ResultSet rs) throws SQLException;
}
