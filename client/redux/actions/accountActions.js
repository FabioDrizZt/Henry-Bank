import * as C from '../constants'
import axios from "axios";
import { api } from "../../components/Constants/constants";

export const getAccountHistory = ( userId, startDate, toDate ) => {  
  return function (dispatch) {
    axios        
      .get(`${api}/transactions/history/${userId}/${startDate}/${toDate}`)      
      .then((response) => {
        dispatch({ type: C.accountHistory, payload: response.data });
      })
      .catch( err => console.log( err ));
  };
};

export const verifyFunds = ( accountSender ) => {
  return function (dispatch) {
    axios
    // cambiar por la ruta para verificar el saldo de la cuenta
    //   .post(`${api}/users/create`,userData)
      .then((response) => {
        dispatch({ type: C.verifyFunds, payload: response.data });
      })
      .catch( err => console.log( err ));
  };
};

export const sendMoney = ( accountSender, accountReceiver ) => {
  return function (dispatch) {
    axios      
      .post(`${api}/transactions/${accountSender}/to/${accountReceiver}`)
      .then((response) => {
        dispatch({ type: C.sendMoney, payload: response.data });
      })
      .catch( err => console.log( err ));
  };
};