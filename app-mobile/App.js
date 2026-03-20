import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, TextInput, View } from "react-native";

import { getBusinessBySlug, searchBusiness } from "./src/services/api";
import { clearBusiness, getBusiness, saveBusiness } from "./src/storage/businessStorage";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [result, setResult] = useState([]);

  useEffect(() => {
    getBusiness().then((business) => {
      if (business) {
        setSelectedBusiness(business);
      }
    });
  }, []);

  async function onSearch() {
    const data = await searchBusiness(query);
    setResult(data || []);
  }

  async function pickBusiness(slug) {
    const business = await getBusinessBySlug(slug);
    await saveBusiness(business);
    setSelectedBusiness(business);
  }

  async function changeBusiness() {
    await clearBusiness();
    setSelectedBusiness(null);
  }

  return (
    <SafeAreaView style={{ padding: 16 }}>
      {!selectedBusiness ? (
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 24 }}>Buscar barbería</Text>
          <TextInput value={query} onChangeText={setQuery} placeholder="Nombre" style={{ borderWidth: 1, padding: 8 }} />
          <Button title="Buscar" onPress={onSearch} />
          <Button title="Escanear QR (pendiente)" onPress={() => {}} />
          {result.map((item) => (
            <View key={item.id} style={{ marginTop: 8 }}>
              <Text>{item.name}</Text>
              <Button title="Entrar" onPress={() => pickBusiness(item.slug)} />
            </View>
          ))}
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 22 }}>{selectedBusiness.name}</Text>
          <Text>{selectedBusiness.description}</Text>
          <Text>Reserva de turnos desde esta barbería.</Text>
          <Button title="Cambiar barbería" onPress={changeBusiness} />
        </View>
      )}
    </SafeAreaView>
  );
}
