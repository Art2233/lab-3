package com.backend.backend.trip;

import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin(origins = "http://localhost:4200") //for development
public class TripController {
    private TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/get-list")
    public List<Trip> getTripList() throws SQLException {
        return tripService.getTrips();
    }

    @PostMapping("/new")
    public Trip newTrip(@RequestBody Trip trip) throws SQLException {
        try {
            return  tripService.createNewTrip(trip);
        } catch (Exception e) {
            throw new SQLException(e);
        }
    }

    @PutMapping("/update/{id}")
    public Trip updateTrip(@RequestBody Trip trip, @PathVariable int id) throws SQLException {
        try {
            return tripService.updateTrip(id, trip);
        }  catch (Exception e) {
            throw new SQLException(e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTrip(@PathVariable String id) throws SQLException {
        try {
            tripService.deleteTrip(Integer.parseInt(id));
        } catch (Exception e) {
            throw new SQLException(e);
        }
    }
}
