import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const DebugScreen = () => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  const [status, setStatus] = useState<string>('Verificando...');
  const [response, setResponse] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<any>(null);

  useEffect(() => {
    const testarApi = async () => {
      try {
        const res = await axios.get(`${apiUrl}/cliente/home`); 
        setStatus('✅ Conexão bem-sucedida');
        setResponse(res.data);
      } catch (error: any) {
        setStatus('❌ Erro ao conectar');
        setErrorInfo({
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          url: apiUrl,
        });
      }
    };

    testarApi();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔍 Debug de Conexão com API</Text>
      <Text style={styles.label}>URL da API:</Text>
      <Text style={styles.value}>{apiUrl}</Text>

      <Text style={styles.label}>Status:</Text>
      <Text
        style={[
          styles.value,
          { color: status.startsWith('✅') ? 'green' : 'red' },
        ]}
      >
        {status}
      </Text>

      {response && (
        <>
          <Text style={styles.label}>Resposta da API:</Text>
          <Text style={styles.code}>{JSON.stringify(response, null, 2)}</Text>
        </>
      )}

      {errorInfo && (
        <>
          <Text style={styles.label}>Erro:</Text>
          <Text style={styles.code}>{JSON.stringify(errorInfo, null, 2)}</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  code: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    fontFamily: 'monospace',
    marginTop: 10,
  },
});

export default DebugScreen;
