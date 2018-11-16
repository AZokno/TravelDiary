import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import logoMiniImage from '../assets/logo-mini-cir.png';

import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { authLogout } from '../store/actions/index';
import { KOLIBER_COLOR } from '../utility/config';

class SideDrawer extends Component {
    render () {
        return (
            <View style={[styles.container, {width: (Dimensions.get('window').width)*0.5}]}>
                <View style={styles.drawerItem}>
                    <Image source={logoMiniImage} style={styles.logoMini}/>
                    <Text style={styles.mainText}>{`TRAVEL\nDIARY`}</Text>
                </View>
                <TouchableOpacity onPress={this.props.onLogout}>                
                    <View style={styles.drawerItem}>
                        <Icon name="md-power" size={30} color={KOLIBER_COLOR} style={styles.drawerIcon} />
                        <Text style={styles.drawerText}>Sign out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1        
    },
    mainText:{
        marginTop: 8,
        textAlign: "center",
        fontSize: 22,
        marginBottom: 10
    },
    logoMini: {
        width: 50,
        height: 50,
        marginLeft: 5
    },
    drawerMenu: {
        alignItems: "center",
    },
    drawerItem: {
        alignItems: "center",
        flexDirection: "row"
    },
    drawerIcon: {
        marginRight: 10,
        marginLeft: 10
    },
    drawerText: {
        fontSize: 20
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout())
    };
};

export default connect(null, mapDispatchToProps)(SideDrawer);