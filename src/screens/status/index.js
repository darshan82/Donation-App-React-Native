import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../../global';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {loaderOff, loaderOn} from '../../redux/action';
import {FlatList} from 'react-native-gesture-handler';
import AddStatus from '../../components/AddStatus';
import Back from '../../assets/back.png';

const Status = props => {
  const dispatch = useDispatch();
  const [myAds, setMyAds] = useState();
  const {loader} = useSelector(state => state.user);
  const [load, setLoad] = useState(false);

  const fetchData = async () => {
    dispatch(loaderOn());

    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    try {
      const res = await axios.get(`${baseUrl}/api/v1/ad/myAd`, config);
      setMyAds(res.data);
      dispatch(loaderOff());
      setLoad(true);
    } catch (error) {
      if (error.response.status >= 500) {
        if (error.response.status >= 500) {
          dispatch(loaderOff());
          return showToast({
            type: 'error',
            text: 'Something went wrong or Server error!',
          });
        }
        dispatch(loaderOff());
        return showToast({
          type: 'error',
          text: error.response.data?.error
            ? error.response.data?.error
            : error.response.data.errors[0]?.msg,
        });
      }
      console.log(error);
      dispatch(loaderOff());
      setLoad(true);
    }
  };
  useEffect(() => {
    // setLoad(true);
    fetchData();
  }, []);
  return (
    <View
      style={{
        paddingBottom: 30,
        marginBottom: 30,
      }}>
      <View
        style={{
          alignSelf: 'flex-start',
          marginLeft: 10,
          marginBottom: 10,
          marginTop: 15,
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={{
              height: 20,
              width: 20,
            }}
            source={Back}
          />
        </TouchableOpacity>
      </View>
      {!load ? (
        <View
          style={{
            flex: 1,
          }}></View>
      ) : (
        <FlatList
          data={myAds}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                fontWeight: 'bold',
              }}>
              You have no Ads!
            </Text>
          }
          renderItem={({item, index}) => {
            return (
              <AddStatus
                index={index + 1}
                amountPaid={item.amountPaid}
                totalAmount={item?.totalAmount}
                donationRemaining={
                  item.totalAmount - item.amountPaid < 0
                    ? '0'
                    : item.totalAmount - item.amountPaid
                }
                dateCreated={item.date.slice(0, 10)}
                deliveryDate={item.deliveryDate.slice(0, 10)}
                status={item.status}
              />
            );
          }}
        />
      )}
    </View>
  );
};
export default Status;
const styles = StyleSheet.create({
  container: {},
});
