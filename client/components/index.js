// import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import LogIn from "./LogIn";
//import SignIn from "./components/SignIn";
import SignupForm from "./SignupForm";
import ForgotPass from "./ForgotPass";
import Position from "./Position";
// import CardPosition from "./components/CardPosition";
// import MenuOperation from "./components/MenuOperation";
// import Transaction from "./components/Transaction";
import TakePhoto from "./TakePhoto";
import Photo from "./Photo";
import { useDispatch, useSelector } from "react-redux";
import { getUserLogged } from "../redux/actions/authActions";

const Stack = createStackNavigator();

export default function Index() {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.auth);
  
  useEffect(() => dispatch(getUserLogged()), []);
  console.log(userLogged)
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="position" component={Position} />
        <Stack.Screen name="login" component={LogIn} />
        <Stack.Screen name="sign" component={SignupForm} />
        <Stack.Screen name="forgotPass" component={ForgotPass} />
        {/* <Stack.Screen name="cardPosition" component={CardPosition} />
          <Stack.Screen name="menuOp" component={MenuOperation} />
          <Stack.Screen name="transaction" component={Transaction} />           */}
        <Stack.Screen name="takePhoto" component={TakePhoto} />
        <Stack.Screen name="photo" component={Photo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
