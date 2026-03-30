import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useLayoutEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import Loading from "./Loading";
import * as Linking from "expo-linking";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function Cam() {
  const cameraRef = useRef(null);
  // No mode, camera mode or QR mode
  const [mode, setMode] = useState(null);
  // For front facing or selfie facing camera
  const [facing, setFacing] = useState("back");
  // For camera usage permission
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // QR related
  const [qrData, setQrData] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [scanned, setScanned] = useState(false);

  // For back button on header (not exactly used but the useLayoutEffect requires usage of navigation component. If not, cannot work)
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        mode !== null ? (
          <Pressable onPress={() => setMode(null)} style={{ marginLeft: 16 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        ) : null,
    });
  }, [navigation, mode]);

  // Take a picture
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();

    if (!photo) return;

    setPhoto(photo);
    setShowModal(true);
  };

  // Change cameras
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleQRCode = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setQrData(data);
    setShowQRModal(true);
  };

  // While awaiting permission retrieval
  if (!permission) {
    return <Loading />;
  }

  // Revoke or denial of permission
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>Camera permission is required</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!mode) {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.modeBtn}
          onPress={() => setMode("photo")}
        >
          <Text style={styles.modeText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeBtn} onPress={() => setMode("qr")}>
          <Text style={styles.modeText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // The Camera
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mirror={true}
        barcodeScannerSettings={
          mode === "qr" ? { barcodeTypes: ["qr"] } : undefined
        }
        onBarcodeScanned={mode === "qr" ? handleQRCode : undefined}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Text style={styles.text2}>Flip</Text>
        </TouchableOpacity>

        {/* Only shown in photo taking mode */}
        {mode === "photo" && (
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.text1}>Capture</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Image modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            {photo && (
              <Image
                source={{ uri: photo.uri }}
                style={[
                  styles.image,
                  photo.width > photo.height
                    ? styles.landscape
                    : styles.portrait,
                ]}
                // Auto set landscape or portrait mode based on the way image is taken
                resizeMode="contain"
              />
            )}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showQRModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={{ marginBottom: 10 }}>QR Result:</Text>

            <TouchableOpacity onPress={() => Linking.openURL(qrData)}>
              <Text style={{ color: "blue", marginBottom: 10 }}>{qrData}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setShowQRModal(false);
                // Prevent instant re-scan and instant modal pop up again in case user did not move phone away
                setTimeout(() => {
                  setScanned(false);
                }, 1500);
              }}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  message: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
  },

  camera: {
    flex: 1,
  },

  flipButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  captureButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },

  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  text1: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  text2: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "85%",
  },

  image: {
    width: 260,
    height: 360,
    borderRadius: 10,
    marginBottom: 16,
  },

  closeBtn: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  closeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  portrait: {
    width: 260,
    height: 360,
  },

  landscape: {
    width: 320,
    height: 220,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  modeText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  modeBtn: {
    width: "80%",
    backgroundColor: "#1f1f1f",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
});

export default Cam;
