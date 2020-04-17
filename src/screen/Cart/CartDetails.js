import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, ListItem, Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import myColors from '../../config/colors';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import {getShippingCost} from '../../redux/actions/ShippingActions';
import {connect} from 'react-redux';
import {convertToRupiah} from '../../utils/convert';
function CartDetails(props) {
  const dataFromCart = props.route.params;
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [courierList, setCourierList] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const selectCourier = data => {
    setSelectedCourier(data);
    toggleModal();
    setTotalPayment(dataFromCart.totalPayment + data.cost);
  };

  useEffect(() => {
    props.getShippingCost(null, null, null, res => {
      setCourierList(res.data);
    });
  }, []);
  return (
    <ScrollView>
      <View style={localStyle.container}>
        {/* Modal */}
        <Modal isVisible={showModal} style={{margin: 0}} coverScreen={true}>
          <View style={{flex: 1}}>
            <View
              style={{
                backgroundColor: myColors.WHITE,
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: 300,
              }}>
              <View
                style={{
                  padding: 15,
                  borderBottomColor: myColors.SECOND_GREY,
                  borderBottomWidth: 1,
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Pilih Kurir
                </Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Icon name="close" size={23} />
                </TouchableOpacity>
              </View>
              <View style={{paddingHorizontal: 15, paddingVertical: 10}}>
                {courierList &&
                  courierList.costs.map((data, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        selectCourier({
                          title: `${courierList.code.toUpperCase()} ${
                            data.service
                          }`,
                          cost: data.cost[0].value,
                          etd: data.cost[0].etd,
                        })
                      }>
                      <ListItem
                        containerStyle={{marginVertical: 2}}
                        title={`${courierList.code.toUpperCase()} ${
                          data.service
                        }`}
                        titleStyle={{fontSize: 14, paddingBottom: 5}}
                        subtitle={`${convertToRupiah(data.cost[0].value)} | ${
                          data.cost[0].etd
                        } Hari`}
                        leftAvatar={{
                          source: {
                            uri: courierList.logo,
                          },
                          rounded: false,
                        }}
                        bottomDivider
                        chevron
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>
        </Modal>
        {/* Detail Pengiriman */}
        <View style={{marginBottom: 20}}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginTop: 20,
              marginBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: myColors.SECOND_GREY,
              paddingBottom: 10,
            }}>
            Detail Pengiriman
          </Text>

          <View style={[localStyle.details]}>
            <Text style={{color: myColors.MAIN_GREY}}>Penerima</Text>
            <Text style={{fontSize: 15, fontWeight: 'bold', marginBottom: 5}}>
              Aldi Pranata
            </Text>
            <Text style={{fontSize: 12}}>
              682185142048. Jl Raya Bojongsoang, Kec. Bojongsoang, Bandung Jawa
              Barat
            </Text>
          </View>
        </View>

        {/* Informasi Pesanan */}

        <View>
          <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 20}}>
            Informasi Pesanan
          </Text>
          {dataFromCart &&
            dataFromCart.cart.map((data, index) => (
              <ListItem
                containerStyle={{marginVertical: 2}}
                title={data.name}
                titleStyle={{fontSize: 14, paddingBottom: 5}}
                subtitle={`${convertToRupiah(data.price)} | ${
                  data.quantity
                } item`}
                leftAvatar={{
                  source: {
                    uri:
                      'https://ecs7.tokopedia.net/img/cache/700/product-1/2020/2/18/batch-upload/batch-upload_41d6e73d-6d06-479c-9680-b75ef746f82e.jpg',
                  },
                  rounded: false,
                }}
                bottomDivider
                chevron
              />
            ))}
        </View>

        {/* Select Jasa Kurir */}
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 20}}>
          Informasi Pesanan
        </Text>
        <View style={[localStyle.inline, localStyle.justifyContent]}>
          <View style={{marginTop: 15}}>
            <Text>Jasa Pengiriman</Text>
            {selectCourier && (
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 'bold',
                    marginTop: 10,
                    color: myColors.BLACK,
                  }}>
                  {selectedCourier && selectedCourier.title}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: myColors.ORANGE,
                  }}>
                  {selectedCourier && convertToRupiah(selectedCourier.cost)}
                </Text>
              </View>
            )}
          </View>
          <Button
            onPress={toggleModal}
            containerStyle={{margin: 5}}
            titleStyle={{fontSize: 14}}
            title="Pilih"
            buttonStyle={{
              backgroundColor: myColors.ORANGE,
              paddingHorizontal: 20,
            }}
          />
        </View>

        {/* Basic Info */}
        {/* <View style={[localStyle.containerInfo, localStyle.inline]}>
          <Text style={localStyle.infoLabel}>Status</Text>
          <Text style={localStyle.status}>Pesanan Selesai</Text>
        </View>
        <View style={[localStyle.containerInfo, localStyle.inline]}>
          <Text style={localStyle.infoLabel}>Tanggal Pembelian</Text>
          <Text>11 Mar 2020</Text>
        </View>
        <View style={[localStyle.containerInfo, localStyle.inline]}>
          <Text style={localStyle.infoLabel}>Nomor Transaksi</Text>
          <Text style={{fontSize: 14}}>TRX234344444</Text>
        </View> */}

        {/* Detail Pembayaran */}
        <View>
          <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 20}}>
            Detail Pembayaran
          </Text>
          <Card>
            <View style={[localStyle.details, localStyle.inline]} />
            <View style={[localStyle.inline, localStyle.details]}>
              <Text>Total Pembelian</Text>
              <Text>{convertToRupiah(dataFromCart.totalPayment)}</Text>
            </View>
            {selectedCourier && selectedCourier.cost && (
              <View style={[localStyle.inline, localStyle.details]}>
                <Text>Total Ongkir</Text>
                <Text>{convertToRupiah(selectedCourier.cost)}</Text>
              </View>
            )}
            <View style={[localStyle.inline, localStyle.totalContainer]}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Total Pembayaran
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: myColors.ORANGE,
                }}>
                {selectedCourier ? convertToRupiah(totalPayment) : '-'}
              </Text>
            </View>
          </Card>
        </View>
        <View style={{marginTop: 15}}>
          <Button
            containerStyle={{margin: 5}}
            titleStyle={{fontSize: 14}}
            disabled={!selectedCourier ? true : null}
            title="Pilih Pembayaran"
            buttonStyle={{
              backgroundColor: myColors.ORANGE,
              paddingHorizontal: 20,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const localStyle = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  details: {
    marginTop: 5,
    paddingTop: 2,
  },
  totalContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: myColors.SECOND_GREY,
  },
  total: {
    fontSize: 18,
  },
  containerInfo: {
    marginVertical: 5,
    paddingVertical: 0,
  },
  justifyContent: {
    alignItems: 'center',
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: myColors.MAIN_GREY,
  },
  status: {
    color: myColors.GREEN,
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {getShippingCost};

export default connect(
  null,
  mapDispatchToProps,
)(CartDetails);
