package com.backend.backend.station;

import com.backend.backend.entity.Entity;

public class Station extends Entity {
    private int cityId;
    private String cityName;

    public String getName() {
        return cityName;
    }

    public void setName(String cityName) {
        this.cityName = cityName;
    }

    public int getCityId() {
        return cityId;
    }

    public void setCityId(int cityId) {
        this.cityId = cityId;
    }
}
