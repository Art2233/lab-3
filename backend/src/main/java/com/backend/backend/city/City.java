package com.backend.backend.city;

import com.backend.backend.entity.Entity;

public class City extends Entity {
    private String cityName;

    public String getName() {
        return cityName;
    }

    public void setName(String cityName) {
        this.cityName = cityName;
    }
}
