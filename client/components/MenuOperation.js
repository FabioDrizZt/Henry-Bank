import React, { useState, useEffect } from "react";
import VirtualKeyboard from "react-native-virtual-keyboard";
import { Alert, Modal, View, TouchableHighlight, Image } from "react-native";
import axios from "axios";
import { api } from "./Constants/constants";
import styles from "../Styles/keyboardStyles";
import {
  Container,
  Header,
  Content,
  Footer,
  Input,
  FooterTab,
  Button,
  Icon,
  Text,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { getUserLogged } from "../redux/actions/authActions";

export default MenuOperation = ({ navigation, screen }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputKeyboard, setInputKeyboard] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.auth);

  useEffect(() => {
    if (inputKeyboard.length === 4 && userLogged.success) {
      let values = {
        userId: userLogged.user.id,
        passcode: inputKeyboard,
      };

      axios
        .post(`${api}/auth/check-passcode`, values)
        .then((response) => {
          if (response.data.success) {
            setInputKeyboard("");
            setError('');
            setModalVisible(false);
            navigation.navigate("myCards");
          } else {
            setError(response.data.message);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [inputKeyboard]);

  return (
    <>
      {userLogged.user.id === undefined ? (
        <View>
          <ActivityIndicator size={100} color="#ffff57" />
        </View>
      ) : (
        <>
          <FooterTab style={{ backgroundColor: "#151515" }}>
            <Button vertical onPress={() => navigation.navigate("userStats")}>
              <Icon
                name="chart-bar"
                type="FontAwesome5"
                style={
                  screen !== "stats" ? { color: "white" } : { color: "#ffff6d" }
                }
              />
              <Text style={{ color: "white", fontSize: 9 }}>STATS</Text>
            </Button>

            <Button vertical onPress={() => setModalVisible(!modalVisible)}>
              <Icon
                name="card"
                style={
                  screen !== "cards" ? { color: "white" } : { color: "#ffff6d" }
                }
              />
              <Text style={{ color: "white", fontSize: 9 }}>Cards</Text>
            </Button>
            <Button vertical onPress={() => navigation.navigate("position")}>
              <Icon
                name="home"
                type="FontAwesome5"
                style={
                  screen !== "position"
                    ? { color: "white" }
                    : { color: "#ffff6d" }
                }
              />
              <Text style={{ color: "white", fontSize: 9 }}>HOME</Text>
            </Button>

            <Button
              vertical
              onPress={() => navigation.navigate("accountHistory")}
            >
              <Icon
                style={
                  screen !== "accounts"
                    ? { color: "white" }
                    : { color: "#ffff6d" }
                }
                type="FontAwesome"
                name="dollar"
              />
              <Text style={{ color: "white", fontSize: 9 }}>History</Text>
            </Button>

            <Button vertical onPress={() => navigation.navigate("contacts")}>
              <Icon
                name="users"
                type="FontAwesome5"
                style={
                  screen !== "contacts"
                    ? { color: "white" }
                    : { color: "#ffff6d" }
                }
              />
              <Text style={{ color: "white", fontSize: 9 }}>CONTACTS</Text>
            </Button>
          </FooterTab>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <View style={styles.logoView}>
                <Image
                  source={require("../assets/henryLogoBlack.jpg")}
                  style={styles.logoImg}
                />
                <Text style={styles.modalText}>
                  To proceed, please enter your passcode
                </Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
              <View style={styles.inputs}>
              <Input
                  secureTextEntry={true}
                  disabled={true}
                  rounded
                  name="inputKeyboard[0]"
                  value={inputKeyboard[0]}
                  style={styles.textInput}
                />
                <Input
                  secureTextEntry={true}
                  disabled={true}
                  rounded
                  name="inputKeyboard[1]"
                  value={inputKeyboard[1]}
                  style={styles.textInput}
                />
                <Input
                  secureTextEntry={true}
                  disabled={true}
                  rounded
                  name="inputKeyboard[2]"
                  value={inputKeyboard[2]}
                  style={styles.textInput}
                />
                <Input
                  secureTextEntry={true}
                  disabled={true}
                  rounded
                  name="inputKeyboard[3]"
                  value={inputKeyboard[3]}
                  style={styles.textInput}
                />
              </View>
              <VirtualKeyboard
                color="black"
                pressMode="string"
                onPress={(val) => setInputKeyboard(val)}
                style={styles.keyboard}
              />
              <View style={styles.backButtonView}>
                <TouchableHighlight
                  style={styles.backButton}
                  onPress={() => {
                    setInputKeyboard("");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>CANCEL</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
};
