import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';

import waterdropImg from '../assets/waterdrop.png';
import { loadPlants, Plant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  function handleRemove(plant: Plant) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await removePlant(plant.id);

            setMyPlants((oldData) => (
              oldData.filter((item) => item.id !== plant.id)
            ))
          } catch (error) {
            Alert.alert('Não foi possível remover!');
          }
        }
      }
    ])
  }

  async function loadStorageData() {
    const plantsStoraged = await loadPlants();

    const nextTime = formatDistance(
      new Date(plantsStoraged[0]?.dateTimeNotification).getTime(),
      new Date().getTime(),
      { locale: ptBR }
    )

    setNextWatered(
      `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`
    )

    setMyPlants(plantsStoraged);
    setLoading(false);
  }

  useEffect(() => {
    loadStorageData();
  }, [])

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <View style={{ width: '100%', paddingHorizontal: 32 }}>
        <Header />
      </View>

      <View style={styles.spotlight}>
        {myPlants.length > 0 ? <>
          <Image
            source={waterdropImg}
            style={styles.spotlightImage}
          />
          <Text style={styles.spotlightText}>
            {nextWatered}
          </Text>
        </> : <>
          <Text style={styles.spotlightText}>
            Nenhuma planta cadastrada.
          </Text>
        </>}
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => { handleRemove(item) }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    overflow: 'visible'
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    marginHorizontal: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingLeft: 20,
    fontFamily: fonts.text
  },
  plants: {
    flex: 1,
    width: '100%',
    overflow: 'visible',
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
    paddingHorizontal: 32,
  },
  flatList: {
    flex: 1,
    overflow: 'visible',
    paddingHorizontal: 32,
  }
})