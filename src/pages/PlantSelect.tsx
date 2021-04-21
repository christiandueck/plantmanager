import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Environment {
  key: string;
  title: string;
}

interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  }
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);

  async function fetchEnvironment() {
    const { data } = await api.get('plants_environments?_sort=title&_order=asc')
    setEnvironments([{
      key: 'all',
      title: 'Todos'
    }, ...data])
  }

  async function fetchPlants() {
    const { data } = await api.get('plants?_sort=name&_order=asc')
    setPlants(data)
  }

  function handleEnvironmentSelect(environment: string) {
    setEnvironmentSelected(environment);

    if (environment == 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter(plant => plant.environments.includes(environment));
    setFilteredPlants(filtered);
  }

  useEffect(() => {
    fetchEnvironment();
    fetchPlants();
    setFilteredPlants(plants);
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>
          Em qual ambiente
      </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
      </Text>

      </View>

      <View>
        <FlatList
          data={environments}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelect(item.key)}
            />
          )}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 23,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 23,
    color: colors.heading
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  },
  plantsList: {
    justifyContent: 'space-between'
  }
})