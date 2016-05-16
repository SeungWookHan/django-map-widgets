$.namespace("DjangoGoogleMapWidget");

DjangoGoogleMapWidget = DjangoMapWidgetBase.extend({

    initializeMap: function(){
        var location = this.defaultLocation;

        if (this.defaultLocationName){
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : this.defaultLocationName}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var geo_location = results[0].geometry.location;
                    location = {
                        "lat": geo_location.lat(),
                        "lng": geo_location.lng()
                    };
                }else{
                    console.warn("Cannot find " + this.defaultLocationName + " on google geo service.")
                }

                this.map = new google.maps.Map(document.getElementById('mw-map'), {
                center: new google.maps.LatLng(location.lat, location.lng),
                scrollwheel: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                zoom: this.zoom
            });
            }.bind(this));
        }else{
            this.map = new google.maps.Map(document.getElementById('mw-map'), {
                center: new google.maps.LatLng(location.lat, location.lng),
                scrollwheel: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT
                },
                zoom: this.zoom
            });

        }
        this.addMarkerBtn.on("click", this.handleAddMarkerBtnClick.bind(this));
    },

    addMarkerToMap: function(lat, lng){
        this.removeMarker();
        var marker_position = {lat: parseFloat(lat), lng: parseFloat(lng)};
        this.marker = new google.maps.Marker({
            position: marker_position,
            map: this.map,
            draggable: true
        });
        this.marker.addListener("dragend", this.dragMarker.bind(this));

        var bounds = new google.maps.LatLngBounds();
        debugger;
        bounds.extend(this.marker.getPosition());
        this.map.fitBounds(bounds);
        var listener = google.maps.event.addListener(this.map, "bounds_changed", function() {
            if (this.getZoom() > 16) {
                this.setZoom(16)
            }
            google.maps.event.removeListener(listener);
        });
        console.log(listener);
    },

    removeMarker: function(e){
        if (this.marker){
            this.marker.setMap(null);
        }
    },

    dragMarker: function(e){
        this.updateLocationInput(e.latLng.lat(), e.latLng.lng())
    },

    handleAddMarkerBtnClick: function(e){
        if (!this.addMarkerBtn.hasClass("active")){
            this.map.addListener("click", this.handleMapClick.bind(this));
            $(".mw-map").addClass("click");
            this.addMarkerBtn.addClass("active");
        }else{
            $(".mw-map").removeClass("click");
            this.addMarkerBtn.removeClass("active");
        }

    },

    handleMapClick: function(e){
        this.updateLocationInput(e.latLng.lat(), e.latLng.lng())
    }
});