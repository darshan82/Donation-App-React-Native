import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../../theme/color';
import {useForm, Controller} from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import AppButton from '../../components/button';
import Metrix from '../../theme/Metrix';
import Input from '../../components/input';
import RadioForm from 'react-native-simple-radio-button';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {loaderOff, loaderOn, removeUser} from '../../redux/action';
import axios from 'axios';
import {baseUrl, showToast} from '../../global';

const Acceptor = props => {
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  var radio_props = [
    // {label: 'Admin  ', value: 0},
    {label: 'Own  ', value: 0},
    {label: 'Rent  ', value: 1},
  ];
  const selectIamge = onchange => {
    console.log('select image -----');
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          console.log(response, 'Image Respomce');
          const source = {uri: response?.uri};
          console.log(source);
          console.log(response?.assets[0]?.uri);
          //setImage(response?.assets[0].uri);
          onchange(
            `data:${response.assets[0].type};base64,${response?.assets[0]?.base64}`,
          );
          // setForm({...form, amountImg: response?.assets[0]?.base64});
        }
      },
    );
    //  console.log(res, '-----------');
  };

  const {
    control,
    formState: {errors},
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      applicantName: '',
      applicantContact: '',
      applicantCnic: '',
      applicantHomeAdd: '',
      houseOwner: '',
      applicantJobOcc: '',
      applicantSalary: '',
      guardianName: '',
      // guardianContact: "",
      guardianRelation: '',
      guardianCnic: '',
      guardianJobOcc: '',
      guardianSalary: '',
      adDeliveryDate: '',
      itemsNeeded: [],
      CNICImage: '',
      electricityBillImage: '',
      // totalAmount: 39082,
    },
  });
  const submit = async dt => {
    // console.log(dt);
    const formData = getValues();
    const token = await AsyncStorage.getItem('token');
    // console.log(formData.adDeliveryDate, 'datteeeee');
    //return;
    const data = {
      CNICImage: formData.CNICImage,
      applicantAddress: formData.applicantHomeAdd,
      applicantCNIC: Number(formData.applicantCnic),
      applicantContactNo: formData.applicantContact,
      applicantJobOccupation: formData.applicantJobOcc,
      applicantName: formData.applicantName,
      applicantSalary: Number(formData.applicantSalary),
      deliveryDate: formData.adDeliveryDate,
      electricityBillImage: formData.electricityBillImage,
      guardianCNIC: Number(formData.guardianCnic),
      guardianJobOccupation: formData.guardianJobOcc,
      guardianName: formData.guardianName,
      guardianRelationWithApplicant: formData.guardianRelation,
      guardianSalary: Number(formData.guardianSalary),
      houseOwnership: formData.houseOwner,
      itemsNeeded: formData.itemsNeeded,
      totalAmount: 39082,
    };
    // console.log(data.deliveryDate);
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    if (data.deliveryDate == '') {
      return showToast({
        type: 'error',
        text: 'DeliveryDate  must be a valid date',
      });
    }
    try {
      dispatch(loaderOn());
      const res = await axios.post(`${baseUrl}/api/v1/ad`, data, config);
      dispatch(loaderOff());
      showToast({type: 'success', text: 'Your Ads posted successfully'});
    } catch (error) {
      console.log(error.response.data);
      if (error.response.status >= 500) {
        dispatch(loaderOff());
        return showToast({
          type: 'error',
          text: 'Something went wrong or Server error!',
        });
      }
      dispatch(loaderOff());
      // console.log(error.response);
      showToast({type: 'error', text: error.response.data});
      // console.log(error.toString());
    }
  };
  const needed = [
    'Bed set (Bed, Mattress, Wardrobe)',
    'Washing machine',
    'Refrigerator',
    'Crockery',
    'Grinder',
    'Juicer',
    'Iron',
  ];
  return (
    <ScrollView>
      <View
        style={{
          padding: Metrix.VerticalSize(15),
        }}>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.multiRemove(['userType', 'token']);
            dispatch(removeUser());
          }}>
          <Text
            style={{
              textAlign: 'left',
              margin: Metrix.VerticalSize(12),
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.darkBlue,
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignSelf: 'flex-end',
          }}>
          {/* <TouchableOpacity> 

          <Text
            style={{
              fontSize: Metrix.VerticalSize(19),
              color: Colors.darkBlue,
              fontWeight: 'bold',
              textAlign: 'right',
            }}>
            See your Status{' '}
          </Text>
        </TouchableOpacity> */}
          <AppButton
            height={Metrix.VerticalSize(50)}
            onPress={() => props.navigation.navigate('Status')}
            width="100%"
            title="See Your Ads Status"
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: Colors.darkBlue,
            fontSize: Metrix.VerticalSize(20),
            fontWeight: 'bold',
            margin: Metrix.VerticalSize(20),
          }}>
          Enter your Credentials for Posting Ads
        </Text>
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="ApplicantName"
                value={value}
                onChange={onChange}
                maxLength={100}
              />
            );
          }}
          name="applicantName"
        />
        {errors.applicantName?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Applicant ContactNo"
                value={value}
                onChange={e => {
                  console.log(Number(e)=="0")
                  if (+e || Number(e)=="0") {
                    onChange(e);
                  } else {
                    onChange('');
                  }
                }}
                maxLength={100}
              />
            );
          }}
          name="applicantContact"
        />
        {errors.applicantContact?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Applicant CNIC No"
                value={value}
                onChange={e => {
                  if (+e || Number(e)=="0") {
                    onChange(e);
                  } else {
                    onChange('');
                  }
                }}
                maxLength={13}
                keyboardType="numeric"
              />
            );
          }}
          name="applicantCnic"
        />
        {errors.applicantCnic?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Applicant HomeAddress"
                value={value}
                onChange={onChange}
              />
            );
          }}
          name="applicantHomeAdd"
        />
        {errors.applicantHomeAdd?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}

        <View
          style={{
            alignSelf: 'center',
          }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => {
              return (
                <RadioForm
                  initial={3}
                  radio_props={radio_props}
                  onPress={val => {
                    onChange(radio_props[val].label.trim());
                  }}
                  formHorizontal={true}
                />
              );
            }}
            name="houseOwner"
          />
        </View>
        {errors.houseOwner?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Applicant Job Occupation"
                value={value}
                onChange={onChange}
              />
            );
          }}
          name="applicantJobOcc"
        />
        {errors.applicantJobOcc?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Applicant Salary"
                value={value}
                onChange={e => {
                  if (+e) {
                    onChange(e);
                  } else {
                    onChange('');
                  }
                }}
              />
            );
          }}
          name="applicantSalary"
        />
        {errors.applicantSalary?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <View
          style={{
            marginTop: Metrix.VerticalSize(26),
            marginBottom: Metrix.VerticalSize(26),
          }}>
          <Controller
            rules={{required: true}}
            control={control}
            render={({field: {name, onChange, value}}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AppButton
                    height={Metrix.VerticalSize(50)}
                    width="100%"
                    onPress={() => selectIamge(onChange)}
                    title="Choose File"
                  />
                  {getValues('CNICImage') != '' ? (
                    <Image
                      style={{
                        marginLeft: Metrix.HorizontalSize(20),
                        height: 100,
                        width: 100,
                      }}
                      source={{
                        uri: getValues('CNICImage'),
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        color: Colors.darkBlue,
                        marginLeft: 10,
                      }}>
                      Select Applicant CNIC
                    </Text>
                  )}
                </View>
              );
            }}
            name="CNICImage"
          />
        </View>
        {errors.CNICImage?.type === 'required' && (
          <Text style={styles.errorTextColor}>Applicant CNIC is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian Name"
                value={value}
                onChange={onChange}
              />
            );
          }}
          name="guardianName"
        />
        {errors.guardianName?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        {/* <Controller
         rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian ContactNo"
                value={''}
                onChange={() => {}}
              />
            );
          }}
          name=""
        /> */}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian RelationShip With applicant"
                value={value}
                onChange={onChange}
              />
            );
          }}
          name="guardianRelation"
        />
        {errors.guardianRelation?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian CNIC"
                value={value}
                onChange={e => {
                  if (+e || Number(e)=="0") {
                    onChange(e);
                  } else {
                    onChange('');
                  }
                }}
                maxLength={13}
              />
            );
          }}
          name="guardianCnic"
        />
        {errors.guardianCnic?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian Job Occupation"
                value={value}
                onChange={onChange}
              />
            );
          }}
          name="guardianJobOcc"
        />
        {errors.guardianJobOcc?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Controller
          rules={{required: true}}
          control={control}
          render={({field: {name, onChange, value}}) => {
            return (
              <Input
                placeholder="Guardian Salary"
                value={value}
                onChange={e => {
                  if (+e) {
                    onChange(e);
                  } else {
                    onChange('');
                  }
                }}
              />
            );
          }}
          name="guardianSalary"
        />
        {errors.guardianSalary?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <View
          style={{
            marginTop: Metrix.VerticalSize(26),
            marginBottom: Metrix.VerticalSize(26),
          }}>
          <Controller
            rules={{required: true}}
            control={control}
            render={({field: {name, onChange, value}}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AppButton
                    height={Metrix.VerticalSize(50)}
                    width="100%"
                    onPress={() => selectIamge(onChange)}
                    title="Choose File"
                  />
                  {getValues('electricityBillImage') != '' ? (
                    <Image
                      style={{
                        marginLeft: Metrix.HorizontalSize(20),
                        height: 100,
                        width: 100,
                      }}
                      source={{
                        uri: getValues('electricityBillImage'),
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        color: Colors.darkBlue,
                        marginLeft: 10,
                      }}>
                      Electricity Bill
                    </Text>
                  )}
                </View>
              );
            }}
            name="electricityBillImage"
          />
        </View>
        {errors.electricityBillImage?.type === 'required' && (
          <Text
            style={[
              styles.errorTextColor,
              {marginBottom: Metrix.VerticalSize(20)},
            ]}>
            Electricity Bill is required
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppButton
            height={Metrix.VerticalSize(50)}
            width={'100%'}
            onPress={() => setShowDatePicker(true)}
            title={
              getValues('adDeliveryDate') != ''
                ? 'Your Date'
                : 'Select Delivery Date'
            }
          />

          <Text
            style={{
              color: Colors.darkBlue,
              marginLeft: 10,
              fontWeight: 'bold',
              fontSize: Metrix.VerticalSize(18),
            }}>
            {getValues('adDeliveryDate') != ''
              ? getValues('adDeliveryDate').toString()
              : 'YY-MM-DD'}
          </Text>
        </View>
        {errors.adDeliveryDate?.type === 'required' && (
          <Text
            style={[
              styles.errorTextColor,
              {marginBottom: Metrix.VerticalSize(20)},
            ]}>
            Electricity Bill is required
          </Text>
        )}
        {showDatePicker == true ? (
          <Controller
            rules={{required: true}}
            control={control}
            render={({field: {name, onChange, value}}) => {
              return (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  onChange={(event, val) => {
                    //   console.log(val, 'ssdsdsdsd');
                    // console.log(  moment(val).format('YYYY-MM-DD'))
                    onChange(moment(val).format('YYYY-MM-DD'));
                    setShowDatePicker(false);
                  }}
                />
              );
            }}
            name="adDeliveryDate"
          />
        ) : null}
        {errors.adDeliveryDate?.type === 'required' && (
          <Text style={styles.errorTextColor}>This field is required</Text>
        )}
        <Text
          style={{
            color: Colors.darkBlue,
            fontSize: Metrix.VerticalSize(20),
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: Metrix.VerticalSize(15),
          }}>
          Items Needed
        </Text>
        <View>
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={1}
                  onChnage={onChange}
                  text={'Bed set (Bed, Mattress, Wardrobe)'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes(
                    'Bed set (Bed, Mattress, Wardrobe)',
                  )}
                />
              );
            }}
            name="itemsNeeded"
          />
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={2}
                  onChnage={onChange}
                  text={'Washing machine'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Washing machine')}
                />
              );
            }}
            name="itemsNeeded"
          />

          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={3}
                  onChnage={onChange}
                  text={'Refrigerator'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Refrigerator')}
                />
              );
            }}
            name="itemsNeeded"
          />
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={4}
                  onChnage={onChange}
                  text={'Crockery'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Crockery')}
                />
              );
            }}
            name="itemsNeeded"
          />
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={5}
                  onChnage={onChange}
                  text={'Grinder'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Grinder')}
                />
              );
            }}
            name="itemsNeeded"
          />
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Juicer')}
                  ind={6}
                  onChnage={onChange}
                  text={'Juicer'}
                />
              );
            }}
            name="itemsNeeded"
          />
          <Controller
            control={control}
            render={({field: {name, onChange}}) => {
              return (
                <CheckBoxWithText
                  ind={7}
                  onChnage={onChange}
                  text={'Iron'}
                  itemPresent={getValues('itemsNeeded')}
                  value={getValues('itemsNeeded').includes('Iron')}
                />
              );
            }}
            name="itemsNeeded"
          />
        </View>
        <View
          style={{
            marginTop: Metrix.VerticalSize(20),
            marginBottom: Metrix.VerticalSize(30),
          }}>
          <AppButton
            height={Metrix.VerticalSize(60)}
            onPress={() => {
              handleSubmit(submit)();
            }}
            width="100%"
            title="SUBMIT"
          />
        </View>
      </View>
    </ScrollView>
  );
};
const CheckBoxWithText = ({itemPresent, value, onChnage, text}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <CheckBox
        disabled={false}
        value={value}
        onValueChange={
          val => {
            if (val == true) {
              itemPresent.push(text);
              onChnage(itemPresent);
            } else {
              const temp = itemPresent.filter(it => it != text);
              onChnage(temp);
            }
          }
          // val => console.log(val)
        }
        tintColors={{
          true: Colors.darkBlue,
          false: Colors.seaBlue,
        }}
      />
      <Text
        style={{
          color: Colors.darkBlue,
        }}>
        {text}
      </Text>
    </View>
  );
};
export default Acceptor;
const styles = StyleSheet.create({
  container: {},
  errorTextColor: {
    color: Colors.darkBlue,
  },
});
