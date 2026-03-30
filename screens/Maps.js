import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Modal, Pressable } from "react-native";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { listPlaces, createPlace, deletePlace } from "../utils/api_places";

function Maps() {
  // Retrieve user token from Redux
  const token = useSelector((state) => state.auth.token);
  // Store list of places from API
  const [places, setPlaces] = useState([]);
  // Store place before user saves it (temporary marker)
  const [tempPlace, setTempPlace] = useState(null);
  // Stores place when user saves it (permanent marker)
  const [activePlace, setActivePlace] = useState(null);
  // GPS on or off
  const [gpsEnabled, setGpsEnabled] = useState(null);
  // The Google Maps GPS prompt status
  const [modalVisible, setModalVisible] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check location permission and GPS on or off every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkLocation();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // If token is valid, load saved places
  useEffect(() => {
    if (token) {
      loadPlaces();
    }
  }, [token]);

  const checkLocation = async () => {
    // Check location permission
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const res = await Location.requestForegroundPermissionsAsync();

      if (res.status !== "granted") {
        setLocationError(true);
        return false;
      }
    }
    // Check GPS on or off
    const enabled = await Location.hasServicesEnabledAsync();
    setGpsEnabled(enabled);

    setLocationError(false);
    return true;
  };

  const loadPlaces = async () => {
    const data = await listPlaces(token);
    setPlaces(data || []);
  };

  const closePlaceModal = () => {
    setModalVisible(false);
    setActivePlace(null);
  };

  const cancelTempPlace = () => {
    setModalVisible(false);
    setActivePlace(null);
    setTempPlace(null);
  };

  // Handle marker for new places alongside modal
  const handleLongPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    const result = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const [place] = result;

    const parts = place
      ? [place.street, place.city, place.region].filter(Boolean)
      : [];

    const address = parts.join(", ");

    const newPlace = {
      title: place?.name || "",
      image: null,
      address,
      lat: latitude,
      lng: longitude,
    };

    setTempPlace(newPlace);
    setActivePlace(newPlace);
    setModalVisible(true);
  };

  // Open up modal for saved places marker on tap
  const handleSavedMarkerPress = (place) => {
    setActivePlace(place);
    setModalVisible(true);
  };

  // To add a place
  const addPlaceHandler = async () => {
    if (!tempPlace) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: tempPlace.title,
      address: tempPlace.address,
      lat: tempPlace.lat,
      lng: tempPlace.lng,
    };

    const res = await createPlace(payload, token);

    if (res) {
      const savedPlace = res.place || res.data || res;

      setPlaces((prev) => [...prev, savedPlace]);
      setTempPlace(null);
      setActivePlace(null);
      setModalVisible(false);
    }

    setIsSubmitting(false);
  };

  // To delete a place
  const deletePlaceHandler = async () => {
    if (!activePlace?.id) {
      return;
    }

    setIsSubmitting(true);

    const res = await deletePlace(activePlace.id, token);

    if (res !== undefined) {
      setPlaces((prev) => prev.filter((place) => place.id !== activePlace.id));
      setActivePlace(null);
      setModalVisible(false);
    }

    setIsSubmitting(false);
  };

  // Check if place selected is a temporary place (unsaved) or an active place (saved place) for modal button differences
  const isTempPlace =
    !!tempPlace &&
    !!activePlace &&
    activePlace.lat === tempPlace.lat &&
    activePlace.lng === tempPlace.lng &&
    activePlace.id == null;

  return (
    <View style={styles.container}>
      {locationError && (
        <View style={styles.blockingOverlay}>
          <View style={styles.errorModal}>
            <Text style={styles.errorTitle}>Location Required</Text>

            <Text style={styles.errorText}>
              The Maps feature can only be accessed if location permission is
              enabled while for your device's GPS, it is up to you.
            </Text>

            <Pressable
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.primaryButtonText}>Open Settings</Text>
            </Pressable>
          </View>
        </View>
      )}

      <MapView
        key={gpsEnabled ? "on" : "off"}
        style={styles.map}
        pointerEvents={locationError ? "none" : "auto"}
        initialRegion={{
          latitude: 4.5,
          longitude: 108,
          latitudeDelta: 20,
          longitudeDelta: 28,
        }}
        showsUserLocation={gpsEnabled === true}
        showsMyLocationButton={gpsEnabled === true}
        zoomControlEnabled
        onLongPress={handleLongPress}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: parseFloat(place.lat),
              longitude: parseFloat(place.lng),
            }}
            onPress={() => handleSavedMarkerPress(place)}
          />
        ))}

        {tempPlace && (
          <Marker
            coordinate={{
              latitude: Number(tempPlace.lat),
              longitude: Number(tempPlace.lng),
            }}
            pinColor="orange"
            onPress={() => {
              setActivePlace(tempPlace);
              setModalVisible(true);
            }}
          />
        )}
      </MapView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {activePlace?.title || "Selected Location"}
            </Text>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{activePlace?.address || "-"}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Latitude</Text>
              <Text style={styles.value}>
                {String(activePlace?.lat ?? "-")}
              </Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Longitude</Text>
              <Text style={styles.value}>
                {String(activePlace?.lng ?? "-")}
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              {isTempPlace ? (
                <>
                  <Pressable
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={addPlaceHandler}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isSubmitting ? "Adding..." : "Add Place"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={cancelTempPlace}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[styles.actionButton, styles.dangerButton]}
                    onPress={deletePlaceHandler}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.dangerButtonText}>
                      {isSubmitting ? "Deleting..." : "Delete Place"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={closePlaceModal}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  blockingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  errorOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  errorModal: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    marginBottom: 18,
    textAlign: "center",
    color: "#444",
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  detailBlock: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 15,
    color: "#111",
    lineHeight: 21,
  },
  buttonGroup: {
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#1d4ed8",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
  },
  dangerButton: {
    backgroundColor: "#dc2626",
  },
  dangerButtonText: {
    color: "white",
    fontWeight: "700",
  },
});

export default Maps;
