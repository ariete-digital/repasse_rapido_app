import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Header, getHeaderTitle } from '@react-navigation/elements';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@theme/GlobalStyles';
import { Text, TouchableOpacity } from 'react-native';
import { Login, Register, RegisterSuccess, ForgotPassword, ForgotPasswordSuccess } from '../screens';
import { RootTabParamList } from './app.routes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const AuthStack = createNativeStackNavigator();

type AuthRoutes = {
  login: undefined;
  register: undefined;
  registerSuccess: undefined;
  forgotPassword: undefined;
  forgotPasswordSuccess: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const AuthRoutes = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList, 'home'>>();
  return (
    <AuthStack.Navigator initialRouteName="Login" >
      <AuthStack.Screen
        name="login"
        component={Login}
        options={{
          headerShown: false,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
      <AuthStack.Screen
        name="register"
        component={Register}
        options={{
          headerShown: false,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
      <AuthStack.Screen
        name="registerSuccess"
        component={RegisterSuccess}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="forgotPasswordSuccess"
        component={ForgotPasswordSuccess}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthRoutes;
