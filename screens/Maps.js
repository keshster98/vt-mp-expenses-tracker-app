import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Text, Modal, Button } from "react-native";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { useState, useEffect } from "react";

function Maps() {
  const [tempPlace, setTempPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationError, setLocationError] = useState(false);

  // Check app location permission and GPS enabling status
  const checkLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status !== "granted") {
      const res = await Location.requestForegroundPermissionsAsync();

      if (res.status !== "granted") {
        setLocationError(true);
        return false;
      }
    }

    const enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      setLocationError(true);
      return false;
    }

    setLocationError(false);
    return true;
  };

  useEffect(() => {
    checkLocation();
  }, []);

  // Handle marker creation
  const handleLongPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    const ok = await checkLocation();
    if (!ok) return;

    // Reverse geocode (get address)
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
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Location/GPS error modal */}
      <Modal visible={locationError} transparent animationType="fade">
        <View style={styles.errorOverlay}>
          <View style={styles.errorModal}>
            <Text style={styles.errorText}>
              The Maps feature can only be accessed if location permission is
              enabled and your GPS is turned on.
            </Text>
            <View style={{ height: 10 }} />
            {/* Send user to app settings to turn on permission for location */}
            <Button
              title="Open Settings"
              onPress={() => Linking.openSettings()}
            />
            <View style={{ height: 10 }} />
            <Button title="Retry" onPress={checkLocation} />
          </View>
        </View>
      </Modal>

      {/* The Map */}
      <MapView
        style={styles.map}
        pointerEvents={locationError ? "none" : "auto"}
        initialRegion={{
          latitude: 4.5,
          longitude: 108,
          latitudeDelta: 20,
          longitudeDelta: 28,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onLongPress={handleLongPress}
      >
        {/* Marker shown only when user taps on the map at a specific spot */}
        {tempPlace && (
          <Marker
            coordinate={{
              latitude: tempPlace.lat,
              longitude: tempPlace.lng,
            }}
          />
        )}
      </MapView>

      {/* Marker Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {tempPlace?.title || "Selected Location"}
            </Text>

            <View style={styles.details}>
              <Text style={{ fontWeight: 600 }}>
                Address:{" "}
                <Text style={{ fontWeight: 0 }}>{tempPlace?.address}</Text>
              </Text>
            </View>

            <View style={{ height: 10 }} />

            <View style={styles.details}>
              <Text style={{ fontWeight: 600 }}>
                Latitude:{" "}
                <Text style={{ fontWeight: 0 }}>{tempPlace?.lat}</Text>
              </Text>
            </View>

            <View style={{ height: 10 }} />

            <View style={styles.details}>
              <Text style={{ fontWeight: 600 }}>
                Longitude:{" "}
                <Text style={{ fontWeight: 0 }}>{tempPlace?.lng}</Text>
              </Text>
            </View>

            <View style={{ marginTop: 15 }}>
              <Button
                title="Add Place"
                onPress={() => {
                  setModalVisible(false);
                  setTempPlace(null);
                }}
              />
            </View>
            <View style={{ height: 10 }} />
            <Button
              title="Close"
              onPress={() => {
                setModalVisible(false);
                setTempPlace(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  errorOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  errorModal: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  errorText: {
    marginBottom: 15,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  details: {
    flexDirection: "row",
  },
});

export default Maps;
