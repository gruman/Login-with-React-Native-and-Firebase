import React, { useState, useEffect } from "react";

import "./constants/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

export default function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  function handleLogout() {
    signOut(auth);
  }

  function handleCreate() {
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setUser(userCredential.user);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      setErrorMessage("Please fill out both fields.");
    }
  }

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userCredential) => {
      // check if user is already logged in
      if (userCredential) {
        setUser(userCredential);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Login Website</Text>
      {
        user ?
        <>
        <Text>Logged in</Text>
        <Pressable onPress={() => handleLogout()}>
          <Text>Sign Out</Text>
        </Pressable>
        </>
        :
        <>
          <Text>Create an account to login.</Text>
          {errorMessage && <Text>{errorMessage}</Text>}
          <TextInput
            value={email}
            onChangeText={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <TextInput
          secureTextEntry={true}
            value={password}
            onChangeText={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Pressable type="submit" onPress={() => handleLogin()}>
            <Text>Login</Text>
          </Pressable>
          <Pressable type="submit" onPress={() => handleCreate()}>
            <Text>Create Account</Text>
          </Pressable>
        </>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
