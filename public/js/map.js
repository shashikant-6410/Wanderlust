// map.js
const mapContainer = document.getElementById("map");

if (mapContainer) {
    const lat = mapContainer.dataset.lat;
    const lng = mapContainer.dataset.lng;

    if (lat && lng) {
        const map = L.map("map").setView([lat, lng], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("exact location will be provided after booking")
            .openPopup();
    } else {
        mapContainer.innerHTML = "Location not found";
    }
}
