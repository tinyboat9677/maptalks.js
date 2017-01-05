describe('#Geometry.InfoWindow', function () {

    var container;
    var map;
    var center = new maptalks.Coordinate(118.846825, 32.046534);
    var layer;

    beforeEach(function () {
        container = document.createElement('div');
        container.style.width = '800px';
        container.style.height = '600px';
        document.body.appendChild(container);
        var option = {
            zoomAnimation: false,
            zoom: 15,
            center: center
        };
        map = new maptalks.Map(container, option);
        layer = new maptalks.VectorLayer('vector').addTo(map);
    });

    afterEach(function () {
        REMOVE_CONTAINER(container);
    });

    it('infowindow has methods to change itself.', function (done) {
        var marker = new maptalks.Marker(center);
        marker.addTo(layer);
        var options = {
            title: 'title',
            content: 'content'
        };
        marker.setInfoWindow(options);
        var w = marker.getInfoWindow();
        w.setContent('content2');
        expect(w.getContent()).to.be.eql('content2');
        w.setTitle('title2');
        expect(w.getTitle()).to.be.eql('title2');
        marker.openInfoWindow();
        w.setContent('content3');
        expect(w.getContent()).to.be.eql('content3');
        w.setTitle('title4');
        expect(w.getTitle()).to.be.eql('title4');
        function onZoomEnd() {
            done();
        }
        map.on('zoomend', onZoomEnd);
        map.zoomIn();
    });

    it('close when layer is removed', function (done) {
        var marker = new maptalks.Marker(center);
        marker.addTo(layer);
        var options = {
            title: 'title',
            content: 'content',
            animation : false
        };
        marker.setInfoWindow(options);
        marker.openInfoWindow();
        var w = marker.getInfoWindow();
        expect(w.isVisible()).to.be.ok();
        layer.remove();
        expect(w.isVisible()).not.to.be.ok();
        done();
    });

    describe('all kinds of geometries can have a infowindow', function () {
        it('set a infowindow', function () {
            var options = {
                title: 'title',
                content: 'content'
            };
            var geometries = GEN_GEOMETRIES_OF_ALL_TYPES();
            for (var i = 0; i < geometries.length; i++) {
                geometries[i].setInfoWindow(options);
                expect(geometries[i].getInfoWindow()).not.to.be.ok();
            }
            layer.addGeometry(geometries);
        });

        it('set and open/close and remove a infowindow', function () {
            var options = {
                title: 'title',
                content: 'content',
                animation : null
            };
            var geometries = GEN_GEOMETRIES_OF_ALL_TYPES();
            layer.addGeometry(geometries);
            for (var i = 0; i < geometries.length; i++) {
                var geo = geometries[i];
                geo.setInfoWindow(options);
                geo.openInfoWindow();
                var w = geo.getInfoWindow();
                expect(w.isVisible()).to.be.ok();
                geo.closeInfoWindow();
                expect(w.isVisible()).not.to.be.ok();
                geo.removeInfoWindow();
                expect(geo.getInfoWindow()).not.to.be.ok();
            }
        });

        it('set and open/close and remove a customized infowindow', function () {
            var options = {
                custom:true,
                content: '<div style="width:400px;height:300;">this is a customized infowindow.</div>',
                animation : null
            };
            var geometries = GEN_GEOMETRIES_OF_ALL_TYPES();
            layer.addGeometry(geometries);
            for (var i = 0; i < geometries.length; i++) {
                var geo = geometries[i];
                geo.setInfoWindow(options);
                geo.openInfoWindow();
                var w = geo.getInfoWindow();
                expect(w.isVisible()).to.be.ok();
                geo.closeInfoWindow();
                expect(w.isVisible()).not.to.be.ok();
                geo.removeInfoWindow();
                expect(geo.getInfoWindow()).not.to.be.ok();
            }
        });

        it('hide when geometry is hided', function () {
            var options = {
                title: 'title',
                content: 'content',
                animation : null
            };
            var geo = new maptalks.Marker(map.getCenter());
            layer.addGeometry(geo);

            geo.setInfoWindow(options);
            geo.openInfoWindow();
            var w = geo.getInfoWindow();
            expect(w.isVisible()).to.be.ok();

            geo.hide();

            expect(w.isVisible()).not.to.be.ok();
        });

        it('hide when layer is hided', function () {
            var options = {
                title: 'title',
                content: 'content',
                animation : null
            };
            var geo = new maptalks.Marker(map.getCenter());
            layer.addGeometry(geo);

            geo.setInfoWindow(options);
            geo.openInfoWindow();
            var w = geo.getInfoWindow();
            expect(w.isVisible()).to.be.ok();

            layer.hide();

            expect(w.isVisible()).not.to.be.ok();
        });

        it('create and hide when layer is hided', function () {
            var options = {
                title: 'title',
                content: 'content',
                animation : null
            };
            var infoWindow = new maptalks.ui.InfoWindow(options);
            var geo = new maptalks.Marker(map.getCenter());
            layer.addGeometry(geo);

            infoWindow.addTo(geo);
            infoWindow.show(geo.getCenter());
            var w = geo.getInfoWindow();
            expect(w.isVisible()).to.be.ok();

            layer.hide();

            expect(w.isVisible()).not.to.be.ok();
        });

        it('move when geometry is moved', function () {
            var options = {
                title: 'title',
                content: 'content',
                animation : null
            };
            var geo = new maptalks.Marker(map.getCenter());
            layer.addGeometry(geo);

            geo.setInfoWindow(options);
            geo.openInfoWindow();

            var w = geo.getInfoWindow();
            var pos1 = w.getPosition();

            geo.setCoordinates(map.getCenter().add(0.1, 0.1));

            var pos2 = w.getPosition();
            expect(w.isVisible()).to.be.ok();
            expect(pos2.toArray()).not.to.be.eql(pos1.toArray());
        });

        it('animate', function (done) {
            var options = {
                title: 'title',
                content: 'content',
                animation : 'fade,scale',
                animationDuration : 100
            };
            var infoWindow = new maptalks.ui.InfoWindow(options);
            var geo = new maptalks.Marker(map.getCenter());
            layer.addGeometry(geo);

            infoWindow.addTo(geo);
            infoWindow.show(geo.getCenter());
            expect(infoWindow.getDOM().style.opacity).to.be.eql(1);
            expect(infoWindow.getDOM().style[maptalks.DomUtil.TRANSFORM]).to.be.eql('scale(1)');

            infoWindow.hide();
            //hide animations
            setTimeout(function () {
                expect(infoWindow.getDOM().style.opacity).to.be.eql(0);
                expect(infoWindow.getDOM().style[maptalks.DomUtil.TRANSFORM]).to.be.eql('scale(0)');
                expect(infoWindow.isVisible()).not.to.be.ok();
                done();
            }, options.animationDuration + 1);
        });
    });

});
