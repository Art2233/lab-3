package com.backend.backend.city;

import com.backend.backend.utils.Entity;

public class City extends Entity {
    private Long id;
    private String name;

    public City() {
        super();
    }

    public City(Long id, String name) {
        super(id);
        this.name = name;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
