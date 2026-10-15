import React from 'react';
import {
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '@/components/common';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="centres">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'mappin.and.ellipse', selected: 'mappin.and.ellipse' }}
          md="place"
        />
        <NativeTabs.Trigger.Label>Centres</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="comprendre">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'book.closed', selected: 'book.closed.fill' }}
          md="menu_book"
        />
        <NativeTabs.Trigger.Label>Comprendre</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="soutien">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'heart', selected: 'heart.fill' }}
          md="favorite"
        />
        <NativeTabs.Trigger.Label>Soutien</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const safeAreaInsets = useSafeAreaInsets();
  const { isTablet, isDesktop } = useResponsiveLayout();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const tabBarPosition = isDesktop ? 'left' : isTablet ? 'top' : 'bottom';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarPosition,
        tabBarVariant: isDesktop ? 'material' : 'uikit',
        tabBarLabelPosition: isDesktop ? 'beside-icon' : 'below-icon',
        tabBarActiveBackgroundColor: isDesktop ? colors.secondary : undefined,
        tabBarItemStyle: isDesktop
          ? {
              minHeight: 50,
              marginVertical: 4,
              paddingHorizontal: 12,
              borderRadius: 15,
              justifyContent: 'flex-start',
            }
          : isTablet
            ? { flex: 1 }
            : undefined,
        tabBarIconStyle: isDesktop ? { marginRight: 10 } : undefined,
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 10,
          textAlign: isDesktop ? 'left' : 'center',
        },
        tabBarStyle: {
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: isDesktop || isTablet ? 0 : 1,
          borderTopColor: colors.border,
          borderBottomWidth: isTablet ? 1 : 0,
          borderBottomColor: colors.border,
          borderRightWidth: isDesktop ? 1 : 0,
          borderRightColor: colors.border,
          elevation: 0,
          width: isDesktop ? 244 : undefined,
          height: isTablet ? 78 : isWeb ? 84 : undefined,
          paddingTop: isDesktop ? 24 : 6,
          paddingBottom: isDesktop || (isWeb && isTablet)
            ? 0
            : isWeb
              ? 0
              : safeAreaInsets.bottom,
          paddingHorizontal: isDesktop ? 12 : undefined,
        },
        tabBarBackground: () =>
          isIOS && !isTablet ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="centres"
        options={{
          title: 'Centres',
          tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="mappin.and.ellipse" tintColor={color} size={24} />
            ) : (
              <Feather name="map-pin" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="comprendre"
        options={{
          title: 'Comprendre',
          tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="book.closed" tintColor={color} size={23} />
            ) : (
              <Feather name="book-open" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="soutien"
        options={{
          title: 'Soutien',
          tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="heart" tintColor={color} size={22} />
            ) : (
              <Feather name="heart" size={21} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const { isTablet } = useResponsiveLayout();
  if (!isTablet && isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
